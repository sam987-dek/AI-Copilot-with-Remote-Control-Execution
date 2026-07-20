import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

const PALETTE = {
  idle: "#2dd9ff",
  live: "#33ffb0",
  pending: "#ffb020",
  blocked: "#ff3b5c",
};

function Core({ state = "idle", speed = 1 }) {
  const coreRef = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  const ring3 = useRef();
  const color = PALETTE[state] ?? PALETTE.idle;

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.25 * speed;
    if (ring1.current) ring1.current.rotation.z += delta * 0.18 * speed;
    if (ring2.current) ring2.current.rotation.x += delta * 0.22 * speed;
    if (ring3.current) ring3.current.rotation.y += delta * 0.3 * speed;
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.85} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.55, 0.006, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[1.85, 0.004, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 2, Math.PI / 5, 0]}>
        <torusGeometry args={[2.1, 0.003, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      <pointLight color={color} intensity={8} distance={6} />
    </group>
  );
}

function Particles({ state = "idle", count = 140 }) {
  const ref = useRef();
  const color = PALETTE[state] ?? PALETTE.idle;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function AICore({ state = "idle", speed = 1, className = "" }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 1.5]}>
        <Core state={state} speed={speed} />
        <Particles state={state} />
      </Canvas>
    </div>
  );
}
