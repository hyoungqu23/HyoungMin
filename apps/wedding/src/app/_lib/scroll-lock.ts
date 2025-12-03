export type BodyScrollOptions = {
  reserveScrollBarGap?: boolean;
  allowTouchMove?: (el: HTMLElement | Element) => boolean;
};

type Lock = {
  targetElement: HTMLElement;
  options: BodyScrollOptions;
};

type BodyPosition = {
  position: string;
  top: string;
  left: string;
};

// 1. Passive Event Listener 지원 여부 확인
let hasPassiveEvents = false;
if (typeof window !== "undefined") {
  const passiveTestOptions = Object.defineProperty({}, "passive", {
    get() {
      hasPassiveEvents = true;
      return undefined;
    },
  });
  window.addEventListener("testPassive", () => {}, passiveTestOptions);
  window.removeEventListener("testPassive", () => {}, passiveTestOptions);
}

// 2. iOS 디바이스 감지 (iPadOS 13+ 포함)
const isIosDevice =
  typeof window !== "undefined" &&
  window.navigator &&
  window.navigator.platform &&
  (/iP(ad|hone|od)/.test(window.navigator.platform) ||
    (window.navigator.platform === "MacIntel" &&
      window.navigator.maxTouchPoints > 1));

let locks: Lock[] = [];
let documentListenerAdded: boolean = false;
let initialClientY: number = -1;
let previousBodyOverflowSetting: string | undefined;
let previousBodyPosition: BodyPosition | undefined;
let previousBodyPaddingRight: string | undefined;

// 특정 요소가 터치 이벤트를 받아야 하는지 확인 (옵션 처리)
const allowTouchMove = (el: EventTarget | null): boolean =>
  locks.some(
    (lock) =>
      lock.options.allowTouchMove?.(el as HTMLElement | Element) === true,
  );

// 기본 터치 동작 막기
const preventDefault = (rawEvent: TouchEvent): void => {
  const e = rawEvent;

  // 사용자가 allowTouchMove 옵션으로 허용한 요소라면 막지 않음
  if (allowTouchMove(e.target)) {
    return;
  }

  // 멀티 터치(줌 등)는 막지 않음
  if (e.touches.length > 1) {
    return;
  }

  if (e.cancelable) {
    e.preventDefault();
  }
};

// PC/Android용: overflow hidden 처리
const setOverflowHidden = (options?: BodyScrollOptions): void => {
  if (previousBodyPaddingRight === undefined) {
    const reserveScrollBarGap = options?.reserveScrollBarGap === true;
    const scrollBarGap =
      window.innerWidth - document.documentElement.clientWidth;

    if (reserveScrollBarGap && scrollBarGap > 0) {
      const computedBodyPaddingRight = parseInt(
        window
          .getComputedStyle(document.body)
          .getPropertyValue("padding-right"),
        10,
      );
      previousBodyPaddingRight = document.body.style.paddingRight;
      document.body.style.paddingRight = `${computedBodyPaddingRight + scrollBarGap}px`;
    }
  }

  if (previousBodyOverflowSetting === undefined) {
    previousBodyOverflowSetting = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};

const restoreOverflowSetting = (): void => {
  if (previousBodyPaddingRight !== undefined) {
    document.body.style.paddingRight = previousBodyPaddingRight;
    previousBodyPaddingRight = undefined;
  }

  if (previousBodyOverflowSetting !== undefined) {
    document.body.style.overflow = previousBodyOverflowSetting;
    previousBodyOverflowSetting = undefined;
  }
};

// iOS용: Position Fixed 처리
const setPositionFixed = (): void => {
  window.requestAnimationFrame(() => {
    if (previousBodyPosition === undefined) {
      previousBodyPosition = {
        position: document.body.style.position,
        top: document.body.style.top,
        left: document.body.style.left,
      };

      const { scrollY, scrollX, innerHeight } = window;
      document.body.style.position = "fixed";
      document.body.style.top = `${-scrollY}px`;
      document.body.style.left = `${-scrollX}px`;

      setTimeout(() => {
        window.requestAnimationFrame(() => {
          const bottomBarHeight = innerHeight - window.innerHeight;
          if (bottomBarHeight > 0 && scrollY >= innerHeight) {
            document.body.style.top = `${-(scrollY + bottomBarHeight)}px`;
          }
        });
      }, 300);
    }
  });
};

const restorePositionSetting = (): void => {
  if (previousBodyPosition !== undefined) {
    const y = -parseInt(document.body.style.top, 10);
    const x = -parseInt(document.body.style.left, 10);

    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;

    window.scrollTo(x, y);

    previousBodyPosition = undefined;
  }
};

// 모달 내부 스크롤이 끝에 도달했는지 확인
const isTargetElementTotallyScrolled = (targetElement: HTMLElement): boolean =>
  targetElement.scrollHeight - targetElement.scrollTop <=
  targetElement.clientHeight;

const handleScroll = (event: TouchEvent, targetElement: HTMLElement): void => {
  const clientY = event.targetTouches[0].clientY - initialClientY;

  if (allowTouchMove(event.target)) {
    return;
  }

  // 상단에서 아래로 당길 때 (위쪽 오버스크롤 방지)
  if (targetElement.scrollTop === 0 && clientY > 0) {
    preventDefault(event);
    return;
  }

  // 하단에서 위로 올릴 때 (아래쪽 오버스크롤 방지)
  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    preventDefault(event);
    return;
  }

  event.stopPropagation();
};

export const disableBodyScroll = (
  targetElement: HTMLElement | null,
  options?: BodyScrollOptions,
): void => {
  if (!targetElement) {
    console.error(
      "disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.",
    );
    return;
  }

  if (locks.some((lock) => lock.targetElement === targetElement)) {
    return;
  }

  const lock: Lock = {
    targetElement,
    options: options ?? {},
  };

  locks = [...locks, lock];

  if (isIosDevice) {
    setPositionFixed();
  } else {
    setOverflowHidden(options);
  }

  if (isIosDevice) {
    targetElement.ontouchstart = (event: TouchEvent) => {
      if (event.targetTouches.length === 1) {
        initialClientY = event.targetTouches[0].clientY;
      }
    };
    targetElement.ontouchmove = (event: TouchEvent) => {
      if (event.targetTouches.length === 1) {
        handleScroll(event, targetElement);
      }
    };

    if (!documentListenerAdded) {
      document.addEventListener(
        "touchmove",
        preventDefault,
        hasPassiveEvents ? { passive: false } : undefined,
      );
      documentListenerAdded = true;
    }
  }
};

export const clearAllBodyScrollLocks = (): void => {
  if (isIosDevice) {
    locks.forEach((lock) => {
      lock.targetElement.ontouchstart = null;
      lock.targetElement.ontouchmove = null;
    });

    if (documentListenerAdded) {
      document.removeEventListener(
        "touchmove",
        preventDefault,
        hasPassiveEvents
          ? ({ passive: false } as EventListenerOptions)
          : undefined,
      );
      documentListenerAdded = false;
    }

    initialClientY = -1;
    restorePositionSetting();
  } else {
    restoreOverflowSetting();
  }

  locks = [];
};

export const enableBodyScroll = (targetElement: HTMLElement | null): void => {
  if (!targetElement) {
    console.error(
      "enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.",
    );
    return;
  }

  locks = locks.filter((lock) => lock.targetElement !== targetElement);

  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    if (documentListenerAdded && locks.length === 0) {
      document.removeEventListener(
        "touchmove",
        preventDefault,
        hasPassiveEvents
          ? ({ passive: false } as EventListenerOptions)
          : undefined,
      );
      documentListenerAdded = false;
    }

    if (locks.length === 0) {
      restorePositionSetting();
    }
  } else {
    if (locks.length === 0) {
      restoreOverflowSetting();
    }
  }
};
