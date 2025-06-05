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

const DEFAULT_MODEL = "/models/uvshirt.glb";

function App() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
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

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gradient-to-br from-background to-background/95 text-foreground transition-colors duration-300">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        {!isMobile && (
          <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-auto max-h-[calc(100vh-48px)] my-6 ml-6 w-[360px] bg-card/30 backdrop-blur-xl border border-neutral-200 rounded-3xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-primary text-xl">palette</span>
                  <h2 className="text-lg font-semibold">Design Panel</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    <span className="material-symbols-rounded text-xl">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="material-symbols-rounded text-xl">close</span>
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4">
                  <Drawer modelUrl={modelUrl} setModelUrl={setModelUrl} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-sm">info</span>
                    <span>Version 1.0.0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                    >
                      <span className="material-symbols-rounded text-xl">settings</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                    >
                      <span className="material-symbols-rounded text-xl">help</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Main 3D Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-0 relative bg-background/50" ref={containerRef}>
          <Leva hidden />
          <div className="w-full h-full flex-1 flex items-center justify-center relative">
            <Card className="w-full h-full rounded-none shadow-none bg-transparent flex items-center justify-center">
              <CardContent className="w-full h-full p-0 flex items-center justify-center">
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
                    preserveDrawingBuffer: true
                  }}
                >
                  <Experience modelUrl={modelUrl} />
                </Canvas>
              </CardContent>
            </Card>
            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 absolute top-3 left-3 z-30 bg-background/40 backdrop-blur-xl rounded-2xl hover:bg-background/60 transition-all duration-200" 
                    aria-label="Toggle sidebar"
                  >
                    <span className="material-symbols-rounded text-xl">menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="w-[360px] p-0 bg-card/30 backdrop-blur-xl border border-neutral-200 rounded-3xl"
                >
                  <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-rounded text-primary text-xl">palette</span>
                      <h2 className="text-lg font-semibold">Design Panel</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        <span className="material-symbols-rounded text-xl">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="material-symbols-rounded text-xl">close</span>
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4">
                      <Drawer modelUrl={modelUrl} setModelUrl={setModelUrl} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-rounded text-sm">info</span>
                        <span>Version 1.0.0</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                        >
                          <span className="material-symbols-rounded text-xl">settings</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl hover:bg-background/50 transition-colors"
                        >
                          <span className="material-symbols-rounded text-xl">help</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
            {/* Toggle Sidebar Button (Desktop) */}
            {!isMobile && !sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                  className="h-10 w-10 absolute top-6 left-6 z-30 bg-background/40 backdrop-blur-xl border-2 border-white/50 rounded-2xl hover:bg-background/60 transition-all duration-200"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="material-symbols-rounded text-xl">menu</span>
              </Button>
            )}
          </div>
        </main>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  )
}

export default App
