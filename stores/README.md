# Zustand State Management

## Current Stores

### `useHoverStore.ts` - Hover State Management
Manages hover interactions for 3D objects:
- `hoveredMesh`: Currently hovered mesh name
- `setHoveredMesh()`: Update hovered mesh
- `createHoverHandlers()`: Generate event handlers

## Usage Patterns

### Basic Store Access
```typescript
import { useHoverStore } from '@/stores/useHoverStore'

function Component() {
  const hoveredMesh = useHoverStore(state => state.hoveredMesh)
  const setHoveredMesh = useHoverStore(state => state.setHoveredMesh)
}
```

### Combined with Custom Hooks
```typescript
import { useHoverZustand } from '@/hooks/use-hover-zustand'

function Component() {
  const { hoveredMesh, createHoverHandlers, hoverMessage } = useHoverZustand()
}
```

### Performance Optimization
```typescript
// Only re-render when hoveredMesh changes
const hoveredMesh = useHoverStore(state => state.hoveredMesh)

// Multiple subscriptions with shallow comparison
const { hoveredMesh, setHoveredMesh } = useHoverStore(
  state => ({ hoveredMesh: state.hoveredMesh, setHoveredMesh: state.setHoveredMesh }),
  shallow
)
```

## Future Store Ideas

### UI State Store
```typescript
interface UIStore {
  isLoading: boolean
  showUI: boolean
  activeModal: string | null
}
```

### Camera Store  
```typescript
interface CameraStore {
  position: [number, number, number]
  target: [number, number, number]
  preset: string
}
```

### Theme Store
```typescript
interface ThemeStore {
  theme: 'light' | 'dark' | 'cozy'
  colors: ThemeColors
  animations: boolean
}
```

## Zustand DevTools

Add to any store for debugging:
```typescript
import { devtools } from 'zustand/middleware'

export const useStore = create<Store>()(
  devtools(
    (set) => ({
      // store implementation
    }),
    { name: 'store-name' }
  )
)
``` 