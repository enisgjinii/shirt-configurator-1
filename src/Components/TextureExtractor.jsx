import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Utility to automatically extract UV map and texture from 3D models
export const useTextureExtractor = (model) => {
  const [extractedTexture, setExtractedTexture] = React.useState(null);
  const [uvMap, setUvMap] = React.useState(null);

  useEffect(() => {
    if (!model) return;

    // Extract textures from the model
    model.traverse((child) => {
      if (child.isMesh && child.material) {
        const material = Array.isArray(child.material) ? child.material[0] : child.material;
        
        // Extract existing textures
        if (material.map) {
          setExtractedTexture(material.map);
        } else if (material.color) {
          // Create a texture from the material color
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = `#${material.color.getHexString()}`;
          ctx.fillRect(0, 0, 512, 512);
          
          const texture = new THREE.CanvasTexture(canvas);
          setExtractedTexture(texture);
        }

        // Extract UV coordinates
        if (child.geometry && child.geometry.attributes.uv) {
          const uvArray = child.geometry.attributes.uv.array;
          const canvas = document.createElement('canvas');
          canvas.width = 512;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');
          
          // Draw UV wireframe
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          
          for (let i = 0; i < uvArray.length; i += 6) {
            const u1 = uvArray[i] * 512;
            const v1 = (1 - uvArray[i + 1]) * 512;
            const u2 = uvArray[i + 2] * 512;
            const v2 = (1 - uvArray[i + 3]) * 512;
            const u3 = uvArray[i + 4] * 512;
            const v3 = (1 - uvArray[i + 5]) * 512;
            
            ctx.beginPath();
            ctx.moveTo(u1, v1);
            ctx.lineTo(u2, v2);
            ctx.lineTo(u3, v3);
            ctx.closePath();
            ctx.stroke();
          }
          
          setUvMap(canvas.toDataURL());
        }
      }
    });
  }, [model]);

  return { extractedTexture, uvMap };
};

// Component for automatic texture and UV extraction
export const TextureExtractor = ({ model, onTextureExtracted, onUVExtracted }) => {
  const { extractedTexture, uvMap } = useTextureExtractor(model);

  useEffect(() => {
    if (extractedTexture && onTextureExtracted) {
      onTextureExtracted(extractedTexture);
    }
  }, [extractedTexture, onTextureExtracted]);

  useEffect(() => {
    if (uvMap && onUVExtracted) {
      onUVExtracted(uvMap);
    }
  }, [uvMap, onUVExtracted]);

  return null; // This is a utility component that doesn't render anything
};

export default TextureExtractor;
