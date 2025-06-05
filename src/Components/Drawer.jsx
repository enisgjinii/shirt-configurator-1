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
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const EXPORT_FORMATS = [
  { label: "PNG (High Quality)", value: "png" },
  { label: "JPEG", value: "jpeg" },
  { label: "WebP", value: "webp" },
  { label: "GLTF (.gltf)", value: "gltf" },
  { label: "GLB (.glb)", value: "glb" },
  { label: "OBJ (.obj)", value: "obj" },
  { label: "STL (.stl)", value: "stl" },
];

const MODELS = [
  { label: "Classic T-Shirt", url: "/models/uvshirt.glb" },
];

const PRESET_COLORS = [
  "#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", 
  "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080",
  "#ffc0cb", "#a52a2a", "#808080", "#008000", "#000080"
];

const PRESET_GRADIENTS = [
  { name: "Sunset", value: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)" },
  { name: "Ocean", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Forest", value: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  { name: "Fire", value: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)" },
  { name: "Purple", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Pink", value: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
];

const BACKGROUND_ENVIRONMENTS = [
  { name: "Studio", value: "studio" },
  { name: "Sunset", value: "sunset" },
  { name: "Dawn", value: "dawn" },
  { name: "Night", value: "night" },
  { name: "Warehouse", value: "warehouse" },
  { name: "Forest", value: "forest" },
  { name: "Apartment", value: "apartment" },
  { name: "City", value: "city" },
];

const ANIMATION_PRESETS = [
  { name: "Rotate Y", value: "rotateY" },
  { name: "Rotate X", value: "rotateX" },
  { name: "Float", value: "float" },
  { name: "Pulse", value: "pulse" },
  { name: "Swing", value: "swing" },
  { name: "Bounce", value: "bounce" },
];

const Drawer = ({ modelUrl, setModelUrl }) => {
  // Shirt styling
  const [currentColor, setCurrentColor] = React.useState("#ffffff");
  const [colorType, setColorType] = React.useState("single"); // single, gradient
  const [gradientColor1, setGradientColor1] = React.useState("#ffffff");
  const [gradientColor2, setGradientColor2] = React.useState("#000000");
  const [gradientDirection, setGradientDirection] = React.useState(135);
  
  // Background settings
  const [backgroundType, setBackgroundType] = React.useState("color"); // color, image, environment
  const [backgroundColor, setBackgroundColor] = React.useState("#f0f0f0");
  const [backgroundImage, setBackgroundImage] = React.useState("");
  const [backgroundEnvironment, setBackgroundEnvironment] = React.useState("studio");
  
  // Image and text
  const [image, setImage] = React.useState("");
  const [imageScale, setImageScale] = React.useState(1);
  const [imageRotation, setImageRotation] = React.useState(0);
  const [imagePosition, setImagePosition] = React.useState({ x: 0, y: 0 });
  const [text, setText] = React.useState("");
  const [textColor, setTextColor] = React.useState("#000000");
  const [textSize, setTextSize] = React.useState(16);
  const [textFont, setTextFont] = React.useState("Arial");
  const [textPosition, setTextPosition] = React.useState({ x: 0, y: 0 });
  
  // Animation settings
  const [animationEnabled, setAnimationEnabled] = React.useState(false);
  const [animationType, setAnimationType] = React.useState("rotateY");
  const [animationSpeed, setAnimationSpeed] = React.useState(1);
  const [isRecording, setIsRecording] = React.useState(false);
  
  // Export settings
  const [exportFormat, setExportFormat] = React.useState("png");
  const [exportQuality, setExportQuality] = React.useState(0.9);
  const [exportResolution, setExportResolution] = React.useState("1920x1080");
  
  // UI state
  const [placementMode, setPlacementMode] = React.useState(null);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  // Handlers
  const handleModelChange = (value) => {
    setModelUrl(value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { modelUrl: value } }));
  };

  const handleColorChange = (color) => {
    setCurrentColor(color);
    const finalColor = colorType === "gradient" 
      ? `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`
      : color;
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { color: finalColor } }));
  };

  const handleGradientChange = () => {
    const gradient = `linear-gradient(${gradientDirection}deg, ${gradientColor1} 0%, ${gradientColor2} 100%)`;
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { color: gradient } }));
  };

  const handleBackgroundChange = (type, value) => {
    window.dispatchEvent(new CustomEvent("shirt-controls", { 
      detail: { 
        background: { type, value } 
      } 
    }));
  };

  const handleAnimationToggle = (enabled) => {
    setAnimationEnabled(enabled);
    window.dispatchEvent(new CustomEvent("shirt-controls", { 
      detail: { 
        animation: { enabled, type: animationType, speed: animationSpeed } 
      } 
    }));
  };

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      window.dispatchEvent(new CustomEvent("shirt-controls", { 
        detail: { 
          image: reader.result,
          imageScale,
          imageRotation,
          imagePosition
        } 
      }));
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleBackgroundImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      setBackgroundImage(reader.result);
      handleBackgroundChange("image", reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleTextChange = (newText) => {
    setText(newText);
    window.dispatchEvent(new CustomEvent("shirt-controls", { 
      detail: { 
        text: newText,
        textColor,
        textSize,
        textFont,
        textPosition
      } 
    }));
  };

  const handleExport = () => {
    window.dispatchEvent(new CustomEvent("shirt-export", { 
      detail: { 
        format: exportFormat,
        quality: exportQuality,
        resolution: exportResolution
      } 
    }));
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    window.dispatchEvent(new CustomEvent("shirt-record", { detail: { action: "start" } }));
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    window.dispatchEvent(new CustomEvent("shirt-record", { detail: { action: "stop" } }));
  };

  // Update animation when settings change
  React.useEffect(() => {
    if (animationEnabled) {
      window.dispatchEvent(new CustomEvent("shirt-controls", { 
        detail: { 
          animation: { enabled: true, type: animationType, speed: animationSpeed } 
        } 
      }));
    }
  }, [animationType, animationSpeed, animationEnabled]);

  // Update gradient when colors change
  React.useEffect(() => {
    if (colorType === "gradient") {
      handleGradientChange();
    }
  }, [gradientColor1, gradientColor2, gradientDirection, colorType]);
  return (
    <ScrollArea className="h-full">
      <Card className="w-full min-h-full bg-card flex flex-col gap-4 rounded-none border-0 shadow-none">
        <CardHeader className="p-2">
          <CardTitle className="text-xl font-bold text-primary">Shirt Configurator</CardTitle>
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
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-8">
              <TabsTrigger value="colors" className="text-xs">Colors</TabsTrigger>
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="background" className="text-xs">Background</TabsTrigger>
              <TabsTrigger value="animation" className="text-xs">Animation</TabsTrigger>
            </TabsList>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-3 mt-2">
              {/* Color Type Selection */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Color Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={colorType === "single" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setColorType("single")}
                    className="flex-1"
                  >
                    Single
                  </Button>
                  <Button
                    variant={colorType === "gradient" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setColorType("gradient")}
                    className="flex-1"
                  >
                    Gradient
                  </Button>
                </div>
              </div>

              {colorType === "single" ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Single Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
                        style={{ background: color }}
                        onClick={() => handleColorChange(color)}
                      />
                    ))}
                  </div>
                  <Input
                    type="color"
                    value={currentColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full h-10"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Label className="text-sm font-medium">Gradient Colors</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Label className="text-xs w-12">Start:</Label>
                      <Input
                        type="color"
                        value={gradientColor1}
                        onChange={(e) => setGradientColor1(e.target.value)}
                        className="w-16 h-8"
                      />
                    </div>
                    <div className="flex gap-2 items-center">
                      <Label className="text-xs w-12">End:</Label>
                      <Input
                        type="color"
                        value={gradientColor2}
                        onChange={(e) => setGradientColor2(e.target.value)}
                        className="w-16 h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Direction: {gradientDirection}°</Label>
                      <Slider
                        value={[gradientDirection]}
                        onValueChange={([value]) => setGradientDirection(value)}
                        min={0}
                        max={360}
                        step={15}
                        className="h-4"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {PRESET_GRADIENTS.map((gradient) => (
                      <TooltipProvider key={gradient.name}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className="w-12 h-6 rounded border hover:scale-105 transition-transform"
                              style={{ background: gradient.value }}
                              onClick={() => {
                                // Extract colors from preset gradient (simplified)
                                setGradientColor1("#667eea");
                                setGradientColor2("#764ba2");
                                setGradientDirection(135);
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>{gradient.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-3 mt-2">
              {/* Image Upload */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Add Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-sm"
                />
                {image && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Scale</Label>
                        <Slider
                          value={[imageScale]}
                          onValueChange={([value]) => setImageScale(value)}
                          min={0.1}
                          max={3}
                          step={0.1}
                          className="h-4"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rotation</Label>
                        <Slider
                          value={[imageRotation]}
                          onValueChange={([value]) => setImageRotation(value)}
                          min={0}
                          max={360}
                          step={1}
                          className="h-4"
                        />
                      </div>
                    </div>
                    <img src={image} alt="Preview" className="w-full h-20 object-cover rounded" />
                  </div>
                )}
              </div>

              <Separator />

              {/* Text Input */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Add Text</Label>
                <Input
                  type="text"
                  value={text}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder="Enter your text"
                  className="text-sm"
                />
                {text && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Color</Label>
                        <Input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-full h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Size</Label>
                        <Slider
                          value={[textSize]}
                          onValueChange={([value]) => setTextSize(value)}
                          min={8}
                          max={72}
                          step={1}
                          className="h-4"
                        />
                      </div>
                    </div>
                    <Select value={textFont} onValueChange={setTextFont}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Background Tab */}
            <TabsContent value="background" className="space-y-3 mt-2">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Background Type</Label>
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    variant={backgroundType === "color" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setBackgroundType("color");
                      handleBackgroundChange("color", backgroundColor);
                    }}
                    className="text-xs"
                  >
                    Color
                  </Button>
                  <Button
                    variant={backgroundType === "image" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBackgroundType("image")}
                    className="text-xs"
                  >
                    Image
                  </Button>
                  <Button
                    variant={backgroundType === "environment" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBackgroundType("environment")}
                    className="text-xs"
                  >
                    HDRI
                  </Button>
                </div>
              </div>

              {backgroundType === "color" && (
                <div className="space-y-2">
                  <Label className="text-sm">Background Color</Label>
                  <Input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      handleBackgroundChange("color", e.target.value);
                    }}
                    className="w-full h-10"
                  />
                </div>
              )}

              {backgroundType === "image" && (
                <div className="space-y-2">
                  <Label className="text-sm">Background Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="text-sm"
                  />
                  {backgroundImage && (
                    <img src={backgroundImage} alt="Background" className="w-full h-20 object-cover rounded" />
                  )}
                </div>
              )}

              {backgroundType === "environment" && (
                <div className="space-y-2">
                  <Label className="text-sm">Environment</Label>
                  <Select 
                    value={backgroundEnvironment} 
                    onValueChange={(value) => {
                      setBackgroundEnvironment(value);
                      handleBackgroundChange("environment", value);
                    }}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BACKGROUND_ENVIRONMENTS.map((env) => (
                        <SelectItem key={env.value} value={env.value}>{env.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </TabsContent>

            {/* Animation Tab */}
            <TabsContent value="animation" className="space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enable Animation</Label>
                <Switch
                  checked={animationEnabled}
                  onCheckedChange={handleAnimationToggle}
                />
              </div>

              {animationEnabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Animation Type</Label>
                    <Select value={animationType} onValueChange={setAnimationType}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ANIMATION_PRESETS.map((anim) => (
                          <SelectItem key={anim.value} value={anim.value}>{anim.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Speed: {animationSpeed}x</Label>
                    <Slider
                      value={[animationSpeed]}
                      onValueChange={([value]) => setAnimationSpeed(value)}
                      min={0.1}
                      max={3}
                      step={0.1}
                      className="h-4"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      size="sm"
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      className="flex-1"
                    >
                      {isRecording ? "⏹ Stop Recording" : "⏺ Record Animation"}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="p-2 space-y-2">
          <div className="w-full space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPORT_FORMATS.map((format) => (
                      <SelectItem key={format.value} value={format.value} className="text-xs">
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Resolution</Label>
                <Select value={exportResolution} onValueChange={setExportResolution}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1920x1080">1920x1080</SelectItem>
                    <SelectItem value="1280x720">1280x720</SelectItem>
                    <SelectItem value="3840x2160">4K</SelectItem>
                    <SelectItem value="2560x1440">2K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full h-9 text-sm" onClick={handleExport}>
              <span className="material-symbols-rounded mr-2">download</span>
              Export Design
            </Button>
          </div>
        </CardFooter>
      </Card>
    </ScrollArea>
  );
};

export default Drawer; 