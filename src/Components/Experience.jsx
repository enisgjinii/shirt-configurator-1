import { useRef, useEffect, useState } from "react";
import { useGLTF, OrbitControls, PerspectiveCamera, Environment, Html, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AnimationSystem, AnimationRecorder } from "../utils/AnimationSystem";
import { TextureExtractor } from "./TextureExtractor";
import { ScreenshotManager } from "../utils/ScreenshotManager";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Camera presets for different viewing angles
const CAMERA_PRESETS = {
  front: { position: [0, 0, 2], target: [0, 0, 0] },
  back: { position: [0, 0, -2], target: [0, 0, 0] },
  left: { position: [-2, 0, 0], target: [0, 0, 0] },
  right: { position: [2, 0, 0], target: [0, 0, 0] },
  top: { position: [0, 2, 0], target: [0, 0, 0] },
  bottom: { position: [0, -2, 0], target: [0, 0, 0] },
  perspective: { position: [1.5, 1.5, 1.5], target: [0, 0, 0] }
};

// Animated Shirt Component
function AnimatedShirt({ modelUrl, color, animation, image, text, textData, imageData, currentCameraPreset }) {
  const { scene } = useGLTF(modelUrl);
  const meshRef = useRef();
  const controlsRef = useRef();
  const { camera, gl, size } = useThree();
  const [shirtMaterial, setShirtMaterial] = useState(null);
  const [extractedTextures, setExtractedTextures] = useState([]);
  const [uvMaps, setUvMaps] = useState([]);
  const [hasFramed, setHasFramed] = useState(false);

  // Center model geometry at origin
  useEffect(() => {
    if (scene) {
      // Compute bounding box and center
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center); // Center the model at origin
    }
  }, [scene]);

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

  // Camera auto-framing: fit camera to model after load and on resize
  useEffect(() => {
    if (scene && camera && gl && !hasFramed) {
      // Compute bounding box
      const box = new THREE.Box3().setFromObject(scene);
      const sizeVec = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      // Advanced math for perfect fit
      const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
      const fov = camera.fov * (Math.PI / 180);
      // Account for aspect ratio
      const aspect = size.width / size.height;
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      if (aspect < 1) {
        cameraZ = cameraZ / aspect;
      }
      camera.position.set(center.x, center.y, cameraZ + center.z);
      camera.near = 0.1;
      camera.far = 1000;
      camera.updateProjectionMatrix();
      camera.lookAt(center);
      // If OrbitControls is used, update its target
      if (controlsRef.current) {
        controlsRef.current.target.copy(center);
        controlsRef.current.update();
      }
      setHasFramed(true);
    }
  }, [scene, camera, gl, hasFramed, size]);

  // Camera animation
  useFrame(({ camera }) => {
    if (controlsRef.current) {
      // Smooth camera transitions
      const preset = CAMERA_PRESETS[currentCameraPreset];
      const targetPosition = new THREE.Vector3(...preset.position);
      const targetLookAt = new THREE.Vector3(...preset.target);
      
      camera.position.lerp(targetPosition, 0.05);
      controlsRef.current.target.lerp(targetLookAt, 0.05);
      controlsRef.current.update();
    }
  });

  // Animation system
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    switch (animation) {
      case 'rotate':
        meshRef.current.rotation.y = time;
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
    <group ref={meshRef} scale={[1.25, 1.25, 1.25]}>
      <primitive object={scene} />
      <TextureExtractor 
        model={scene} 
        onTextureExtracted={setExtractedTextures}
        onUVExtracted={setUvMaps}
        options={{
          textureResolution: 2048,
          uvMapResolution: 2048,
          showGrid: true,
          gridColor: '#444444',
          uvLineColor: '#ffffff',
          uvLineWidth: 1
        }}
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

// Main Experience Component
const Experience = ({ 
  modelUrl, 
  color, 
  animation, 
  image, 
  text, 
  textData, 
  imageData,
  onCameraChange,
  initialCameraPreset = 'perspective',
  onModelLoaded,
  onTexturesExtracted
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();
  const animationSystem = useRef(new AnimationSystem());
  const animationRecorder = useRef(new AnimationRecorder());
  const screenshotManager = useRef(null);
  const [currentPreset, setCurrentPreset] = useState(initialCameraPreset);
  
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
  const [scene, setScene] = useState(null);
  const [hasFramed, setHasFramed] = useState(false);

  // Initialize systems
  useEffect(() => {
    animationSystem.current.initializeDefaultAnimations();
    screenshotManager.current = new ScreenshotManager(gl.domElement);
  }, [gl]);

  // Update the model loading effect
  useEffect(() => {
    if (modelUrl) {
      const loader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
      loader.setDRACOLoader(dracoLoader);

      loader.load(modelUrl, (gltf) => {
        setScene(gltf.scene);
        setHasFramed(false);
        
        // Extract textures
        const textures = [];
        gltf.scene.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach(material => {
              if (material.map) {
                textures.push({
                  texture: material.map,
                  name: material.name || 'texture',
                  material: material
                });
              }
            });
          }
        });

        // Emit events
        if (onModelLoaded) onModelLoaded(gltf);
        if (onTexturesExtracted) onTexturesExtracted(textures);
      });
    }
  }, [modelUrl, onModelLoaded, onTexturesExtracted]);

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
        animationRecorder.current.saveRecording(
          detail.format === 'mp4' ? 'shirt-animation.mp4' : 'shirt-animation.webm',
          detail.format
        );
        animationRecorder.current.stopRecording();
        setIsRecording(false);
      }
    };

    // MP4 export handler
    const handleExportMp4 = async () => {
      // 1. Record a short webm video
      const recorder = animationRecorder.current;
      recorder.startRecording(gl.domElement);
      setTimeout(async () => {
        recorder.stopRecording();
        // 2. Get the recorded webm blob
        const webmBlob = new Blob(recorder.recordedChunks, { type: 'video/webm' });
        // 3. Use ffmpeg.wasm to convert to mp4
        window.dispatchEvent(new CustomEvent('mp4-status', { detail: 'Loading FFmpeg...' }));
        // Robust dynamic import for Vite
        const ffmpegModule = await import('@ffmpeg/ffmpeg');
        const createFFmpeg = ffmpegModule.createFFmpeg || ffmpegModule.default.createFFmpeg;
        const fetchFile = ffmpegModule.fetchFile || ffmpegModule.default.fetchFile;
        const ffmpeg = createFFmpeg({ log: true });
        await ffmpeg.load();
        window.dispatchEvent(new CustomEvent('mp4-status', { detail: 'Converting to MP4...' }));
        ffmpeg.FS('writeFile', 'input.webm', await fetchFile(webmBlob));
        await ffmpeg.run('-i', 'input.webm', '-c:v', 'libx264', '-preset', 'fast', '-pix_fmt', 'yuv420p', 'output.mp4');
        const mp4Data = ffmpeg.FS('readFile', 'output.mp4');
        const mp4Blob = new Blob([mp4Data.buffer], { type: 'video/mp4' });
        // 4. Download the MP4
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shirt-animation.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.dispatchEvent(new CustomEvent('mp4-status', { detail: 'MP4 export complete!' }));
      }, 5000); // Record 5 seconds
    };

    window.addEventListener('shirt-controls', handleShirtControls);
    window.addEventListener('shirt-export', handleExport);
    window.addEventListener('shirt-record', handleRecording);
    window.addEventListener('shirt-export-mp4', handleExportMp4);

    return () => {
      window.removeEventListener('shirt-controls', handleShirtControls);
      window.removeEventListener('shirt-export', handleExport);
      window.removeEventListener('shirt-record', handleRecording);
      window.removeEventListener('shirt-export-mp4', handleExportMp4);
    };
  }, [gl]);

  // Camera controls configuration
  const controlsConfig = {
    enableDamping: true,
    dampingFactor: 0.05,
    minDistance: 1,
    maxDistance: 5,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    enablePan: true,
    panSpeed: 0.5,
    rotateSpeed: 0.5,
    zoomSpeed: 0.5
  };

  // Handle camera preset changes
  const handleCameraChange = (preset) => {
    setCurrentPreset(preset);
    if (onCameraChange) {
      onCameraChange(preset);
    }
  };

  return (
    <group>
      <PerspectiveCamera makeDefault position={[1.5, 1.5, 1.5]} />
      <OrbitControls {...controlsConfig} />
      
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
        textData={textSettings}
        imageData={imageSettings}
        currentCameraPreset={currentPreset}
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
};

export default Experience;