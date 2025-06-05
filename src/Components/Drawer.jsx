import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Separator } from "./ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const EXPORT_FORMATS = [
  { label: "GLTF (.gltf)", value: "gltf" },
  { label: "GLB (.glb)", value: "glb" },
  { label: "OBJ (.obj)", value: "obj" },
  { label: "STL (.stl)", value: "stl" },
  { label: "PNG (screenshot)", value: "png" },
];

const MODELS = [
  { label: "Classic T-Shirt", url: "/models/uvshirt.glb" },
  { label: "Low Poly Shirt", url: "https://models.babylonjs.com/boombox.glb" },
  { label: "Duck", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf" },
  { label: "Avocado", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf" },
  { label: "Damaged Helmet", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf" },
  { label: "Fox", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf" },
  { label: "Lantern", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF/Lantern.gltf" },
  { label: "Cesium Man", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf" },
  { label: "Sci-Fi Helmet", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/SciFiHelmet/glTF/SciFiHelmet.gltf" },
  { label: "VC Model", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/VC/glTF/VC.gltf" },
  { label: "Box", url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf" },
];

const SUGGESTED_COLORS = [
  "#ffffff", "#000000", "#f87171", "#fbbf24", "#34d399", "#60a5fa", "#a78bfa", "#f472b6"
];

const SUGGESTED_GRADIENTS = [
  "linear-gradient(135deg, #f87171 0%, #fbbf24 100%)",
  "linear-gradient(135deg, #34d399 0%, #60a5fa 100%)",
  "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)"
];

const Drawer = ({ modelUrl, setModelUrl }) => {
  // Shirt color
  const [currentColor, setCurrentColor] = React.useState("#ffffff");
  // Image
  const [image, setImage] = React.useState("");
  const [imageScale, setImageScale] = React.useState(1);
  const [imageRotation, setImageRotation] = React.useState(0);
  // Text
  const [text, setText] = React.useState("");
  const [textColor, setTextColor] = React.useState("#000000");
  const [textSize, setTextSize] = React.useState(16);
  const [textFont, setTextFont] = React.useState("Arial");
  // Export format
  const [exportFormat, setExportFormat] = React.useState(EXPORT_FORMATS[0].value);
  // Placement mode
  const [placementMode, setPlacementMode] = React.useState(null); // 'image' | 'text' | null
  // Advanced settings
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [enableShadows, setEnableShadows] = React.useState(true);
  const [enableAntialiasing, setEnableAntialiasing] = React.useState(true);

  // Handlers
  const handleModelChange = (value) => {
    setModelUrl(value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { modelUrl: value } }));
  };

  const handleColorInput = (value) => {
    setCurrentColor(value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { color: value } }));
  };

  const handleImageInput = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { image: reader.result } }));
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleTextInput = (e) => {
    setText(e.target.value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { text: e.target.value } }));
  };

  const handleTextColor = (value) => {
    setTextColor(value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { textColor: value } }));
  };

  const handleExportFormat = (value) => setExportFormat(value);

  // Placement mode triggers
  const startImagePlacement = () => {
    setPlacementMode('image');
    window.dispatchEvent(new CustomEvent('shirt-placement', { 
      detail: { 
        type: 'image', 
        data: {
          image,
          scale: imageScale,
          rotation: imageRotation
        }
      } 
    }));
  };

  const startTextPlacement = () => {
    setPlacementMode('text');
    window.dispatchEvent(new CustomEvent('shirt-placement', { 
      detail: { 
        type: 'text', 
        data: { 
          text, 
          color: textColor,
          size: textSize,
          font: textFont
        } 
      } 
    }));
  };

  // Export button handler
  const handleExport = () => {
    const event = new CustomEvent("shirt-export", { 
      detail: { 
        format: exportFormat,
        settings: {
          shadows: enableShadows,
          antialiasing: enableAntialiasing
        }
      } 
    });
    window.dispatchEvent(event);
  };

  return (
    <ScrollArea className="h-full">
      <Card className="w-full min-h-full bg-card flex flex-col gap-4 rounded-none border-0 shadow-none">
        <CardHeader className="p-2">
          <CardTitle className="text-xl font-bold text-primary">Edit Your Model</CardTitle>
          <Separator className="my-1" />
          {/* Model Selector */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="model-select" className="text-sm font-medium">Choose Model</Label>
            <Select value={modelUrl} onValueChange={handleModelChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.url} value={m.url} className="text-sm">{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 flex-1 p-2">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="basic" className="text-sm">Basic</TabsTrigger>
              <TabsTrigger value="advanced" className="text-sm">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-3 mt-2">
              {/* Shirt Color */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="shirt-color" className="text-sm font-medium">Shirt Color</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-8 h-8 p-0 rounded-full border-2 border-border shadow" style={{ background: currentColor, backgroundImage: currentColor.startsWith('linear') ? currentColor : undefined }} aria-label="Change shirt color">
                      <span className="sr-only">Pick color</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1">
                      {SUGGESTED_COLORS.map((color) => (
                        <TooltipProvider key={color}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform" style={{ background: color }} onClick={() => handleColorInput(color)} />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">{color}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {SUGGESTED_GRADIENTS.map((gradient, i) => (
                        <TooltipProvider key={i}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="w-12 h-6 rounded-md border border-border hover:scale-110 transition-transform" style={{ background: gradient }} onClick={() => handleColorInput(gradient)} />
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Gradient {i + 1}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Input type="color" value={currentColor.startsWith('#') ? currentColor : '#ffffff'} onChange={e => handleColorInput(e.target.value)} className="w-8 h-8 p-0 border border-border rounded-full cursor-pointer shadow" aria-label="Custom color" />
                      <span className="text-xs text-muted-foreground">Custom</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Separator className="my-1" />
              {/* Add Image */}
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base font-bold">Add Image</CardTitle>
                <Input
                  onChange={handleImageInput}
                  type="file"
                  className="file-input file-input-bordered file-input-primary w-full max-w-xs shadow h-8 text-sm"
                  aria-label="Upload image"
                />
                {image && (
                  <div className="space-y-2 mt-1">
                    <div className="space-y-1">
                      <Label className="text-xs">Scale</Label>
                      <Slider value={[imageScale]} onValueChange={([value]) => setImageScale(value)} min={0.1} max={2} step={0.1} className="h-4" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rotation</Label>
                      <Slider value={[imageRotation]} onValueChange={([value]) => setImageRotation(value)} min={0} max={360} step={1} className="h-4" />
                    </div>
                    <Button variant="secondary" className="w-full h-8 text-sm" onClick={startImagePlacement}>Place Image</Button>
                  </div>
                )}
              </div>
              <Separator className="my-1" />
              {/* Add Text */}
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base font-bold">Add Text</CardTitle>
                <Input
                  type="text"
                  value={text}
                  onChange={handleTextInput}
                  placeholder="Type here"
                  className="w-full max-w-xs shadow h-8 text-sm"
                  aria-label="Add text"
                />
                {text && (
                  <div className="space-y-2 mt-1">
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs">Text Color</Label>
                      <Input
                        type="color"
                        value={textColor}
                        onChange={e => handleTextColor(e.target.value)}
                        className="w-8 h-8 p-0 border border-border rounded-full cursor-pointer shadow"
                        aria-label="Change text color"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Text Size</Label>
                      <Slider value={[textSize]} onValueChange={([value]) => setTextSize(value)} min={8} max={72} step={1} className="h-4" />
                    </div>
                    <Select value={textFont} onValueChange={setTextFont}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial" className="text-sm">Arial</SelectItem>
                        <SelectItem value="Helvetica" className="text-sm">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman" className="text-sm">Times New Roman</SelectItem>
                        <SelectItem value="Courier New" className="text-sm">Courier New</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="secondary" className="w-full h-8 text-sm" onClick={startTextPlacement}>Place Text</Button>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-3 mt-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Enable Shadows</Label>
                  <Switch checked={enableShadows} onCheckedChange={setEnableShadows} className="h-4 w-7" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Enable Antialiasing</Label>
                  <Switch checked={enableAntialiasing} onCheckedChange={setEnableAntialiasing} className="h-4 w-7" />
                </div>
                <Separator className="my-1" />
                <div className="space-y-1">
                  <Label className="text-sm">Export Format</Label>
                  <Select value={exportFormat} onValueChange={handleExportFormat}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPORT_FORMATS.map((f) => (
                        <SelectItem key={f.value} value={f.value} className="text-sm">{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="p-2">
          <Button className="w-full h-8 text-sm" onClick={handleExport}>
            Export Design
            <Badge variant="secondary" className="ml-2 text-[10px]">Beta</Badge>
          </Button>
        </CardFooter>
      </Card>
    </ScrollArea>
  );
};

export default Drawer; 