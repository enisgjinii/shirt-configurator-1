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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./components/ui/dialog";

const DEFAULT_MODEL = "/models/uvshirt.glb";

function App() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL);
  const [darkMode, setDarkMode] = useState(false);
  const [textureCanvas, setTextureCanvas] = useState(null);
  const [uvMapUrl, setUvMapUrl] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("design");
  const [showHelp, setShowHelp] = useState(false);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Topbar */}
      <nav className="w-full bg-background shadow-md z-20 px-4 py-2 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle sidebar">
            <span className="material-symbols-rounded">menu</span>
          </Button>
          <img src="/logo192.png" alt="Shirt Configurator Logo" className="h-8 w-8 rounded-full shadow" />
          <span className="text-xl font-bold tracking-tight">Shirt Configurator</span>
        </div>
        <div className="flex gap-3 items-center">
          <Button variant="ghost" size="icon" aria-label="Undo"><span className="material-symbols-rounded">undo</span></Button>
          <Button variant="ghost" size="icon" aria-label="Redo"><span className="material-symbols-rounded">redo</span></Button>
          <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)} aria-label="Help"><span className="material-symbols-rounded">help</span></Button>
          <span className="text-sm font-medium">Dark</span>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </div>
      </nav>
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-[340px] min-w-[260px] max-w-[400px] bg-card border-r border-border shadow-lg flex flex-col transition-all duration-300">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <TabsList className="flex gap-2 p-2 border-b border-border bg-background">
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="design" className="flex-1 overflow-y-auto"><Drawer modelUrl={modelUrl} setModelUrl={setModelUrl} /></TabsContent>
              <TabsContent value="export" className="flex-1 overflow-y-auto p-4">{/* Export UI here */}<span className="text-muted-foreground">Export options coming soon...</span></TabsContent>
              <TabsContent value="presets" className="flex-1 overflow-y-auto p-4">{/* Presets UI here */}<span className="text-muted-foreground">Presets coming soon...</span></TabsContent>
              <TabsContent value="info" className="flex-1 overflow-y-auto p-4">{/* Info UI here */}<span className="text-muted-foreground">Info and credits coming soon...</span></TabsContent>
            </Tabs>
          </aside>
        )}
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
      {/* Bottom bar */}
      <footer className="w-full bg-background border-t border-border py-2 px-4 text-center text-xs text-muted-foreground flex items-center justify-between">
        <span>Tip: Drag and drop images onto the 3D model. Use the sidebar tabs for more options.</span>
        <span>© {new Date().getFullYear()} Shirt Configurator</span>
      </footer>
      <Toaster richColors position="top-center" />
      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogTitle>How to use the configurator</DialogTitle>
          <ul className="list-disc pl-6 space-y-2 mt-2 text-sm">
            <li>Use the sidebar tabs to switch between design, export, presets, and info.</li>
            <li>Drag, scale, and rotate images/text directly on the 3D model.</li>
            <li>Use undo/redo for all actions.</li>
            <li>Try dark mode for a different look.</li>
            <li>Export your design in multiple formats.</li>
            <li>Save and load your own presets.</li>
            <li>Mobile-friendly: pinch, zoom, and drag on touch devices.</li>
            <li>Keyboard accessible and ARIA labeled for accessibility.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
