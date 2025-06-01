import { Environment, OrbitControls, Stage } from "@react-three/drei";
import Shirt from "./Shirt";
import { Suspense } from "react";

const Experience = ({ modelUrl, onTextureCanvas, onUvMapUrl }) => {
  return (
    <>
      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2 + 0.3}
        minDistance={0.4}
        maxDistance={1.6}
      />
      <Stage>
        <Suspense fallback={null}>
          <Shirt modelUrl={modelUrl} onTextureCanvas={onTextureCanvas} onUvMapUrl={onUvMapUrl} />
        </Suspense>
      </Stage>
    </>
  );
};

export default Experience; 