import { useRef, useEffect } from "react";
import { useGLTF, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Experience({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  const { camera } = useThree();
  const controlsRef = useRef();
  const modelRef = useRef();
  const containerRef = useRef();

  // Initialize camera and controls
  useEffect(() => {
    if (!modelRef.current) return;

    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Position camera based on model size
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
    cameraZ *= 1.5; // Add some padding

    // Set camera position
    camera.position.set(center.x, center.y, center.z + cameraZ);
    camera.lookAt(center);

    // Update controls
    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }
  }, [modelUrl, camera]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  // Animation frame
  useFrame((state, delta) => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <group ref={containerRef}>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={0}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <primitive
        ref={modelRef}
        object={scene}
        scale={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
} 