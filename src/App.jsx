import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import Drawer from "./components/Drawer"
import { Leva } from "leva"
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Toaster } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import { ScrollArea } from "./components/ui/scroll-area";
import { Badge } from "./components/ui/badge";

const DEFAULT_MODEL = "/models/uvshirt.glb";

function App() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [gltf, setGltf] = useState(null);
  const [extractedTextures, setExtractedTextures] = useState([]);
  const containerRef = useRef(null);

  // Handle responsive design and prevent scrolling
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    const preventScroll = (e) => {
      e.preventDefault();
    };

    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Handle model loading and texture extraction
  useEffect(() => {
    const handleModelLoaded = (event) => {
      if (event.detail && event.detail.gltf) {
        setGltf(event.detail.gltf);
      }
    };

    const handleTexturesExtracted = (event) => {
      if (event.detail && event.detail.textures) {
        setExtractedTextures(event.detail.textures);
      }
    };

    window.addEventListener('model-loaded', handleModelLoaded);
    window.addEventListener('textures-extracted', handleTexturesExtracted);

    return () => {
      window.removeEventListener('model-loaded', handleModelLoaded);
      window.removeEventListener('textures-extracted', handleTexturesExtracted);
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 text-foreground transition-all duration-500">
      <div className="flex flex-1 min-h-0">
        {/* Enhanced Sidebar */}
        {!isMobile && (
          <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-auto max-h-[calc(100vh-48px)] my-6 ml-6 w-[380px] bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-rounded text-white text-lg">palette</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Design Studio</h2>
                    <p className="text-xs text-muted-foreground">Professional 3D Configurator</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all duration-200"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <span className="material-symbols-rounded text-lg">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-white/10 transition-all duration-200"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="material-symbols-rounded text-lg">close</span>
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4">
                  <Drawer 
                    modelUrl={modelUrl} 
                    setModelUrl={setModelUrl}
                    gltf={gltf}
                    extractedTextures={extractedTextures}
                  />
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </Badge>
                    <span className="text-xs">v2.0.0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-rounded text-base">settings</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="material-symbols-rounded text-base">help</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Main 3D Area */}
        <main className={`flex-1 flex flex-col items-center justify-center p-0 relative transition-all duration-500 ${sidebarOpen && !isMobile ? 'ml-[440px]' : ''}`} ref={containerRef}>
          <Leva hidden />
          <div className="w-full h-full flex-1 flex items-center justify-center relative">
            <Card className="w-full h-full rounded-none shadow-none bg-transparent border-0 flex items-center justify-center relative overflow-hidden">
              <CardContent className="w-full h-full p-0 flex items-center justify-center relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none"></div>
                
                <Canvas
                  className="w-full h-full"
                  camera={{
                    position: [0, 0, 5],
                    fov: 45,
                    near: 0.1,
                    far: 1000
                  }}
                  gl={{
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: true,
                    powerPreference: "high-performance"
                  }}
                  dpr={[1, 2]}
                >
                  <Experience 
                    modelUrl={modelUrl}
                    onModelLoaded={(gltf) => {
                      window.dispatchEvent(new CustomEvent('model-loaded', { detail: { gltf } }));
                    }}
                    onTexturesExtracted={(textures) => {
                      window.dispatchEvent(new CustomEvent('textures-extracted', { detail: { textures } }));
                    }}
                  />
                </Canvas>
                
                {/* Enhanced Performance Badge */}
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <Badge className="bg-black/20 backdrop-blur-sm text-white border-white/20">
                    <span className="material-symbols-rounded text-xs mr-1">3d_rotation</span>
                    3D Configurator
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Mobile Menu Button */}
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 absolute top-4 left-4 z-30 bg-white/20 backdrop-blur-xl rounded-2xl hover:bg-white/30 transition-all duration-200 shadow-lg border border-white/20" 
                    aria-label="Toggle sidebar"
                  >
                    <span className="material-symbols-rounded text-xl">menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-[380px] p-0 bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-3xl"
                >
                  <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-rounded text-white text-lg">palette</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Design Studio</h2>
                        <p className="text-xs text-muted-foreground">Professional 3D Configurator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:bg-white/10 transition-colors"
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        <span className="material-symbols-rounded text-lg">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:bg-white/10 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="material-symbols-rounded text-lg">close</span>
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4">
                      <Drawer 
                        modelUrl={modelUrl} 
                        setModelUrl={setModelUrl}
                        gltf={gltf}
                        extractedTextures={extractedTextures}
                      />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          Online
                        </Badge>
                        <span className="text-xs">v2.0.0</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <span className="material-symbols-rounded text-base">settings</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <span className="material-symbols-rounded text-base">help</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Enhanced Toggle Sidebar Button (Desktop) */}
            {!isMobile && !sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 absolute top-6 left-6 z-30 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/30 transition-all duration-200 shadow-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="material-symbols-rounded text-xl">menu</span>
              </Button>
            )}
          </div>
        </main>
      </div>
      <Toaster 
        richColors 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        }}
      />
    </div>
  )
}

export default App
