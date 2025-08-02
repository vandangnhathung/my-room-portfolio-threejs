# Pointer-Based Room Rotation System

## Overview

This system implements mouse/pointer-controlled rotation of the 3D room on desktop devices, providing an intuitive way for users to explore the scene. The system seamlessly integrates with the existing camera focus system to ensure smooth transitions and prevent animation conflicts.

## Features

### 🖱️ **Desktop Pointer Control**
- **Mouse-based rotation**: Room rotates smoothly based on horizontal mouse position
- **Desktop-only**: Automatically disabled on mobile devices (≤768px width)
- **Smooth interpolation**: Uses linear interpolation (lerp) for fluid rotation transitions
- **Constrained rotation**: Limited to ±45° rotation range for optimal viewing

### 📱 **Mobile Compatibility**
- **OrbitControls enabled**: Full touch-based camera control on mobile
- **Pointer rotation disabled**: No interference with touch gestures
- **Responsive behavior**: Automatic device detection and appropriate control activation

### 🎯 **Camera Focus Integration**
- **Immediate disable**: Pointer rotation stops instantly when camera focus is triggered
- **Position reset**: Room rotation resets to 0° for exact camera positioning
- **Animation protection**: Prevents pointer interference during camera transitions
- **Auto re-enable**: Pointer control resumes when camera focus is reset (ESC key)

## Technical Implementation

### Architecture

```
Experience.tsx (Root)
├── OrbitControls (Mobile only)
├── Pointer tracking (Desktop)
└── Scene.tsx
    ├── Group rotation logic
    ├── Pointer disable system
    └── MyRoom.tsx
        └── Focus triggers
```

### Key Components

#### **1. Experience.tsx**
- **Purpose**: Main 3D scene controller
- **Responsibilities**:
  - OrbitControls management (mobile-only)
  - Pointer position tracking
  - Global scene setup
  - Device detection

```typescript
// Pointer tracking
const pointerRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 })

useEffect(() => {
  const onPointerMove = (e: PointerEvent) => {
    pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
    pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
  }
  window.addEventListener('pointermove', onPointerMove)
  return () => window.removeEventListener('pointermove', onPointerMove)
})
```

#### **2. Scene.tsx**
- **Purpose**: 3D room rotation controller
- **Responsibilities**:
  - Group rotation application
  - Pointer disable mechanism
  - Smooth interpolation

```typescript
// Rotation logic
useFrame(() => {
  if (!groupRef.current || isPointerDisabled.current) return
  
  const targetRotation = pointerRef.current.x * Math.PI * 0.25
  groupRotationRef.current = THREE.MathUtils.lerp(groupRotationRef.current, targetRotation, 0.1)
  groupRef.current.rotation.y = groupRotationRef.current
})
```

#### **3. Camera Store Integration**
- **Purpose**: Centralized disable system
- **Responsibilities**:
  - Disable callback management
  - Automatic trigger on focus
  - Cross-component coordination

```typescript
// Store integration
focusOnScreen: (orbitControlsRef, camera, isMobile, meshRefs) => {
  // Immediately disable pointer when any focus is triggered
  if (pointerDisableCallback) {
    pointerDisableCallback()
  }
  // ... rest of focus logic
}
```

## Device Behavior

### Desktop (>768px)
| Control Type | Status | Behavior |
|-------------|--------|----------|
| **Pointer Rotation** | ✅ Enabled | Room rotates with mouse X position |
| **OrbitControls** | ❌ Disabled | No rotation, zoom, or pan |
| **Camera Focus** | ✅ Enabled | Works with all triggers |

### Mobile (≤768px)
| Control Type | Status | Behavior |
|-------------|--------|----------|
| **Pointer Rotation** | ❌ Disabled | No mouse-based rotation |
| **OrbitControls** | ✅ Enabled | Full touch controls available |
| **Camera Focus** | ✅ Enabled | Works with all triggers |

## Rotation Mechanics

### **Pointer Mapping**
```typescript
// Mouse X position mapped to rotation
const normalizedX = (mouseX / windowWidth) * 2 - 1  // Range: -1 to 1
const targetRotation = normalizedX * Math.PI * 0.25  // Range: -45° to 45°
```

### **Smooth Interpolation**
```typescript
// Lerp for smooth transitions
groupRotationRef.current = THREE.MathUtils.lerp(
  groupRotationRef.current,  // Current rotation
  targetRotation,            // Target rotation
  0.1                        // Interpolation factor (10% per frame)
)
```

### **Reset Mechanism**
```typescript
// Immediate reset when focusing
const disableFunction = () => {
  isPointerDisabled.current = true
  if (groupRef.current) {
    groupRef.current.rotation.y = 0      // Visual reset
    groupRotationRef.current = 0         // Internal reset
  }
}
```

## Integration Points

### **Focus Triggers**
All these triggers automatically disable pointer rotation:

1. **PointCursor clicks** (screen interaction button)
2. **Interactive mesh clicks** (3D objects)
3. **Direct focusOnScreen calls** (programmatic)

### **Reset Triggers**
Pointer rotation re-enables on:

1. **ESC key press** (camera reset)
2. **Manual camera reset** (programmatic)
3. **Camera focus state change** (isCameraFocused = false)

## Performance Optimizations

### **Efficient Updates**
- **Single useFrame**: Only one animation loop for rotation
- **Early returns**: Skip processing when disabled or no group ref
- **Bounded calculations**: Limited rotation range reduces computation

### **Memory Management**
- **Ref-based state**: No unnecessary re-renders
- **Event cleanup**: Proper listener removal
- **Callback cleanup**: Store callback disposal

## User Experience

### **Intuitive Controls**
- **Natural mapping**: Mouse left/right = room left/right rotation
- **Smooth motion**: Lerp interpolation prevents jerky movement
- **Responsive feel**: Immediate response to mouse movement

### **Seamless Transitions**
- **Instant disable**: No delay when focusing on elements
- **Perfect positioning**: Room resets to exact angles for camera focus
- **Conflict prevention**: No interference between pointer and camera animations

## Configuration

### **Rotation Limits**
```typescript
const maxRotation = Math.PI * 0.25  // ±45 degrees
```

### **Interpolation Speed**
```typescript
const lerpFactor = 0.1  // 10% interpolation per frame (~smooth)
```

### **Device Breakpoint**
```typescript
const mobileBreakpoint = 768  // pixels
```

## Troubleshooting

### **Common Issues**

1. **Rotation not working on desktop**
   - Check device detection: `useMediaQuery({ maxWidth: 768 })`
   - Verify pointer tracking: `pointerRef.current` values
   - Ensure group ref exists: `groupRef.current`

2. **Camera focus positioning incorrect**
   - Verify rotation reset: `groupRotationRef.current = 0`
   - Check disable callback: `pointerDisableCallback` called
   - Confirm timing: disable happens before animation

3. **Pointer not re-enabling after focus**
   - Check camera state: `isCameraFocused = false`
   - Verify re-enable logic: `isPointerDisabled.current = false`
   - Test ESC key functionality

### **Debug Tools**

```typescript
// Add to useFrame for debugging
console.log({
  pointerX: pointerRef.current.x,
  targetRotation: targetRotation,
  currentRotation: groupRotationRef.current,
  isDisabled: isPointerDisabled.current
})
```

## Future Enhancements

### **Potential Improvements**
- **Vertical rotation**: Add Y-axis rotation based on mouse Y
- **Inertia**: Add momentum-based rotation continuation
- **Gestures**: Touch gesture support for mobile rotation
- **Boundaries**: Visual indicators for rotation limits
- **Customization**: User-configurable rotation speed/range

### **Performance Optimizations**
- **Frame rate limiting**: Reduce update frequency on slow devices
- **Distance-based LOD**: Reduce quality at extreme rotations
- **Predictive loading**: Pre-load assets for common rotation angles

---

## Dependencies

- **React Three Fiber**: 3D rendering and animation loops
- **Three.js**: Core 3D mathematics and transformations
- **react-responsive**: Device detection and media queries
- **Zustand**: State management for camera focus integration

## Related Documentation

- [Camera Focus System](./Camera-Focus-System.md)
- [Interactive Hover Tooltips Feature](./Interactive-Hover-Tooltips-Feature.md)
- [Keyboard Debouncing System](./Keyboard-Debouncing-System.md) 