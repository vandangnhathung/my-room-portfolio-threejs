Camera Focus System Documentation
Overview
The Camera Focus System allows users to smoothly transition between different camera positions in a 3D scene while maintaining proper OrbitControls constraints. This system was designed to solve the conflict between OrbitControls limitations and programmatic camera movements.
Problem Statement
The original implementation faced a critical issue: OrbitControls constraints were preventing the camera from reaching desired focus positions. When trying to focus on specific objects (like screens), the camera couldn't move to the target position because it violated the established distance, angle, and rotation limits set in OrbitControls.
Additionally, there was a flashback issue when exiting focus mode - the camera would briefly snap to an incorrect position before smoothly animating to the final position.
Solution Architecture
Core Components

Constraint Management System

Temporarily stores original OrbitControls constraints
Removes constraints during camera animations
Restores constraints after animations complete


Focus State Management

Tracks whether camera is in focused mode
Disables OrbitControls rotation during focus
Manages ESC key functionality for exiting focus


Animation Sequencing

Uses GSAP for smooth camera transitions
Coordinates constraint removal/restoration timing
Prevents constraint conflicts during animations



Implementation Details
Helper Functions
typescript// Stores original constraints before removing them
const storeOriginalConstraints = (orbitControlsRef, originalConstraintsRef)

// Temporarily removes all OrbitControls constraints
const removeConstraints = (orbitControlsRef)

// Restores the original constraints after animation
const restoreConstraints = (orbitControlsRef, originalConstraintsRef)
Key Features
1. Constraint Storage and Restoration

Storage: Original constraints are captured once when first focus function is called
Removal: All constraints are set to their maximum/minimum values during animation
Restoration: Original values are restored only after animation completion

2. Animation Timing

Focus Animation: 1 second duration with "power3.inOut" easing
Reset Animation: 1.4 second duration for smoother return to initial position
Constraint Timing: Constraints are restored in GSAP's onComplete callback

3. State Management

isCameraFocused: Boolean state tracking focus mode
originalConstraintsRef: Ref storing original constraint values
orbitControlsRef: Ref to OrbitControls instance

Usage
Basic Focus Functions
typescriptconst { isCameraFocused, focusOnScreen, focusOnScreen001, focusOnCertificate, resetCamera } = useCameraFocus(orbitControlsRef, isMobile)
Focus Positions Configuration
typescriptexport const cameraFocusPositions = {
  initial: {
    desktop: [x, y, z],
    mobile: [x, y, z]
  },
  initialTarget: {
    desktop: [x, y, z], 
    mobile: [x, y, z]
  },
  screenFocused: {
    camera: { desktop: [x, y, z], mobile: [x, y, z] },
    target: { desktop: [x, y, z], mobile: [x, y, z] }
  },
  screen001Focused: {
    camera: { desktop: [x, y, z], mobile: [x, y, z] },
    target: { desktop: [x, y, z], mobile: [x, y, z] }
  }
}
OrbitControls Integration
typescript<OrbitControls 
  ref={orbitControlsRef}
  target={roomConfig.cameraConfig.target}
  minDistance={roomConfig.cameraConfig.minDistance}
  maxDistance={roomConfig.cameraConfig.maxDistance}
  minPolarAngle={roomConfig.cameraConfig.minPolarAngle}
  maxPolarAngle={roomConfig.cameraConfig.maxPolarAngle}
  minAzimuthAngle={roomConfig.cameraConfig.minAzimuthAngle}
  maxAzimuthAngle={roomConfig.cameraConfig.maxAzimuthAngle}
  enablePan={false}
  enableRotate={!isCameraFocused}  // Disable rotation during focus
/>
Problem Resolution
Issue 1: Constraint Violations
Problem: Camera couldn't reach focus positions due to OrbitControls constraints
Solution: Temporarily remove constraints during animations, restore after completion
Issue 2: Flashback Effect
Problem: Camera snapped to incorrect position when exiting focus mode
Solution: Delay constraint restoration until after GSAP animation completes
typescript// ❌ Before (caused flashbacks)
setIsCameraFocused(false)
restoreConstraints() // Immediate restoration caused snap
startGSAPAnimation()

// ✅ After (smooth transition)  
setIsCameraFocused(false)
startGSAPAnimation({
  onComplete: () => {
    restoreConstraints() // Restore only after animation
  }
})
Key Benefits

Maintains OrbitControls Integrity: Original constraints are preserved and restored
Smooth Animations: No constraint conflicts during camera movements
Responsive Design: Different positions for desktop and mobile
Memory Efficient: Constraints are stored temporarily and cleared after use
User Experience: ESC key provides intuitive exit functionality

Technical Considerations
Performance

Constraint storage happens only once per focus session
GSAP handles animation optimization automatically
Ref-based storage prevents unnecessary re-renders

Browser Compatibility

Uses standard React hooks and Three.js APIs
GSAP provides cross-browser animation consistency
No browser-specific implementations required

Mobile Responsiveness

Separate camera positions for mobile and desktop
useMediaQuery hook determines device type
Optimized viewing angles for smaller screens

Future Enhancements

Dynamic Constraint Calculation: Automatically calculate optimal constraints based on scene bounds
Animation Presets: Configurable easing and duration options
Multi-Target Focus: Support for focusing on multiple objects simultaneously
Accessibility: Keyboard navigation and reduced motion support

Troubleshooting
Common Issues

Camera doesn't move: Check if orbitControlsRef.current exists
Constraints not restored: Verify GSAP animation completes successfully
Wrong positions: Ensure cameraFocusPositions values are correct
Mobile issues: Confirm isMobile detection is working

Debug Tips
typescript// Add logging to track constraint changes
console.log('Original constraints:', originalConstraintsRef.current)
console.log('Current camera position:', camera.position)
console.log('OrbitControls target:', orbitControlsRef.current?.target)
Conclusion
This Camera Focus System successfully resolves the conflict between OrbitControls constraints and programmatic camera movements, providing a smooth and intuitive user experience while maintaining the integrity of the 3D scene navigation system.