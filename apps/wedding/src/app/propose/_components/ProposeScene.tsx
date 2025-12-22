"use client";

export const ProposeScene = () => {
  return (
    <>
      <color attach="background" args={["#0b0d14"]} />
      <fog attach="fog" args={["#0b0d14", 10, 40]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 4]} intensity={0.9} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -1.2, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0f1118" roughness={0.9} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.4, -6]}>
        <boxGeometry args={[3.4, 2.2, 0.25]} />
        <meshStandardMaterial
          color="#151a26"
          roughness={0.35}
          metalness={0.65}
        />
      </mesh>
    </>
  );
};
