# Simple Responsive 3D Model System

## Overview

This system provides responsive behavior for your 3D model using a simple, stable approach that avoids re-render loops and infinite update cycles. It automatically adjusts camera FOV based on screen size and handles window resize events properly.

## ✅ **Problem Solved**

**Issue**: "Maximum update depth exceeded" error caused by complex state management and unstable dependencies.

**Solution**: Simple, direct resize handling without complex state cycles.

## Features

### 🎥 Simple Responsive Camera
- **Dynamic FOV adjustment** based on screen width
- **Direct resize handling** without state management cycles
- **Stable dependencies** that don't cause re-renders
- **Mobile optimization** with wider FOV for better scene visibility

### 📱 Device-Specific FOV Settings
- **Mobile (≤768px)**: FOV 60-65° for better scene visibility
- **Tablet (769-1024px)**: FOV 50° for balanced view
- **Desktop (>1024px)**: FOV 45° standard view

## Implementation

### Current Working Solution

```tsx
// hooks/use-simple-responsive.ts
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

export const useSimpleResponsive = () => {
  const { camera, gl } = useThree()

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = width / height
        
        // Responsive FOV based on screen size
        if (width <= 768) {
          camera.fov = width <= 480 ? 65 : 60  // Mobile
        } else if (width <= 1024) {
          camera.fov = 50  // Tablet
        } else {
          camera.fov = 45  // Desktop
        }
        
        camera.updateProjectionMatrix()
      }

      gl.setSize(width, height)
      gl.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [camera, gl]) // Stable dependencies only
}
```

### Usage in Experience Component

```tsx
// components/Experience.tsx
import { useSimpleResponsive } from '../hooks/use-simple-responsive'

export const Experience = () => {
  // Add simple responsive behavior
  useSimpleResponsive()
  
  // Rest of your component...
}
```

## How It Works

### **1. Direct Resize Handling**
- Listens to `resize` and `orientationchange` events
- Updates camera and renderer directly without state management
- Uses stable dependencies (`camera`, `gl`) that don't change

### **2. Responsive FOV Logic**
```tsx
if (width <= 768) {
  camera.fov = width <= 480 ? 65 : 60  // Mobile: wider for better view
} else if (width <= 1024) {
  camera.fov = 50                      // Tablet: medium FOV
} else {
  camera.fov = 45                      // Desktop: standard FOV
}
```

### **3. Proper Cleanup**
- Removes event listeners on unmount
- No state updates that could cause cycles
- No complex dependency arrays

## Benefits of This Approach

✅ **No infinite re-renders** - Stable dependencies only  
✅ **Simple implementation** - Direct event handling  
✅ **Better mobile experience** - Wider FOV on smaller screens  
✅ **Performance optimized** - Minimal overhead  
✅ **Maintenance friendly** - Easy to understand and debug  

## Comparison to Complex Solutions

### ❌ **What Caused Problems Before**
```tsx
// Complex state management causing cycles
const [viewportSize, setViewportSize] = useState(...)
const config = { desktop: {...}, mobile: {...} }
const responsiveCamera = useResponsiveCamera(config) // Unstable config
useEffect(() => {
  // State updates that trigger more re-renders
}, [responsiveCamera.isMobile]) // Changing dependency
```

### ✅ **Current Stable Solution**
```tsx
// Simple, direct approach
useSimpleResponsive() // Stable dependencies only
```

## Mobile Experience

- **Portrait Mode**: FOV 65° for optimal scene visibility
- **Mobile Landscape**: FOV 60° for balanced view
- **Touch Controls**: Preserved original OrbitControls settings
- **Performance**: No additional overhead from complex state management

## Integration with Your Existing System

Your current setup maintains:
- ✅ **Original pointer tracking** (no changes to working system)
- ✅ **Mobile OrbitControls** with appropriate speeds
- ✅ **Camera focus system** for screen interactions
- ✅ **Performance optimizations** from previous work

## Manual Resize Equivalent

This provides the responsive behavior you wanted, equivalent to:

```tsx
// Your original manual example
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
```

But with additional responsive FOV adjustments for better mobile experience!

## Troubleshooting

If you encounter "Maximum update depth exceeded":
1. ✅ **Check dependencies** - Only use stable references
2. ✅ **Avoid state cycles** - Don't update state that triggers the same effect
3. ✅ **Use direct updates** - Update Three.js objects directly when possible
4. ✅ **Simplify logic** - Prefer simple event handlers over complex state management 