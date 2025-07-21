# Performance Optimizations for Hover System

## Problem Statement
The hover system was causing performance issues where mouse movement over interactive meshes caused ALL components to re-render continuously, including FireFlies with random positions.

## Root Cause
- `onPointerMove` events were updating the entire Zustand store on every mouse movement
- All components subscribing to the store were re-rendering unnecessarily
- FireFlies component was re-calculating random positions on every hover

## Solutions Implemented

### 1. Throttled Position Updates
```typescript
// Before: Every mouse move triggered store update
onPointerMove: (event) => updatePosition(event.clientX, event.clientY)

// After: Throttled to ~60fps max
const throttledUpdatePosition = (set, get, x, y) => {
  if (throttleTimeout) return // Skip if already scheduled
  throttleTimeout = setTimeout(() => {
    // Update only if visible
  }, 16) // 16ms = ~60fps
}
```

### 2. Selective Store Subscriptions
```typescript
// Before: Components subscribed to entire store
const store = useHoverStore()

// After: Components subscribe only to needed data
export const useHoveredMesh = () => useHoverStore(state => state.hoveredMesh)
export const useMessageState = () => useHoverStore(state => state.messageState)
export const useHoverHandlers = () => useHoverStore(state => state.createHoverHandlers)
```

### 3. Component-Specific Optimization

#### RenderInteractiveMeshes
- Only subscribes to `hoveredMesh` and `createHoverHandlers`
- Doesn't re-render on message position changes

#### Page Component
- Only subscribes to `messageState`
- Doesn't re-render on hover state changes

#### RenderAnimatedMeshes
- Wrapped in `React.memo()` to prevent parent re-renders
- No store subscriptions at all
- FireFlies positions remain stable

### 4. State Separation
```typescript
interface HoverStore {
  // Hover state (rarely changes)
  hoveredMesh: string | null
  
  // Message state (changes frequently during mouse move)
  messageState: MessageState
}
```

## Performance Benefits

### Before Optimization
- ❌ 60+ re-renders per second during mouse movement
- ❌ FireFlies positions constantly changing
- ❌ All components re-rendering on every mouse move
- ❌ Janky user experience

### After Optimization
- ✅ ~60fps max updates (throttled)
- ✅ FireFlies stable with React.memo
- ✅ Components only re-render when needed
- ✅ Smooth, responsive hover experience

## Usage Guidelines

### For Components That Need Hover State Only
```typescript
import { useHoveredMesh, useHoverHandlers } from '@/stores/useHoverStore'

function MyComponent() {
  const hoveredMesh = useHoveredMesh()
  const createHoverHandlers = useHoverHandlers()
  // Will NOT re-render on message position changes
}
```

### For Components That Need Message State Only
```typescript
import { useMessageState } from '@/stores/useHoverStore'

function MyComponent() {
  const messageState = useMessageState()
  // Will NOT re-render on hover state changes
}
```

### For Components That Don't Need Hover State
```typescript
// Wrap in React.memo to prevent parent re-renders
export default React.memo(MyComponent)
```

## Monitoring Performance
- Check console logs for "RenderAnimatedMeshes" - should only appear once
- FireFlies should maintain stable positions during hover
- Hover messages should be smooth without lag 