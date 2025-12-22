"use client";

import {
  Html,
  RoundedBox,
  ScrollControls,
  useScroll,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MEMORIES, type MemoryItem } from "../_constants/memories";
import {
  activeMemoryIdAtom,
  focusedMemoryIdAtom,
  isLetterOpenAtom,
} from "../_stores/lock";

const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, -1);

const CORRIDOR_WIDTH = 6;
const WALL_THICKNESS = 0.2;
const WALL_HEIGHT = 3;
const FLOOR_THICKNESS = 0.14;
const CAMERA_HEIGHT = 1.6;
const CEILING_THICKNESS = 0.12;

const CORRIDOR_LENGTH_MULTIPLIER = 3;
const CORRIDOR_START_Z = 6;
const CORRIDOR_END_Z = -38;

const FRAME_SIZE = 1.05;
const FRAME_MAX_SCREEN_HEIGHT = 0.5;
const FRAME_MAX_SCREEN_WIDTH = 0.8;

const FOCUS_WINDOW = 0.05;

type MemoryPlacement = MemoryItem & {
  position: THREE.Vector3;
  facing: THREE.Vector3;
};

const smoothstep01 = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

const dampVector3 = (
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  delta: number,
) => {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, delta);
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, delta);
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, delta);
};

const useCorridorCurve = () => {
  return useMemo(() => {
    return new THREE.LineCurve3(
      new THREE.Vector3(0, 0, CORRIDOR_START_Z),
      new THREE.Vector3(
        0,
        0,
        CORRIDOR_START_Z +
          (CORRIDOR_END_Z - CORRIDOR_START_Z) * CORRIDOR_LENGTH_MULTIPLIER,
      ),
    );
  }, []);
};

const useMemoryPlacements = (curve: THREE.Curve<THREE.Vector3>) => {
  return useMemo<MemoryPlacement[]>(() => {
    return MEMORIES.map((memory) => {
      const t = Math.min(1, Math.max(0, memory.t));
      const base = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const right = new THREE.Vector3().crossVectors(tangent, UP).normalize();
      const sideMultiplier = memory.side === "right" ? 1 : -1;

      const wallInner = CORRIDOR_WIDTH / 2 - WALL_THICKNESS - 0.04;
      const position = base
        .clone()
        .add(right.multiplyScalar(sideMultiplier * wallInner))
        .add(new THREE.Vector3(0, 1.45, 0));

      const facing = new THREE.Vector3()
        .copy(right)
        .multiplyScalar(-sideMultiplier)
        .normalize();

      return {
        ...memory,
        t,
        position,
        facing,
      };
    });
  }, [curve]);
};

const CurvedCorridor = ({ curve }: { curve: THREE.Curve<THREE.Vector3> }) => {
  const segments = useMemo(() => {
    const targetSegmentLength = 0.32;
    const segmentCount = Math.min(
      700,
      Math.max(160, Math.ceil(curve.getLength() / targetSegmentLength)),
    );
    const results: {
      key: string;
      position: THREE.Vector3;
      quaternion: THREE.Quaternion;
      length: number;
    }[] = [];

    for (let i = 0; i < segmentCount - 1; i++) {
      const t0 = i / (segmentCount - 1);
      const t1 = (i + 1) / (segmentCount - 1);
      const p0 = curve.getPointAt(t0);
      const p1 = curve.getPointAt(t1);
      const dir = new THREE.Vector3().subVectors(p1, p0);
      const length = dir.length();
      if (length <= 0.0001) continue;

      dir.normalize();
      const position = p0.clone().add(p1).multiplyScalar(0.5);
      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        FORWARD,
        dir,
      );

      results.push({
        key: `${i}`,
        position,
        quaternion,
        length,
      });
    }

    return results;
  }, [curve]);

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f8c9d5",
        roughness: 0.92,
        metalness: 0.03,
      }),
    [],
  );

  const floorMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f3f1ee",
        roughness: 0.18,
        metalness: 0.02,
        clearcoat: 1,
        clearcoatRoughness: 0.22,
      }),
    [],
  );

  const ceilingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#fff1f4",
        roughness: 0.95,
        metalness: 0,
      }),
    [],
  );

  return (
    <group>
      {segments.map((segment) => (
        <group
          key={segment.key}
          position={segment.position}
          quaternion={segment.quaternion}
        >
          <mesh
            position={[0, -FLOOR_THICKNESS / 2, 0]}
            scale={[CORRIDOR_WIDTH, FLOOR_THICKNESS, segment.length + 0.03]}
            material={floorMaterial}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>

          <mesh
            position={[0, WALL_HEIGHT + CEILING_THICKNESS / 2, 0]}
            scale={[CORRIDOR_WIDTH, CEILING_THICKNESS, segment.length + 0.03]}
            material={ceilingMaterial}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>

          <mesh
            position={[
              CORRIDOR_WIDTH / 2 - WALL_THICKNESS / 2,
              WALL_HEIGHT / 2,
              0,
            ]}
            scale={[WALL_THICKNESS, WALL_HEIGHT, segment.length + 0.03]}
            material={wallMaterial}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>

          <mesh
            position={[
              -(CORRIDOR_WIDTH / 2 - WALL_THICKNESS / 2),
              WALL_HEIGHT / 2,
              0,
            ]}
            scale={[WALL_THICKNESS, WALL_HEIGHT, segment.length + 0.03]}
            material={wallMaterial}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const MemoryFrames = ({ placements }: { placements: MemoryPlacement[] }) => {
  const setActiveMemoryId = useSetAtom(activeMemoryIdAtom);
  const focusedMemoryId = useAtomValue(focusedMemoryIdAtom);
  const uniqueSrcs = useMemo(() => {
    return Array.from(new Set(placements.map((m) => m.src)));
  }, [placements]);
  const textures = useTexture(uniqueSrcs) as THREE.Texture[];

  const textureBySrc = useMemo(() => {
    const map = new Map<string, THREE.Texture>();
    uniqueSrcs.forEach((src, i) => {
      const texture = textures[i];
      if (texture) map.set(src, texture);
    });
    return map;
  }, [textures, uniqueSrcs]);

  useEffect(() => {
    textures.forEach((texture) => {
      const image = texture.image as { width?: number; height?: number } | null;
      const width = image?.width ?? 0;
      const height = image?.height ?? 0;

      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.anisotropy = 8;

      // Center-crop to a square (cover).
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);
      texture.center.set(0.5, 0.5);
      texture.rotation = 0;

      if (width > 0 && height > 0) {
        if (width > height) {
          const r = height / width;
          texture.repeat.set(r, 1);
          texture.offset.set((1 - r) / 2, 0);
        } else if (height > width) {
          const r = width / height;
          texture.repeat.set(1, r);
          texture.offset.set(0, (1 - r) / 2);
        }
      }

      texture.needsUpdate = true;
    });
  }, [textures]);

  return (
    <group>
      {placements.map((memory, index) => {
        const texture = textureBySrc.get(memory.src) ?? textures[0];
        const yaw = Math.atan2(memory.facing.x, memory.facing.z);
        const frameW = FRAME_SIZE;
        const frameH = FRAME_SIZE;

        return (
          <group
            key={memory.id}
            position={memory.position}
            rotation={[0, yaw, 0]}
          >
            <RoundedBox
              args={[frameW + 0.22, frameH + 0.22, 0.09]}
              radius={0.12}
              smoothness={8}
              bevelSegments={6}
              position={[0, 0.05, -0.03]}
            >
              <meshStandardMaterial
                color="#e7b5c1"
                roughness={0.28}
                metalness={0.18}
              />
            </RoundedBox>

            <RoundedBox
              args={[frameW + 0.08, frameH + 0.08, 0.02]}
              radius={0.1}
              smoothness={8}
              bevelSegments={4}
              position={[0, 0.05, 0.02]}
            >
              <meshStandardMaterial
                color="#0b0d14"
                roughness={0.55}
                metalness={0.2}
              />
            </RoundedBox>

            <mesh position={[0, 0.05, 0.035]}>
              <planeGeometry args={[frameW, frameH]} />
              <meshStandardMaterial
                map={texture}
                emissive="#ffffff"
                emissiveMap={texture}
                emissiveIntensity={0.7}
                roughness={0.9}
                metalness={0}
                toneMapped={false}
                side={THREE.DoubleSide}
              />
            </mesh>

            {focusedMemoryId === memory.id ? (
              <Html
                position={[0, -(frameH / 2 + 0.38), 0.07]}
                center
                zIndexRange={[20, 0]}
              >
                <div className="pointer-events-auto flex items-center gap-2">
                  <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-wide text-stone-700 shadow-sm backdrop-blur">
                    {memory.date}
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-rose-500 px-3 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:bg-rose-600 active:scale-[0.98]"
                    onClick={() => setActiveMemoryId(memory.id)}
                  >
                    추억 열어보기
                  </button>
                </div>
              </Html>
            ) : null}
          </group>
        );
      })}
    </group>
  );
};

const ScrollRig = ({
  curve,
  placements,
  isScrollLocked,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  placements: MemoryPlacement[];
  isScrollLocked: boolean;
}) => {
  const scroll = useScroll();
  const tRef = useRef(0);
  const setFocusedMemoryId = useSetAtom(focusedMemoryIdAtom);
  const lastFocusedIdRef = useRef<string | null>(null);
  const lockedScrollTopRef = useRef<number | null>(null);
  const dwellRef = useRef<{ id: string | null; until: number }>({
    id: null,
    until: 0,
  });
  const dwellBlockRef = useRef<string | null>(null);
  const lookAtRef = useRef(new THREE.Vector3());

  const { camera } = useThree();
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);
  const tempTangent = useMemo(() => new THREE.Vector3(), []);
  const tempRight = useMemo(() => new THREE.Vector3(), []);
  const cameraOffset = useMemo(
    () => new THREE.Vector3(0, CAMERA_HEIGHT, 0),
    [],
  );
  const lookAhead = useMemo(() => new THREE.Vector3(), []);
  const backwardOffset = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!("fov" in camera)) return;
    const perspectiveCamera = camera as THREE.PerspectiveCamera;

    if (isScrollLocked) {
      const current = lockedScrollTopRef.current;
      const next = scroll.el?.scrollTop ?? null;
      if (current === null && typeof next === "number") {
        lockedScrollTopRef.current = next;
      } else if (
        typeof next === "number" &&
        typeof current === "number" &&
        next !== current &&
        scroll.el
      ) {
        scroll.el.scrollTop = current;
      }
    } else {
      lockedScrollTopRef.current = null;
    }

    if (isScrollLocked) {
      if (lastFocusedIdRef.current !== null) {
        lastFocusedIdRef.current = null;
        setFocusedMemoryId(null);
      }
      return;
    }

    const now = performance.now();
    const rawT = scroll.offset ?? 0;

    const findNearestIndex = (t: number) => {
      let closestIndex = -1;
      let closestDistance = Number.POSITIVE_INFINITY;
      for (let i = 0; i < placements.length; i++) {
        const distance = Math.abs(placements[i].t - t);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      }
      return { closestIndex, closestDistance };
    };

    const nearestRaw = findNearestIndex(rawT);
    const nearestRawItem =
      nearestRaw.closestIndex >= 0 ? placements[nearestRaw.closestIndex] : null;

    const enterWindow = 0.012;
    const stickyWindow = 0.05;
    const releaseWindow = 0.09;
    const departWindow = 0.07;
    const dwellMs = 1200;

    if (dwellBlockRef.current) {
      const blocked = placements.find((p) => p.id === dwellBlockRef.current);
      if (!blocked || Math.abs(rawT - blocked.t) > departWindow) {
        dwellBlockRef.current = null;
      }
    }

    if (dwellRef.current.id) {
      const focus = placements.find((p) => p.id === dwellRef.current.id);
      if (!focus) {
        dwellRef.current = { id: null, until: 0 };
      } else if (now > dwellRef.current.until) {
        dwellRef.current = { id: null, until: 0 };
      } else if (Math.abs(rawT - focus.t) > releaseWindow) {
        dwellRef.current = { id: null, until: 0 };
      }
    }

    let targetT = rawT;

    if (dwellRef.current.id) {
      const focus = placements.find((p) => p.id === dwellRef.current.id);
      if (focus) targetT = focus.t;
    } else {
      if (
        !dwellBlockRef.current &&
        nearestRawItem &&
        nearestRaw.closestDistance < enterWindow
      ) {
        dwellRef.current = { id: nearestRawItem.id, until: now + dwellMs };
        dwellBlockRef.current = nearestRawItem.id;
        targetT = nearestRawItem.t;
      } else if (nearestRawItem && nearestRaw.closestDistance < stickyWindow) {
        const strength = smoothstep01(
          1 - nearestRaw.closestDistance / stickyWindow,
        );
        targetT = THREE.MathUtils.lerp(rawT, nearestRawItem.t, 0.65 * strength);
      }
    }

    tRef.current = THREE.MathUtils.damp(tRef.current, targetT, 14, delta);
    const t = tRef.current;

    const point = curve.getPointAt(t);
    tempTangent.copy(curve.getTangentAt(t)).normalize();
    tempRight.crossVectors(tempTangent, UP).normalize();

    desiredPosition.copy(point).add(cameraOffset);

    lookAhead.copy(tempTangent).multiplyScalar(2.4);
    desiredTarget.copy(point).add(lookAhead);
    desiredTarget.y = CAMERA_HEIGHT;

    const nearestCurrent = findNearestIndex(t);
    const closestIndex = nearestCurrent.closestIndex;
    const closestDistance = nearestCurrent.closestDistance;

    if (closestIndex >= 0 && closestDistance < FOCUS_WINDOW) {
      const strength = smoothstep01(1 - closestDistance / FOCUS_WINDOW);
      const focus = placements[closestIndex];

      desiredTarget.lerp(focus.position, strength);

      const wallInner = CORRIDOR_WIDTH / 2 - WALL_THICKNESS - 0.04;
      const fovRad = THREE.MathUtils.degToRad(perspectiveCamera.fov);
      const tanHalfFov = Math.tan(fovRad / 2);
      const minDistanceByHeight =
        FRAME_SIZE / (2 * FRAME_MAX_SCREEN_HEIGHT * tanHalfFov);
      const minDistanceByWidth =
        FRAME_SIZE /
        (2 * FRAME_MAX_SCREEN_WIDTH * tanHalfFov * perspectiveCamera.aspect);
      const minDistance = Math.max(minDistanceByHeight, minDistanceByWidth);
      const requiredBack = Math.sqrt(
        Math.max(0, minDistance * minDistance - wallInner * wallInner),
      );

      backwardOffset
        .copy(tempTangent)
        .multiplyScalar(-(requiredBack + 0.25) * strength);
      desiredPosition.add(backwardOffset);
    }

    const nextFocusedId = dwellRef.current.id
      ? dwellRef.current.id
      : closestIndex >= 0 && closestDistance < FOCUS_WINDOW
        ? placements[closestIndex].id
        : null;
    if (nextFocusedId !== lastFocusedIdRef.current) {
      lastFocusedIdRef.current = nextFocusedId;
      setFocusedMemoryId(nextFocusedId);
    }

    camera.position.copy(desiredPosition);
    dampVector3(lookAtRef.current, desiredTarget, 18, delta);
    camera.lookAt(lookAtRef.current);
    camera.updateMatrixWorld();
  });

  return null;
};

export const ProposeScrollScene = () => {
  const curve = useCorridorCurve();
  const placements = useMemoryPlacements(curve);
  const isLetterOpen = useAtomValue(isLetterOpenAtom);

  return (
    <>
      <color attach="background" args={["#fff4f7"]} />
      <fog attach="fog" args={["#fff4f7", 26, 240]} />

      <hemisphereLight args={["#fff6f3", "#c7b7b0", 0.9]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 10, 6]} intensity={1.2} color="#ffffff" />

      <ScrollControls
        pages={(MEMORIES.length + 2) * CORRIDOR_LENGTH_MULTIPLIER}
        damping={0.18}
        enabled={!isLetterOpen}
      >
        <ScrollRig
          curve={curve}
          placements={placements}
          isScrollLocked={isLetterOpen}
        />
        <CurvedCorridor curve={curve} />
        <MemoryFrames placements={placements} />
      </ScrollControls>
    </>
  );
};
