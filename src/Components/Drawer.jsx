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
  {
    label: "UV Shirt",
    url: "/models/uvshirt.glb",
    description: "Basic UV mapped shirt model"
  }
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
  const [uvMapUrl, setUvMapUrl] = React.useState("");
  const [extractedTexture, setExtractedTexture] = React.useState(null);
  
  // Listen for UV map extraction
  React.useEffect(() => {
    const handleUVMapExtracted = (event) => {
      if (event.detail && event.detail.uvMapUrl) {
        setUvMapUrl(event.detail.uvMapUrl);
      }
    };

    window.addEventListener("uv-map-extracted", handleUVMapExtracted);
    return () => window.removeEventListener("uv-map-extracted", handleUVMapExtracted);
  }, []);

  // Handlers
  const handleModelChange = (url) => {
    setModelUrl(url);
    // Reset other states when model changes
    setImage(null);
    setText("");
    setColorType("single");
    setCurrentColor("#ffffff");
    setGradientColor1("#ffffff");
    setGradientColor2("#000000");
    setGradientDirection(0);
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
    <div className="w-80 h-screen bg-background border-l overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-primary">Shirt Configurator</h2>
            <p className="text-xs text-muted-foreground">Customize your 3D shirt design</p>
          </div>

          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-9">
              <TabsTrigger value="model" className="text-xs">Model</TabsTrigger>
              <TabsTrigger value="style" className="text-xs">Style</TabsTrigger>
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="uv" className="text-xs">UV Map</TabsTrigger>
            </TabsList>

            {/* Model Tab */}
            <TabsContent value="model" className="space-y-3 mt-3">
              <Card className="border-0 shadow-none">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm">Choose Model</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label htmlFor="model-select" className="text-xs font-medium">Select Model Type</Label>
                      <Select value={modelUrl} onValueChange={handleModelChange}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODELS.map((model) => (
                            <SelectItem key={model.url} value={model.url} className="text-xs">
                              <div className="flex flex-col">
                                <span>{model.label}</span>
                                <span className="text-xs text-muted-foreground">{model.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {modelUrl && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <p>Current model: {MODELS.find(m => m.url === modelUrl)?.label}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="space-y-3 mt-3">
              <Card className="border-0 shadow-none">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm">Color & Style</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Color Type</Label>
                      <div className="flex gap-1">
                        <Button
                          variant={colorType === "single" ? "default" : "outline"}
                          className="flex-1 h-7 text-xs"
                          onClick={() => setColorType("single")}
                        >
                          Single Color
                        </Button>
                        <Button
                          variant={colorType === "gradient" ? "default" : "outline"}
                          className="flex-1 h-7 text-xs"
                          onClick={() => setColorType("gradient")}
                        >
                          Gradient
                        </Button>
                      </div>
                    </div>

                    {colorType === "single" ? (
                      <div className="space-y-1">
                        <Label className="text-xs font-medium">Choose Color</Label>
                        <div className="grid grid-cols-6 gap-1">
                          {PRESET_COLORS.map((color) => (
                            <button
                              key={color}
                              className="w-full aspect-square rounded-sm border"
                              style={{ backgroundColor: color }}
                              onClick={() => handleColorChange(color)}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Gradient Colors</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Color 1</Label>
                              <Input
                                type="color"
                                value={gradientColor1}
                                onChange={(e) => {
                                  setGradientColor1(e.target.value);
                                  handleGradientChange();
                                }}
                                className="h-7"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Color 2</Label>
                              <Input
                                type="color"
                                value={gradientColor2}
                                onChange={(e) => {
                                  setGradientColor2(e.target.value);
                                  handleGradientChange();
                                }}
                                className="h-7"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Gradient Direction</Label>
                          <Slider
                            value={[gradientDirection]}
                            onValueChange={([value]) => {
                              setGradientDirection(value);
                              handleGradientChange();
                            }}
                            min={0}
                            max={360}
                            step={1}
                            className="h-3"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-3 mt-3">
              <Card className="border-0 shadow-none">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm">Add Content</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Add Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="h-7 text-xs"
                      />
                    </div>
                    {image && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Scale</Label>
                            <Slider
                              value={[imageScale]}
                              onValueChange={([value]) => setImageScale(value)}
                              min={0.1}
                              max={3}
                              step={0.1}
                              className="h-3"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Rotation</Label>
                            <Slider
                              value={[imageRotation]}
                              onValueChange={([value]) => setImageRotation(value)}
                              min={0}
                              max={360}
                              step={1}
                              className="h-3"
                            />
                          </div>
                        </div>
                        <div className="border rounded-sm overflow-hidden">
                          <img src={image} alt="Preview" className="w-full h-24 object-contain" />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-2" />

                  {/* Text Input */}
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs font-medium">Add Text</Label>
                      <Input
                        type="text"
                        value={text}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder="Enter your text"
                        className="h-7 text-xs"
                      />
                    </div>
                    {text && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Color</Label>
                            <Input
                              type="color"
                              value={textColor}
                              onChange={(e) => setTextColor(e.target.value)}
                              className="h-7"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Size</Label>
                            <Slider
                              value={[textSize]}
                              onValueChange={([value]) => setTextSize(value)}
                              min={8}
                              max={72}
                              step={1}
                              className="h-3"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Font</Label>
                          <Select value={textFont} onValueChange={setTextFont}>
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Arial" className="text-xs">Arial</SelectItem>
                              <SelectItem value="Helvetica" className="text-xs">Helvetica</SelectItem>
                              <SelectItem value="Times New Roman" className="text-xs">Times New Roman</SelectItem>
                              <SelectItem value="Courier New" className="text-xs">Courier New</SelectItem>
                              <SelectItem value="Georgia" className="text-xs">Georgia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* UV Map Tab */}
            <TabsContent value="uv" className="space-y-3 mt-3">
              <Card className="border-0 shadow-none">
                <CardHeader className="p-3 pb-0">
                  <CardTitle className="text-sm">UV Map & Texture</CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {uvMapUrl && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium">UV Map Preview</Label>
                        <div className="border rounded-sm overflow-hidden">
                          <img 
                            src={uvMapUrl} 
                            alt="UV Map" 
                            className="w-full h-32 object-contain bg-white"
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full h-7 text-xs"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = uvMapUrl;
                            a.download = 'uv-map.png';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                        >
                          Download UV Map
                        </Button>
                      </div>
                    </div>
                  )}
                  {extractedTexture && (
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <Label className="text-xs font-medium">Extracted Texture</Label>
                        <div className="border rounded-sm overflow-hidden">
                          <img 
                            src={extractedTexture.image.src} 
                            alt="Extracted Texture" 
                            className="w-full h-32 object-contain bg-white"
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full h-7 text-xs"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = extractedTexture.image.src;
                            a.download = 'texture.png';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                          }}
                        >
                          Download Texture
                        </Button>
                      </div>
                    </div>
                  )}
                  {!uvMapUrl && !extractedTexture && (
                    <div className="text-center text-muted-foreground py-4">
                      <p className="text-xs">Load a model to see UV map and texture</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Drawer; 