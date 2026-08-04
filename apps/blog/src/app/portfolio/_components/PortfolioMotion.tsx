"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * hydration이 이 시점보다 늦으면 이미 노출된 콘텐츠를 다시 숨겼다 등장시키는
 * 어색함이 생기므로 인트로 타임라인을 통째로 건너뛴다.
 */
const INTRO_TIME_BUDGET_MS = 1500;

const splitChars = (element: HTMLElement) => {
  // matchMedia 조건 변경으로 콜백이 재실행돼도 이중 분해되지 않게 가드
  if (element.querySelector(".pf-char")) return;

  const label = element.textContent?.trim() ?? "";
  // 낭독은 부모 h1의 aria-label이 담당한다
  element.setAttribute("aria-hidden", "true");
  element.innerHTML = [...label]
    .map((character) =>
      character === " "
        ? '<span class="pf-char">&nbsp;</span>'
        : `<span class="pf-char">${character}</span>`,
    )
    .join("");
};

type PortfolioMotionProps = {
  children: React.ReactNode;
};

/**
 * 서버 렌더된 섹션 DOM 위에 GSAP 모션만 얹는 단일 클라이언트 오케스트레이터.
 * SSR 마크업 자체가 모션의 최종 상태이므로, 모션이 꺼져도 정보 손실이 없다.
 */
const PortfolioMotion = ({ children }: PortfolioMotionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      // 모바일 주소창 수축/확장으로 인한 전체 refresh 방지
      ScrollTrigger.config({ ignoreMobileResize: true });

      const media = gsap.matchMedia();

      media.add(
        {
          motionOk: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 801px)",
          mobile: "(max-width: 800px)",
        },
        (context) => {
          const { motionOk, desktop } = context.conditions as {
            motionOk: boolean;
            desktop: boolean;
            mobile: boolean;
          };

          // reduced-motion: 모든 트윈을 만들지 않는다 → 정적 최종 상태 그대로
          if (!motionOk) return;

          root
            .querySelectorAll<HTMLElement>("[data-split]")
            .forEach(splitChars);

          // SSR 직후 문서가 이미 노출된 경우(느린 hydration)에만 인트로를
          // 건너뛴다. 블로그에서 클라이언트 네비게이션으로 진입한 경우에는
          // 콘텐츠가 방금 마운트됐으므로 인트로를 재생한다.
          const navigationEntry = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming | undefined;
          const isInitialDocumentLoad = navigationEntry
            ? new URL(navigationEntry.name).pathname ===
              window.location.pathname
            : true;
          const skipIntro =
            isInitialDocumentLoad && performance.now() > INTRO_TIME_BUDGET_MS;

          // 모바일 CSS가 포트레이트를 감쇠(opacity 0.38/0.72)하므로 인트로의
          // 최종값은 1이 아니라 현재 CSS 계산값이어야 한다 (인라인 덮어쓰기 방지)
          const portrait = root.querySelector<HTMLElement>(".pf-portrait");
          const portraitOpacity = portrait
            ? parseFloat(getComputedStyle(portrait).opacity) || 1
            : 1;

          if (!skipIntro) {
            gsap.set(".pf-hero-title .pf-char", { yPercent: 120, rotate: 7 });
            gsap.set(".pf-hero .pf-reveal", { y: 30, opacity: 0 });
            gsap.set(".pf-portrait", { scale: 0.86, rotate: 10, opacity: 0 });

            const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
            intro
              .to(".pf-hero-title .pf-char", {
                yPercent: 0,
                rotate: 0,
                duration: 0.9,
                stagger: 0.035,
              })
              .to(
                ".pf-portrait",
                {
                  scale: 1,
                  rotate: 4,
                  opacity: portraitOpacity,
                  duration: 0.9,
                },
                "-=0.65",
              )
              .to(
                ".pf-hero .pf-reveal",
                { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
                "-=0.5",
              )
              .from(
                ".pf-sticker",
                { scale: 0, rotate: -60, duration: 0.65 },
                "-=0.55",
              );
          }

          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) =>
              gsap.set(".pf-progress", { scaleX: self.progress }),
          });

          // 주의: impact pin(+140% spacer)은 reveal/count 트리거보다 먼저
          // 생성해야 한다. ScrollTrigger refresh는 생성 순서대로 실행되므로,
          // pin이 뒤에 오면 하단 트리거들이 spacer 없는 레이아웃 기준으로
          // start를 계산해 1.4 뷰포트 일찍 발화한다 (프로토타입과 동일 순서).
          let removePointerMove: (() => void) | undefined;

          if (desktop) {
            gsap.to(".pf-hero-title .pf-line:first-child", {
              xPercent: -13,
              ease: "none",
              scrollTrigger: {
                trigger: ".pf-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.7,
              },
            });

            gsap.to(".pf-hero-title .pf-line:last-child", {
              xPercent: 13,
              ease: "none",
              scrollTrigger: {
                trigger: ".pf-hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.7,
              },
            });

            const portraitX = gsap.quickTo(".pf-portrait", "x", {
              duration: 0.6,
              ease: "power3.out",
            });
            const portraitY = gsap.quickTo(".pf-portrait", "y", {
              duration: 0.6,
              ease: "power3.out",
            });

            const movePortrait = (event: PointerEvent) => {
              portraitX((event.clientX / window.innerWidth - 0.5) * 24);
              portraitY((event.clientY / window.innerHeight - 0.5) * 20);
            };

            window.addEventListener("pointermove", movePortrait);
            removePointerMove = () =>
              window.removeEventListener("pointermove", movePortrait);

            const impactTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: ".pf-impact",
                start: "top top",
                end: "+=140%",
                pin: ".pf-impact-stage",
                scrub: 0.8,
              },
            });

            impactTimeline
              .fromTo(
                ".pf-metric-before",
                { xPercent: -12, opacity: 0.35 },
                { xPercent: 0, opacity: 1, duration: 1 },
              )
              .fromTo(
                ".pf-metric-arrow",
                { scaleX: 0, transformOrigin: "left" },
                { scaleX: 1, duration: 0.7 },
                0.3,
              )
              .fromTo(
                ".pf-metric-after",
                { xPercent: 18, opacity: 0, scale: 0.7 },
                { xPercent: 0, opacity: 1, scale: 1, duration: 1 },
                0.65,
              )
              .fromTo(
                ".pf-impact-caption",
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7 },
                0.95,
              )
              .to(".pf-metric-before", { opacity: 0.18, duration: 0.7 }, 1.25);

            gsap.utils
              .toArray<HTMLElement>(".pf-project-card")
              .forEach((card, index) => {
                gsap.from(card, {
                  rotate: index % 2 === 0 ? -2.5 : 2.5,
                  scale: 0.94,
                  y: 70,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    end: "top 55%",
                    scrub: 0.7,
                  },
                });
              });
          } else {
            gsap.from(".pf-metric-before, .pf-metric-arrow, .pf-metric-after", {
              y: 35,
              opacity: 0,
              duration: 0.7,
              stagger: 0.13,
              scrollTrigger: {
                trigger: ".pf-metric-transform",
                start: "top 82%",
              },
            });
          }

          gsap.utils.toArray<HTMLElement>(".pf-reveal").forEach((element) => {
            if (element.closest(".pf-hero")) return;

            gsap.from(element, {
              y: 48,
              opacity: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            });
          });

          root
            .querySelectorAll<HTMLElement>("[data-count]")
            .forEach((element) => {
              const end = Number(element.dataset.count);
              const state = { value: 0 };

              gsap.to(state, {
                value: end,
                duration: 1.25,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 88%",
                  once: true,
                },
                onStart: () => {
                  element.textContent = "0";
                },
                onUpdate: () => {
                  element.textContent = String(Math.round(state.value));
                },
              });
            });

          // 뷰포트 밖에서는 marquee CSS 애니메이션을 멈춰 GPU/배터리 절약
          const marquee = root.querySelector(".pf-marquee");
          let marqueeObserver: IntersectionObserver | undefined;

          if (marquee) {
            marqueeObserver = new IntersectionObserver((entries) => {
              const entry = entries[0];
              if (!entry) return;

              marquee.classList.toggle(
                "pf-marquee--paused",
                !entry.isIntersecting,
              );
            });
            marqueeObserver.observe(marquee);
          }

          // 웹폰트 로드로 레이아웃이 변하면 pin/트리거 거리 재계산
          document.fonts.ready.then(() => ScrollTrigger.refresh());

          // 앵커 스무스 스크롤 (CSS scroll-behavior는 Next 스크롤 복원과
          // 충돌해 다른 라우트로 누출되므로 JS로 처리한다)
          const anchorLinks = Array.from(
            root.querySelectorAll<HTMLAnchorElement>(
              'a[href^="#"]:not(.pf-skip-link)',
            ),
          );

          const handleAnchorClick = (event: Event) => {
            const anchor = event.currentTarget as HTMLAnchorElement;
            const target = root.querySelector<HTMLElement>(anchor.hash);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth" });
            history.pushState(null, "", anchor.hash);
            // 키보드 사용자의 다음 Tab이 이동한 섹션에서 이어지도록 포커스 이동
            target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          };

          anchorLinks.forEach((anchor) =>
            anchor.addEventListener("click", handleAnchorClick),
          );

          return () => {
            removePointerMove?.();
            marqueeObserver?.disconnect();
            anchorLinks.forEach((anchor) =>
              anchor.removeEventListener("click", handleAnchorClick),
            );
            // 카운트 중간에 revert되면 textContent가 중간값에 멈추므로 복원
            root
              .querySelectorAll<HTMLElement>("[data-count]")
              .forEach((element) => {
                element.textContent =
                  element.dataset.count ?? element.textContent;
              });
          };
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="pf-root">
      {children}
    </div>
  );
};

export default PortfolioMotion;
