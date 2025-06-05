import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Utility to automatically extract UV map and texture from 3D models
export const useTextureExtractor = (model, options = {}) => {
  const [extractedTextures, setExtractedTextures] = useState([]);
  const [uvMaps, setUvMaps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    textureResolution = 1024,
    uvMapResolution = 1024,
    showGrid = true,
    gridColor = '#444444',
    uvLineColor = '#ffffff',
    uvLineWidth = 1,
  } = options;

  useEffect(() => {
    if (!model) return;

    setIsLoading(true);
    setError(null);

    try {
      const textures = [];
      const maps = [];

      // Extract textures from the model
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          
          materials.forEach((material, index) => {
            // Extract existing textures
            if (material.map) {
              textures.push({
                texture: material.map,
                name: `texture_${index}`,
                material: material
              });
            } else if (material.color) {
              // Create a texture from the material color
              const canvas = document.createElement('canvas');
              canvas.width = textureResolution;
              canvas.height = textureResolution;
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = `#${material.color.getHexString()}`;
              ctx.fillRect(0, 0, textureResolution, textureResolution);
              
              const texture = new THREE.CanvasTexture(canvas);
              textures.push({
                texture,
                name: `color_${index}`,
                material: material
              });
            }

            // Extract UV coordinates
            if (child.geometry && child.geometry.attributes.uv) {
              const uvArray = child.geometry.attributes.uv.array;
              const canvas = document.createElement('canvas');
              canvas.width = uvMapResolution;
              canvas.height = uvMapResolution;
              const ctx = canvas.getContext('2d');
              
              // Draw background
              ctx.fillStyle = '#000000';
              ctx.fillRect(0, 0, uvMapResolution, uvMapResolution);

              // Draw grid if enabled
              if (showGrid) {
                ctx.strokeStyle = gridColor;
                ctx.lineWidth = 0.5;
                const gridSize = uvMapResolution / 8;
                for (let i = 0; i <= uvMapResolution; i += gridSize) {
                  ctx.beginPath();
                  ctx.moveTo(i, 0);
                  ctx.lineTo(i, uvMapResolution);
                  ctx.stroke();
                  ctx.beginPath();
                  ctx.moveTo(0, i);
                  ctx.lineTo(uvMapResolution, i);
                  ctx.stroke();
                }
              }
              
              // Draw UV wireframe
              ctx.strokeStyle = uvLineColor;
              ctx.lineWidth = uvLineWidth;
              
              for (let i = 0; i < uvArray.length; i += 6) {
                const u1 = uvArray[i] * uvMapResolution;
                const v1 = (1 - uvArray[i + 1]) * uvMapResolution;
                const u2 = uvArray[i + 2] * uvMapResolution;
                const v2 = (1 - uvArray[i + 3]) * uvMapResolution;
                const u3 = uvArray[i + 4] * uvMapResolution;
                const v3 = (1 - uvArray[i + 5]) * uvMapResolution;
                
                ctx.beginPath();
                ctx.moveTo(u1, v1);
                ctx.lineTo(u2, v2);
                ctx.lineTo(u3, v3);
                ctx.closePath();
                ctx.stroke();
              }
              
              maps.push({
                map: canvas.toDataURL(),
                name: `uv_${index}`,
                material: material
              });
            }
          });
        }
      });

      setExtractedTextures(textures);
      setUvMaps(maps);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [model, textureResolution, uvMapResolution, showGrid, gridColor, uvLineColor, uvLineWidth]);

  return { extractedTextures, uvMaps, isLoading, error };
};

// Component for automatic texture and UV extraction
export const TextureExtractor = ({ 
  model, 
  onTextureExtracted, 
  onUVExtracted,
  options = {}
}) => {
  const { extractedTextures, uvMaps, isLoading, error } = useTextureExtractor(model, options);

  useEffect(() => {
    if (extractedTextures.length > 0 && onTextureExtracted) {
      onTextureExtracted(extractedTextures);
    }
  }, [extractedTextures, onTextureExtracted]);

  useEffect(() => {
    if (uvMaps.length > 0 && onUVExtracted) {
      onUVExtracted(uvMaps);
    }
  }, [uvMaps, onUVExtracted]);

  if (error) {
    console.error('Texture extraction error:', error);
  }

  return null; // This is a utility component that doesn't render anything
};

export default TextureExtractor;
