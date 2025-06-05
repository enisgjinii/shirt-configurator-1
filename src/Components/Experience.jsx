import { useRef, useEffect, useState } from "react";
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, Html, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AnimationSystem, AnimationRecorder } from "../utils/AnimationSystem";
import { TextureExtractor } from "./TextureExtractor";
import { ScreenshotManager } from "../utils/ScreenshotManager";

// Animated Shirt Component
function AnimatedShirt({ modelUrl, color, animation, image, text, textData, imageData }) {
  const { scene } = useGLTF(modelUrl);
  const meshRef = useRef();
  const [shirtMaterial, setShirtMaterial] = useState(null);
  const [extractedTexture, setExtractedTexture] = useState(null);

  useEffect(() => {
    if (scene) {
      // Find the shirt mesh and apply materials
      scene.traverse((child) => {
        if (child.isMesh) {
          const material = new THREE.MeshStandardMaterial({
            color: color.startsWith('linear') ? '#ffffff' : color,
            roughness: 0.7,
            metalness: 0.1,
          });

          // Apply gradient if needed
          if (color.startsWith('linear')) {
            // Create gradient texture
            const canvas = document.createElement('canvas');
            canvas.width = 512;  // Increased resolution for better quality
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // Parse gradient string to extract colors and angle
            const gradientMatch = color.match(/linear-gradient\((\d+)deg,\s*([^,]+)\s*0%,\s*([^)]+)\s*100%\)/);
            if (gradientMatch) {
              const [_, angle, color1, color2] = gradientMatch;
              
              // Convert angle to radians and calculate gradient coordinates
              const angleRad = (parseInt(angle) * Math.PI) / 180;
              const x1 = canvas.width / 2 - Math.cos(angleRad) * canvas.width;
              const y1 = canvas.height / 2 - Math.sin(angleRad) * canvas.height;
              const x2 = canvas.width / 2 + Math.cos(angleRad) * canvas.width;
              const y2 = canvas.height / 2 + Math.sin(angleRad) * canvas.height;
              
              const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
              gradient.addColorStop(0, color1.trim());
              gradient.addColorStop(1, color2.trim());
              
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              const texture = new THREE.CanvasTexture(canvas);
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
              material.map = texture;
              material.needsUpdate = true;
            }
          }

          child.material = material;
          setShirtMaterial(material);
        }
      });
    }
  }, [scene, color]);

  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current || !animation.enabled) return;

    const time = state.clock.elapsedTime * animation.speed;

    switch (animation.type) {
      case 'rotateY':
        meshRef.current.rotation.y = time;
        break;
      case 'rotateX':
        meshRef.current.rotation.x = Math.sin(time) * 0.3;
        break;
      case 'float':
        meshRef.current.position.y = Math.sin(time) * 0.5;
        break;
      case 'pulse':
        const scale = 1 + Math.sin(time * 2) * 0.1;
        meshRef.current.scale.setScalar(scale);
        break;
      case 'swing':
        meshRef.current.rotation.z = Math.sin(time) * 0.2;
        break;
      case 'bounce':
        meshRef.current.position.y = Math.abs(Math.sin(time * 2)) * 0.5;
        break;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={scene} />
      <TextureExtractor 
        model={scene} 
        onTextureExtracted={setExtractedTexture}
      />
      
      {/* Image overlay */}
      {image && (
        <Html
          position={[0, 0.5, 0.1]}
          transform
          sprite
        >
          <img 
            src={image} 
            alt="Design" 
            style={{
              width: `${imageData?.scale * 100 || 100}px`,
              height: 'auto',
              transform: `rotate(${imageData?.rotation || 0}deg)`,
              pointerEvents: 'none'
            }}
          />
        </Html>
      )}
      
      {/* Text overlay */}
      {text && (
        <Text
          position={[0, 0.2, 0.1]}
          fontSize={(textData?.size || 16) * 0.01}
          color={textData?.color || '#000000'}
          anchorX="center"
          anchorY="middle"
          font={textData?.font || 'Arial'}
        >
          {text}
        </Text>
      )}
    </group>
  );
}

// Background component
function SceneBackground({ backgroundType, backgroundValue }) {
  const { scene } = useThree();

  useEffect(() => {
    if (backgroundType === 'color') {
      scene.background = new THREE.Color(backgroundValue);
    } else if (backgroundType === 'image' && backgroundValue) {
      const loader = new THREE.TextureLoader();
      loader.load(backgroundValue, (texture) => {
        scene.background = texture;
      });
    } else {
      scene.background = null;
    }
  }, [backgroundType, backgroundValue, scene]);

  if (backgroundType === 'environment') {
    return <Environment preset={backgroundValue} background />;
  }
  return null;
}

export default function Experience({ modelUrl }) {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const animationSystem = useRef(new AnimationSystem());
  const animationRecorder = useRef(new AnimationRecorder());
  const screenshotManager = useRef(null);
  
  // State for all the controls
  const [shirtColor, setShirtColor] = useState("#ffffff");
  const [backgroundSettings, setBackgroundSettings] = useState({ type: 'color', value: '#f0f0f0' });
  const [animationSettings, setAnimationSettings] = useState({ enabled: false, type: 'rotateY', speed: 1 });
  const [imageSettings, setImageSettings] = useState({ image: null, scale: 1, rotation: 0, position: { x: 0, y: 0 } });
  const [textSettings, setTextSettings] = useState({ 
    text: '', 
    color: '#000000', 
    size: 16, 
    font: 'Arial', 
    position: { x: 0, y: 0 } 
  });
  const [isRecording, setIsRecording] = useState(false);

  // Initialize systems
  useEffect(() => {
    animationSystem.current.initializeDefaultAnimations();
    screenshotManager.current = new ScreenshotManager(gl.domElement);
  }, [gl]);

  // Event listeners for controls
  useEffect(() => {
    const handleShirtControls = (event) => {
      const { detail } = event;
      
      if (detail.color) {
        setShirtColor(detail.color);
      }
      
      if (detail.background) {
        setBackgroundSettings(detail.background);
      }
      
      if (detail.animation) {
        setAnimationSettings(detail.animation);
      }
      
      if (detail.image !== undefined) {
        setImageSettings({
          image: detail.image,
          scale: detail.imageScale || 1,
          rotation: detail.imageRotation || 0,
          position: detail.imagePosition || { x: 0, y: 0 }
        });
      }
      
      if (detail.text !== undefined) {
        setTextSettings({
          text: detail.text,
          color: detail.textColor || '#000000',
          size: detail.textSize || 16,
          font: detail.textFont || 'Arial',
          position: detail.textPosition || { x: 0, y: 0 }
        });
      }
    };

    const handleExport = async (event) => {
      const { detail } = event;
      
      if (['png', 'jpeg', 'webp'].includes(detail.format)) {
        try {
          const { blob } = await screenshotManager.current.takeScreenshot(
            detail.format, 
            detail.quality || 0.9, 
            detail.resolution || '1920x1080'
          );
          screenshotManager.current.downloadScreenshot(
            blob, 
            `shirt-design.${detail.format}`
          );
        } catch (error) {
          console.error('Export failed:', error);
        }
      }
    };

    const handleRecording = (event) => {
      const { detail } = event;
      if (detail.action === 'start') {
        const success = animationRecorder.current.startRecording(gl.domElement);
        setIsRecording(success);
      } else if (detail.action === 'stop') {
        animationRecorder.current.stopRecording();
        setIsRecording(false);
      }
    };

    window.addEventListener('shirt-controls', handleShirtControls);
    window.addEventListener('shirt-export', handleExport);
    window.addEventListener('shirt-record', handleRecording);

    return () => {
      window.removeEventListener('shirt-controls', handleShirtControls);
      window.removeEventListener('shirt-export', handleExport);
      window.removeEventListener('shirt-record', handleRecording);
    };
  }, [gl]);

  // Camera setup
  useEffect(() => {
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <group>
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
      
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      <spotLight
        position={[5, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />
      
      {/* Background */}
      <SceneBackground 
        backgroundType={backgroundSettings.type} 
        backgroundValue={backgroundSettings.value} 
      />
      
      {/* Main shirt model */}
      <AnimatedShirt
        modelUrl={modelUrl}
        color={shirtColor}
        animation={animationSettings}
        image={imageSettings.image}
        text={textSettings.text}
        imageData={imageSettings}
        textData={textSettings}
      />
      
      {/* Recording indicator */}
      {isRecording && (
        <Html fullscreen>
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 0, 0, 0.9)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: 'white',
              borderRadius: '50%',
              animation: 'pulse 1s infinite'
            }}></div>
            REC
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
        </Html>
      )}
    </group>
  );
}