import React, { useState } from "react";
import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import Drawer from "./components/Drawer"
import { Leva } from "leva"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./components/ui/card";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { Toaster } from "sonner";

const DEFAULT_MODEL = "/models/uvshirt.glb";

function App() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-pink-100">
      {/* Navbar */}
      <nav className="w-full bg-white/90 shadow-md z-20 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo192.png" alt="Shirt Configurator Logo" className="h-10 w-10 rounded-full shadow" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">Shirt Configurator</span>
        </div>
        <div className="flex gap-2">
          {/* Add nav actions here if needed */}
        </div>
      </nav>
      <Separator />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-[340px] min-w-[260px] max-w-[400px] bg-white/90 border-r border-blue-100 shadow-lg flex flex-col">
          <Drawer modelUrl={modelUrl} setModelUrl={setModelUrl} />
        </aside>
        {/* Main 3D Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-0 relative">
          <Leva hidden />
          <div className="w-full h-full flex-1 flex items-center justify-center">
            <Card className="w-full h-full rounded-2xl shadow-2xl border border-blue-100 bg-white/80 flex items-center justify-center">
              <CardContent className="w-full h-full p-0 flex items-center justify-center">
                <Canvas className="w-full h-full">
                  <Experience modelUrl={modelUrl} />
                </Canvas>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      {/* Footer */}
      <footer className="w-full bg-white/90 border-t border-blue-100 py-3 px-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Shirt Configurator. All rights reserved.
      </footer>
      <Toaster richColors position="top-center" />
    </div>
  )
}

export default App
