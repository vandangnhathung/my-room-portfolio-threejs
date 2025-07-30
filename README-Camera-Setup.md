# Camera Setup Guide for Three.js Beginners

This guide explains how to set up and configure camera position and OrbitControls target in your Three.js application.

## Table of Contents
- [Understanding Camera and OrbitControls](#understanding-camera-and-orbitcontrols)
- [Setting Initial Camera Position](#setting-initial-camera-position)
- [Configuring OrbitControls Target](#configuring-orbitcontrols-target)
- [How to Find Good Camera Values](#how-to-find-good-camera-values)
- [Example Implementation](#example-implementation)
- [Debugging Camera Position](#debugging-camera-position)
- [Common Issues and Solutions](#common-issues-and-solutions)

## Understanding Camera and OrbitControls

### Camera Position
- **What it is**: The 3D coordinates where your camera is located in the scene
- **Format**: `[x, y, z]` - three numbers representing position in 3D space
- **Example**: `[-17.5, 11.0, -22.8]` means camera is at x=-17.5, y=11.0, z=-22.8

### OrbitControls Target
- **What it is**: The point in 3D space that the camera is looking at
- **Format**: `[x, y, z]` - three numbers representing the target point
- **Example**: `[4.1, 7.6, 1.3]` means camera is looking at point x=4.1, y=7.6, z=1.3

### How They Work Together
```
Camera Position: [-17.5, 11.0, -22.8]
     ↓ (camera looks from here)
Target Point: [4.1, 7.6, 1.3]
     ↓ (camera looks toward here)
```

## Setting Initial Camera Position

### Method 1: Canvas Component (Recommended for React Three Fiber)

```jsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas
      camera={{
        fov: 45,           // Field of view (how wide the view is)
        near: 0.1,          // Closest distance camera can see
        far: 100,           // Farthest distance camera can see
        position: [-17.5, 11.0, -22.8]  // Your camera position here
      }}
    >
      {/* Your 3D scene content */}
    </Canvas>
  )
}
```

### Method 2: Programmatic Camera Setup

```jsx
import { useThree } from '@react-three/fiber'

function CameraSetup() {
  const { camera } = useThree()
  
  useEffect(() => {
    // Set camera position
    camera.position.set(-17.5, 11.0, -22.8)
    
    // Update camera matrix
    camera.updateMatrixWorld()
  }, [camera])

  return null
}
```

## Configuring OrbitControls Target

### Basic OrbitControls Setup

```jsx
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <>
      <OrbitControls
        target={[4.1, 7.6, 1.3]}  // Your target point here
        minDistance={4}             // Minimum zoom distance
        maxDistance={40}            // Maximum zoom distance
        enablePan={false}           // Disable panning
        enableRotate={true}         // Enable rotation
      />
      
      {/* Your 3D objects */}
    </>
  )
}
```

### Advanced OrbitControls Configuration

```jsx
<OrbitControls
  target={[4.1, 7.6, 1.3]}           // Target point
  minDistance={4}                      // Closest zoom
  maxDistance={40}                     // Farthest zoom
  minPolarAngle={0}                    // Minimum vertical angle
  maxPolarAngle={Math.PI / 2}         // Maximum vertical angle
  minAzimuthAngle={-Math.PI}          // Minimum horizontal angle
  maxAzimuthAngle={-Math.PI / 2}      // Maximum horizontal angle
  enablePan={false}                    // Disable panning
  enableRotate={true}                  // Enable rotation
  enableZoom={true}                    // Enable zooming
/>
```

## How to Find Good Camera Values

### Step 1: Use the Debugging Tools

1. **Enable Camera Logging** (already set up in your project):
   ```jsx
   // This logs camera position every 2 seconds
   const { logCurrentValues } = useCameraOrbitLogger(orbitControlsRef, {
     logInterval: 2000,
     enabled: true
   })
   ```

2. **Use Keyboard Shortcuts**:
   - `Ctrl + L`: Log both camera position and target
   - `Ctrl + C`: Log only camera position
   - `Ctrl + T`: Log only target

### Step 2: Manual Camera Positioning

1. **Start with approximate values**:
   ```jsx
   position: [0, 5, 10]  // Start here
   target: [0, 0, 0]     // Look at center
   ```

2. **Adjust gradually**:
   - Move camera back: increase Z value
   - Move camera up: increase Y value
   - Move camera right: increase X value

### Step 3: Fine-tune with OrbitControls

1. **Use mouse to position camera** where you want it
2. **Press Ctrl + L** to log current position
3. **Copy the logged values** to your configuration

## Example Implementation

### Complete Scene Setup

```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function MyScene() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [-17.5, 11.0, -22.8]  // Your camera position
      }}
    >
      {/* OrbitControls */}
      <OrbitControls
        target={[4.1, 7.6, 1.3]}       // Your target point
        minDistance={4}
        maxDistance={40}
        enablePan={false}
      />
      
      {/* Your 3D objects */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </Canvas>
  )
}
```

### Configuration File Approach

```jsx
// camera-config.js
export const cameraConfig = {
  position: [-17.5, 11.0, -22.8],
  target: [4.1, 7.6, 1.3],
  fov: 45,
  near: 0.1,
  far: 100,
  minDistance: 4,
  maxDistance: 40
}

// In your component
import { cameraConfig } from './camera-config'

<Canvas camera={cameraConfig}>
  <OrbitControls target={cameraConfig.target} />
</Canvas>
```

## Debugging Camera Position

### 1. Visual Debugging

```jsx
import { AxesHelper } from '@react-three/drei'

// Add this to see coordinate axes
<AxesHelper args={[5]} />
```

### 2. Console Logging

```jsx
import { useThree } from '@react-three/fiber'

function CameraDebugger() {
  const { camera } = useThree()
  
  useEffect(() => {
    console.log('Camera Position:', camera.position)
    console.log('Camera Rotation:', camera.rotation)
  }, [camera])
  
  return null
}
```

### 3. Real-time Monitoring

```jsx
// Use the existing logging hook
const { logCurrentValues } = useCameraOrbitLogger(orbitControlsRef, {
  logInterval: 1000,  // Log every second
  enabled: true
})
```

## Common Issues and Solutions

### Issue 1: Camera is too close/far
**Solution**: Adjust the `position` values
```jsx
// Too close? Increase Z value
position: [0, 5, 20]  // Move camera back

// Too far? Decrease Z value  
position: [0, 5, 5]   // Move camera closer
```

### Issue 2: Camera is looking at wrong place
**Solution**: Adjust the `target` values
```jsx
// Looking too high? Decrease Y value
target: [0, 0, 0]    // Look at ground level

// Looking too low? Increase Y value
target: [0, 5, 0]    // Look higher up
```

### Issue 3: Camera movement is restricted
**Solution**: Check OrbitControls constraints
```jsx
<OrbitControls
  minDistance={1}     // Allow closer zoom
  maxDistance={100}   // Allow farther zoom
  minPolarAngle={0}   // Allow full vertical rotation
  maxPolarAngle={Math.PI}  // Allow full vertical rotation
/>
```

### Issue 4: Camera position resets on re-render
**Solution**: Use `useEffect` to set position once
```jsx
useEffect(() => {
  camera.position.set(-17.5, 11.0, -22.8)
  camera.updateMatrixWorld()
}, [camera])
```

## Tips for Beginners

1. **Start Simple**: Begin with `position: [0, 5, 10]` and `target: [0, 0, 0]`
2. **Use the Debug Tools**: Enable logging to see what values work
3. **Test Incrementally**: Change one value at a time
4. **Consider Your Scene**: Position camera to show your main objects
5. **Think in 3D**: X=left/right, Y=up/down, Z=forward/backward

## Quick Reference

### Camera Position Values
- **X**: Negative = left, Positive = right
- **Y**: Negative = down, Positive = up  
- **Z**: Negative = forward, Positive = backward

### Target Values
- **X**: Where to look horizontally
- **Y**: Where to look vertically
- **Z**: Where to look in depth

### Common Starting Values
```jsx
// Front view
position: [0, 0, 10]
target: [0, 0, 0]

// Top-down view
position: [0, 10, 0]
target: [0, 0, 0]

// Angled view
position: [5, 5, 5]
target: [0, 0, 0]
```

This setup will give you full control over your camera positioning in Three.js! 