# Three.js Portfolio Room - Interactive 3D Experience

A Next.js project featuring an interactive 3D room built with Three.js, React, and TypeScript. Users can explore a virtual room with clickable objects, camera focus animations, and responsive controls for both desktop and mobile.

## 🚀 Features

- **Interactive 3D Room**: Explore a detailed 3D environment with realistic lighting and textures
- **Camera Focus System**: Click on objects to focus the camera with smooth animations
- **Responsive Controls**: Optimized touch controls for mobile devices
- **Object Interactions**: Hover effects and click handlers for interactive objects
- **Smooth Animations**: GSAP-powered camera transitions and object animations
- **Performance Optimized**: Efficient rendering with proper mesh management

## 🛠️ Tech Stack

- **Next.js 14** - React framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **TypeScript** - Type safety
- **GSAP** - Animation library
- **Zustand** - State management
- **React Responsive** - Mobile detection

## 📁 Project Structure

```
my-room-portfolio-threejs/
├── app/                          # Next.js app directory
├── components/                   # React components
│   ├── MyRoom.tsx              # Main 3D scene
│   ├── Mesh/                   # 3D object components
│   ├── RenderMesh/             # Mesh rendering logic
│   └── PointCursor/            # Custom cursor
├── hooks/                       # Custom React hooks
│   ├── use-camera-focus.ts     # Camera focus system
│   ├── use-debounce-keydown.ts # Keyboard handling
│   └── hovering/               # Hover effects
├── stores/                      # Zustand state stores
├── data/                        # Configuration data
├── public/                      # Static assets
│   ├── models/                 # 3D models (.glb files)
│   ├── textures/               # Texture images
│   └── videos/                 # Video assets
└── types/                       # TypeScript type definitions
```

This README provides a comprehensive overview of your project, explains the problems we solved, and gives clear instructions for getting started and customizing the project. It's structured to be helpful for both beginners and experienced developers.

## 🎮 Controls

### Desktop
- **Mouse**: Click and drag to rotate camera
- **Scroll**: Zoom in/out
- **Click Objects**: Focus camera on interactive objects
- **Escape**: Reset camera to initial position

### Mobile
- **Touch**: Swipe to rotate camera
- **Pinch**: Zoom in/out
- **Two-finger**: Pan camera
- **Tap Objects**: Focus camera on interactive objects

## 🔧 Problems Solved

### 1. Mobile OrbitControls Not Working

**Problem**: Users couldn't control the camera on mobile devices.

**Solution**: Added mobile-specific OrbitControls configuration:
```typescript
<OrbitControls 
  enablePan={isMobile}           // Enable panning on mobile
  enableZoom={true}              // Enable zooming
  enableDamping={true}           // Smooth movement
  touches={{
    ONE: TOUCH.ROTATE,           // One finger = rotate
    TWO: TOUCH.DOLLY_PAN         // Two fingers = zoom/pan
  }}
  rotateSpeed={isMobile ? 0.5 : 1.0}  // Reduced sensitivity on mobile
/>
```

### 2. Object Visibility During Camera Animations

**Problem**: Objects would suddenly appear during camera transitions, creating jarring visual effects.

**Solution**: Control object visibility before animations start:
```typescript
const resetCamera = useCallback(() => {
  // Show object BEFORE animation starts
  const chairRef = meshRefs?.current.get('Executive_office_chair_raycaster')
  if (chairRef?.current) {
    chairRef.current.visible = true
  }
  
  // Set state BEFORE animation
  setIsCameraFocused(false)
  
  // Start animation...
}, [])
```

### 3. TypeScript Import Errors

**Problem**: "Cannot find namespace 'THREE'" and enum type errors.

**Solution**: Proper imports and enum usage:
```typescript
import * as THREE from "three"
import { TOUCH } from 'three'

// Use proper enum values
touches={{
  ONE: TOUCH.ROTATE,        // ✅ Correct
  TWO: TOUCH.DOLLY_PAN      // ✅ Correct
}}
```

## 🎯 Key Features Explained

### Camera Focus System
The camera focus system allows users to click on objects and smoothly animate the camera to focus on them:

```typescript
// Focus on screen object
const focusOnScreen = useCallback(() => {
  const tl = gsap.timeline()
  tl.to(camera.position, { x: 3.0, y: 6, z: 0.72, duration: 1 })
    .to(orbitControls.target, { x: 7.27, y: 6.30, z: -0.67, duration: 1 }, "-=1")
}, [])
```

### Responsive Camera Positions
Different camera positions for mobile and desktop:
```typescript
export const cameraFocusPositions = {
  screenFocused: {
    camera: {
      desktop: [3.0, 6, 0.72],
      mobile: [3.0, 6, 0.72]  // Normalized for consistency
    }
  }
}
```

### Object Interaction System
Interactive objects with hover effects and click handlers:
```typescript
const hoverHandlers = {
  onPointerEnter: () => setHoveredMesh(meshName),
  onPointerLeave: () => setHoveredMesh(null),
  style: { cursor: 'pointer' }
}
```

## 📚 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open browser**: Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Optimization

The project includes several mobile-specific optimizations:

- **Touch Controls**: Optimized touch gestures for camera control
- **Performance**: Reduced mesh complexity and texture sizes
- **Responsive Design**: Adaptive camera positions and controls
- **Touch Feedback**: Visual feedback for touch interactions

## 🔍 Debugging Tools

Built-in debugging features for development:

- **Camera Logging**: Log camera position and target values
- **Keyboard Shortcuts**: 
  - `Ctrl + L`: Log camera and target
  - `Ctrl + C`: Log camera position only
  - `Ctrl + T`: Log target position only
- **Visual Helpers**: Axes helpers and debug information

## 🎨 Customization

### Adding New Interactive Objects
1. Add mesh configuration in `utils/mesh.config.ts`
2. Add interaction info in `utils/mesh-message.config.ts`
3. The object will automatically become interactive

### Modifying Camera Positions
Edit `data/camera-focus-position.ts` to change camera focus positions for different objects.

### Adding New Animations
Use the existing GSAP timeline system in `hooks/use-camera-focus.ts` for new camera animations.

## 🐛 Common Issues

### "Cannot find namespace 'THREE'"
**Solution**: Add `import * as THREE from "three"` to the file

### Mobile controls not working
**Solution**: Ensure `enablePan={isMobile}` and `enableZoom={true}` are set

### Objects appearing/disappearing weirdly
**Solution**: Control object visibility before animations start, not after

### TypeScript enum errors
**Solution**: Use `TOUCH.ROTATE` instead of `'ROTATE'` string literals

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js, Three.js, and TypeScript**