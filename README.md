# Three.js Portfolio Room - Interactive 3D Experience

A Next.js project featuring an interactive 3D room built with Three.js, React, and TypeScript. Users can explore a virtual room with clickable objects, camera focus animations, responsive controls, and adaptive camera behavior that automatically adjusts to any screen size.

## 🚀 Features

### 🎮 **Interactive 3D Experience**
- **Interactive 3D Room**: Explore a detailed 3D environment with realistic lighting and textures
- **Object Interactions**: Hover effects and click handlers for interactive objects
- **Camera Focus System**: Click on objects to focus the camera with smooth animations
- **Pointer-Based Room Rotation**: Mouse/pointer controls for smooth room exploration

### 📱 **Responsive & Mobile Optimized**
- **Adaptive Camera System**: Automatically adjusts FOV based on screen size
  - **Mobile (≤768px)**: FOV 60-65° for optimal scene visibility
  - **Tablet (769-1024px)**: FOV 50° for balanced viewing
  - **Desktop (>1024px)**: FOV 45° standard experience
- **Touch-Optimized Controls**: Enhanced mobile controls with proper sensitivity
- **Portrait Mode Support**: Wider FOV in portrait orientation for better UX
- **Responsive OrbitControls**: Different control speeds for different devices

### ⚡ **Performance & Optimization**
- **Stable Responsive System**: Avoids infinite re-render loops and excessive updates
- **Optimized Rendering**: Efficient mesh management and texture loading
- **Frame Rate Optimization**: RequestAnimationFrame-based smooth updates
- **Memory Management**: Proper cleanup of event listeners and resources
- **Loading System**: Progressive loading with smooth transitions

### 🎨 **Advanced Interactions**
- **Smooth Animations**: GSAP-powered camera transitions and object animations
- **Hover Message System**: Interactive tooltips and information displays
- **Wood Mesh Animations**: Sequential animation system for interactive elements
- **Screen Iframe Integration**: Embedded interactive content within the 3D space

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **TypeScript** - Type safety and developer experience
- **GSAP** - High-performance animation library
- **Zustand** - Lightweight state management
- **React Responsive** - Mobile detection and responsive utilities
- **@react-three/drei** - Three.js helpers and components

## 📋 **Recent Updates**

### ✅ **Responsive Camera System (Latest)**
- **Problem Solved**: Fixed "Maximum update depth exceeded" errors
- **Solution**: Implemented simple, stable responsive system without state management cycles
- **Benefits**: 
  - Zero infinite re-renders
  - Better mobile experience with adaptive FOV
  - Smooth resize handling
  - Performance optimized

### 🔧 **Architecture Improvements**
- **Stable Dependencies**: All hooks use stable references to prevent re-render loops
- **Direct Event Handling**: Window resize events handled directly without complex state
- **Simplified Implementation**: Removed complex responsive hooks in favor of simple, reliable approach

## 🏗️ **Project Structure**

```
├── components/
│   ├── Experience.tsx         # Main 3D scene container
│   ├── Scene.tsx             # Scene wrapper with pointer controls
│   ├── MyRoom.tsx            # 3D room model component
│   ├── LoadingSystem.tsx     # Progressive loading system
│   └── mesh/                 # Interactive and static mesh components
├── hooks/
│   ├── use-simple-responsive.ts    # Responsive camera system
│   ├── use-camera-focus.ts         # Camera focus animations
│   ├── use-hover-animation.ts      # Hover interaction system
│   └── videos/                     # Video texture management
├── stores/
│   ├── useCameraStore.ts           # Camera state management
│   ├── usePointerStore.ts          # Pointer tracking system
│   └── useHoverStore.ts            # Hover state management
└── Readme/                         # Comprehensive documentation
```

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd my-room-portfolio-threejs

# Install dependencies
npm install
# or
yarn install
# or
pnpm install

# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the project.

## 📱 **Device Experience**

### **Desktop** 
- Full camera controls with mouse
- Standard FOV (45°) for optimal viewing
- High-precision pointer tracking
- Complete OrbitControls functionality

### **Tablet**
- Touch-optimized controls
- Medium FOV (50°) for balanced view
- Moderate control sensitivity
- Pan, rotate, and zoom enabled

### **Mobile**
- Wide FOV (60-65°) for better scene visibility
- Touch-friendly controls with reduced sensitivity
- Portrait mode optimization
- Optimized performance for mobile devices

## 🎯 **Key Components**

### **Responsive Camera System**
```tsx
// Automatically handles screen size changes
import { useSimpleResponsive } from '../hooks/use-simple-responsive'

export const Experience = () => {
  useSimpleResponsive() // Adds responsive behavior
  // ... rest of component
}
```

### **Interactive Mesh System**
- **Static Meshes**: Non-interactive room elements with optimized rendering
- **Interactive Meshes**: Clickable objects with hover effects and animations
- **Animated Meshes**: Sequentially animated elements with GSAP

### **Performance Optimizations**
- **Stable Dependencies**: Prevents infinite re-render loops
- **Direct Three.js Updates**: Bypasses React state for performance-critical updates
- **Memory Management**: Proper cleanup of resources and event listeners
- **Optimized Textures**: Efficient texture loading and management

## 📚 **Documentation**

Detailed documentation available in the `/Readme` folder:

- **[Simple Responsive 3D Model System](./Readme/Responsive-3D-Model-System.md)** - Complete responsive implementation guide
- **[Camera Focus System](./Readme/Camera-Focus-System.md)** - Camera animation and focus system
- **[Performance Optimizations](./Readme/UseFrame-Performance-Optimization.md)** - Performance optimization strategies
- **[Interactive Hover System](./Readme/Interactive-Hover-Tooltips-Feature.md)** - Hover effects and tooltips
- **[Loading System](./Readme/Fast-Loading-Optimizations.md)** - Progressive loading implementation

## 🐛 **Troubleshooting**

### **Common Issues**

**"Maximum update depth exceeded" Error**
- ✅ **Fixed**: Updated to stable responsive system
- **Solution**: Uses direct event handling without state management cycles

**Poor Mobile Performance**
- ✅ **Optimized**: Responsive FOV and touch controls
- **Mobile FOV**: Wider field of view for better scene visibility

**Camera Not Responsive**
- **Check**: Ensure `useSimpleResponsive()` is called in Experience component
- **Verify**: Window resize events are being handled properly

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Three.js community for excellent 3D library
- React Three Fiber for seamless React integration
- GSAP for smooth animations
- Next.js team for the robust framework