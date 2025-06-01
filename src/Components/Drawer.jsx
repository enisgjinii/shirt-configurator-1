import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { Separator } from "./ui/separator";

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

const Drawer = ({ modelUrl, setModelUrl }) => {
  // Shirt color
  const [currentColor, setCurrentColor] = React.useState("#ffffff");
  // Image
  const [image, setImage] = React.useState("");
  // Text
  const [text, setText] = React.useState("");
  const [textColor, setTextColor] = React.useState("#000000");
  // Export format
  const [exportFormat, setExportFormat] = React.useState(EXPORT_FORMATS[0].value);
  // Placement mode
  const [placementMode, setPlacementMode] = React.useState(null); // 'image' | 'text' | null

  // Handlers
  const handleModelChange = (e) => {
    setModelUrl(e.target.value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { modelUrl: e.target.value } }));
  };
  const handleColorInput = (e) => {
    setCurrentColor(e.target.value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { color: e.target.value } }));
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
  const handleTextColor = (e) => {
    setTextColor(e.target.value);
    window.dispatchEvent(new CustomEvent("shirt-controls", { detail: { textColor: e.target.value } }));
  };
  const handleExportFormat = (e) => setExportFormat(e.target.value);

  // Placement mode triggers
  const startImagePlacement = () => {
    setPlacementMode('image');
    window.dispatchEvent(new CustomEvent('shirt-placement', { detail: { type: 'image', data: image } }));
  };
  const startTextPlacement = () => {
    setPlacementMode('text');
    window.dispatchEvent(new CustomEvent('shirt-placement', { detail: { type: 'text', data: { text, color: textColor } } }));
  };

  // Export button handler (to be implemented in 3D logic)
  const handleExport = () => {
    const event = new CustomEvent("shirt-export", { detail: { format: exportFormat } });
    window.dispatchEvent(event);
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="w-full min-h-full bg-white/90 flex flex-col gap-8 rounded-none border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-blue-700 mb-1">Edit Your Model</CardTitle>
          <Separator className="my-2" />
          {/* Model Selector */}
          <div className="flex flex-col gap-2 mb-2">
            <Label htmlFor="model-select" className="font-semibold text-lg text-gray-700">Choose Model</Label>
            <select
              id="model-select"
              value={modelUrl}
              onChange={handleModelChange}
              className="w-full border border-blue-200 rounded-md p-2 shadow"
            >
              {MODELS.map((m) => (
                <option key={m.url} value={m.url}>{m.label}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 flex-1">
          {/* Shirt Color */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="shirt-color" className="font-semibold text-lg text-gray-700">Shirt Color</Label>
            <Input
              id="shirt-color"
              type="color"
              value={currentColor}
              onChange={handleColorInput}
              className="w-10 h-10 p-0 border-2 border-blue-200 rounded-full cursor-pointer shadow"
              aria-label="Change shirt color"
            />
          </div>
          <Separator />
          {/* Add Image */}
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl font-bold text-blue-600">Add Image</CardTitle>
            <Input
              onChange={handleImageInput}
              type="file"
              className="file-input file-input-bordered file-input-primary w-full max-w-xs shadow"
              aria-label="Upload image"
            />
            {image && (
              <Button variant="secondary" className="mt-2" onClick={startImagePlacement}>Place Image on Model</Button>
            )}
          </div>
          <Separator />
          {/* Add Text */}
          <div className="flex flex-col gap-2">
            <CardTitle className="text-xl font-bold text-blue-600">Add Text</CardTitle>
            <Input
              type="text"
              value={text}
              onChange={handleTextInput}
              placeholder="Type here"
              className="w-full max-w-xs shadow"
              aria-label="Add text"
            />
            <div className="flex flex-col gap-1 mt-2">
              <Label htmlFor="text-color" className="font-semibold text-lg text-gray-700">Text Color</Label>
              <Input
                id="text-color"
                type="color"
                value={textColor}
                onChange={handleTextColor}
                className="w-10 h-10 p-0 border-2 border-blue-200 rounded-full cursor-pointer shadow"
                aria-label="Change text color"
              />
            </div>
            {text && (
              <Button variant="secondary" className="mt-2" onClick={startTextPlacement}>Place Text on Model</Button>
            )}
          </div>
          <Separator />
          {/* Export Format */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="export-format" className="font-semibold text-lg text-gray-700">Export Format</Label>
            <select
              id="export-format"
              value={exportFormat}
              onChange={handleExportFormat}
              className="w-full border border-blue-200 rounded-md p-2 shadow"
            >
              {EXPORT_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
        <CardFooter>
          <Button id="export-btn" variant="outline" className="w-full" onClick={handleExport}>Export Design</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Drawer; 