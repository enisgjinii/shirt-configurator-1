import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import Drawer from "./components/Drawer"
import { Leva } from "leva"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { Toaster } from "sonner";
import { Switch } from "./components/ui/switch";

const DEFAULT_MODEL = "/models/uvshirt.glb";

function App() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL);
  const [darkMode, setDarkMode] = useState(false);
  const [textureCanvas, setTextureCanvas] = useState(null);
  const [uvMapUrl, setUvMapUrl] = useState("");

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={"min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300"}>
      {/* Navbar */}
      <nav className="w-full bg-background shadow-md z-20 px-8 py-3 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <img src="/logo192.png" alt="Shirt Configurator Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="text-2xl font-bold tracking-tight">Shirt Configurator</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-medium">Dark Mode</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </nav>
      <Separator />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-[340px] min-w-[260px] max-w-[400px] bg-card border-r border-border shadow-lg flex flex-col">
          <Drawer modelUrl={modelUrl} setModelUrl={setModelUrl} />
        </aside>
        {/* Main 3D Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-0 relative bg-background">
          <Leva hidden />
          <div className="w-full h-full flex-1 flex items-center justify-center relative">
            <Card className="w-full h-full rounded-2xl shadow-2xl border border-border bg-card flex items-center justify-center">
              <CardContent className="w-full h-full p-0 flex items-center justify-center">
                <Canvas className="w-full h-full">
                  <Experience modelUrl={modelUrl} onTextureCanvas={setTextureCanvas} onUvMapUrl={setUvMapUrl} />
                </Canvas>
              </CardContent>
            </Card>
            {/* Texture and UV Map Preview */}
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-4">
              {textureCanvas && (
                <Card className="w-64">
                  <CardTitle className="text-base font-bold p-2">Texture Preview</CardTitle>
                  <CardContent className="flex flex-col items-center gap-2">
                    <img src={textureCanvas.toDataURL()} alt="Texture Preview" className="rounded border" />
                  </CardContent>
                </Card>
              )}
              {uvMapUrl && (
                <Card className="w-64">
                  <CardTitle className="text-base font-bold p-2">UV Map</CardTitle>
                  <CardContent className="flex flex-col items-center gap-2">
                    <img src={uvMapUrl} alt="UV Map" className="rounded border" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
      {/* Footer */}
      <footer className="w-full bg-background border-t border-border py-3 px-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Shirt Configurator. All rights reserved.
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  )
}

export default App
