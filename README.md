# 🎨 Advanced 3D Shirt Configurator

A professional-grade 3D shirt configurator with advanced features for design customization, animation, and high-quality export capabilities.

## ✨ Features

### 🎨 **Advanced Color System**
- **Single Colors**: Choose from preset colors or use custom color picker
- **Gradient Support**: Create beautiful gradients with customizable direction and colors
- **Real-time Preview**: See changes instantly on the 3D model

### 🖼️ **Content Management**
- **Image Upload**: Add custom images with scale and rotation controls
- **Text Overlay**: Add custom text with font, size, and color options
- **UV Texture Extraction**: Automatically extract and work with model textures
- **Positioning Controls**: Precise placement of images and text

### 🌈 **Background Options**
- **Solid Colors**: Choose any background color
- **Image Backgrounds**: Upload custom background images
- **HDRI Environments**: Professional lighting environments (Studio, Sunset, Dawn, Night, etc.)

### 🎬 **Animation System**
- **Multiple Animation Types**:
  - Rotate Y/X: Continuous rotation animations
  - Float: Smooth up-down movement
  - Pulse: Scale-based breathing effect
  - Swing: Pendulum-like rotation
  - Bounce: Bouncing movement
- **Speed Control**: Adjust animation speed from 0.1x to 3x
- **Recording**: Capture animations as WebM videos

### 📸 **Export & Recording**
- **High-Quality Screenshots**:
  - PNG (High Quality)
  - JPEG
  - WebP
- **Multiple Resolutions**:
  - 1920x1080 (Full HD)
  - 1280x720 (HD)
  - 3840x2160 (4K)
  - 2560x1440 (2K)
- **Animation Recording**: Record animated sequences as video files

### 🎛️ **Professional UI**
- **Tabbed Interface**: Organized controls across Colors, Content, Background, and Animation tabs
- **Mobile Responsive**: Works perfectly on desktop and mobile devices
- **Real-time Feedback**: Instant visual feedback for all changes
- **Dark/Light Mode**: Automatic theme switching support

### 🚀 **Technical Features**
- **High Performance**: Optimized 3D rendering with 60+ FPS
- **Advanced Lighting**: Multiple light sources with shadows
- **Memory Efficient**: Smart texture and model management
- **Cross-browser Compatible**: Works in all modern browsers

## 🛠️ Installation

```bash
# Navigate to the project directory
cd shirt-configurator

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📖 Usage

### Basic Setup
1. **Choose Model**: Select from available shirt models
2. **Pick Colors**: Use single colors or create gradients
3. **Add Content**: Upload images or add text overlays
4. **Set Background**: Choose solid colors, images, or HDRI environments
5. **Animate**: Enable animations and choose animation type
6. **Export**: Download high-quality images or record animations

### Advanced Features

#### Creating Gradients
1. Navigate to the **Colors** tab
2. Select **Gradient** option
3. Choose start and end colors
4. Adjust gradient direction (0-360°)
5. See real-time preview on the model

#### Adding Custom Content
1. Go to the **Content** tab
2. **For Images**: Upload, scale (0.1x to 3x), rotate (0° to 360°)
3. **For Text**: Type text, choose color, size (8-72px), and font

#### Setting Up Animations
1. Open the **Animation** tab
2. Toggle "Enable Animation"
3. Select animation type and adjust speed (0.1x to 3x)
4. Click "Record Animation" to capture video

#### High-Quality Export
1. Choose export format (PNG, JPEG, WebP)
2. Select resolution (720p to 4K)
3. Click "Export Design"
4. File downloads automatically

## 🔧 Technical Architecture

### Core Technologies
- **React 18**: Modern React with hooks
- **Three.js**: 3D graphics rendering
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers and components
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives

### Key Components
- `Experience.jsx`: Main 3D scene manager
- `Drawer.jsx`: UI controls and state management
- `TextureExtractor.jsx`: Automatic UV and texture extraction
- `AnimationSystem.js`: Animation management
- `ScreenshotManager.js`: Export functionality

---

Made with ❤️ using React, Three.js, and modern web technologies.