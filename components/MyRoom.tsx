'use client'

import React, { useRef, useCallback, useMemo, Suspense } from 'react'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import { useCameraStore } from '../stores/useCameraStore'
import { useRoomData } from '../hooks/use-room-data'
import { useWoodMeshPopup } from '../hooks/use-wood-mesh-popup'
import { useWoodAnimationStore } from '../stores/useMeshesAnimationStore'
import * as THREE from 'three'
import { RenderStaticMeshes } from "./RenderMesh/RenderStaticMeshes"
import { RenderInteractiveMeshes } from "./RenderMesh/RenderInteractiveMeshes"
import PointCursor from "./PointCursor/PointCursor"
import AnimatedRectAreaLights from './AnimatedRectAreaLights'
import { OptimizedIframeScreen } from './OptimizedIframeScreen'

// Error boundary for render components
const RenderComponentsComponent = ({
  focusOnScreen, 
  onMeshRef,
  disablePointerRef
}: {
  focusOnScreen: () => void, 
  onMeshRef: (name: string, ref: React.RefObject<THREE.Mesh | null>) => void,
  disablePointerRef?: React.RefObject<(() => void) | null>
}) => {
  try {
    return (
      <>
        <RenderInteractiveMeshes onMeshRef={onMeshRef} />
        <RenderStaticMeshes />
        <PointCursor 
          handleClick={() => {
            // Disable pointer immediately when clicked
            if (disablePointerRef?.current) {
              disablePointerRef.current()
            }
            focusOnScreen()
          }} 
        />
        {/* <RenderAnimatedMeshes /> */}
      </>
    )
  } catch (error) {
    console.error("Error rendering mesh components:", error)
  }
}

// Memoize RenderComponents to prevent unnecessary re-renders
const RenderComponents = React.memo(RenderComponentsComponent, (prevProps, nextProps) => {
  return (
    prevProps.focusOnScreen === nextProps.focusOnScreen &&
    prevProps.onMeshRef === nextProps.onMeshRef &&
    prevProps.disablePointerRef === nextProps.disablePointerRef
  )
})

interface MyRoomProps {
  orbitControlsRef: React.RefObject<{ 
    target: { x: number; y: number; z: number },
    enabled: boolean,
    minDistance: number,
    maxDistance: number,
    minPolarAngle: number,
    maxPolarAngle: number,
    minAzimuthAngle: number,
    maxAzimuthAngle: number
  } | null>
  disablePointerRef?: React.RefObject<(() => void) | null>
}

function MyRoomComponent({ orbitControlsRef, disablePointerRef }: MyRoomProps) {
  
  const meshRefs = useRef<Map<string, React.RefObject<THREE.Mesh | null>>>(new Map())
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const { camera } = useThree()

  const { 
    isCameraFocused, 
    focusOnScreen
  } = useCameraStore()

  // Get wood mesh popup functionality
  const { openWoodMeshPopup } = useWoodMeshPopup()

  const handleMeshRef = useCallback((name: string, ref: React.RefObject<THREE.Mesh | null>) => {
    meshRefs.current.set(name, ref)
  }, [])

  // Memoize isMobile to prevent re-renders when viewport changes
  const stableIsMobile = useRef(isMobile)
  stableIsMobile.current = isMobile

  // Memoize the focusOnScreen function to prevent re-renders
  const memoizedFocusOnScreen = useCallback(() => {
    focusOnScreen(orbitControlsRef, camera, stableIsMobile.current, meshRefs)
  }, [focusOnScreen, orbitControlsRef, camera])

  // Pass the ref and camera focus functions
  useRoomData(
    orbitControlsRef, 
    memoizedFocusOnScreen,
    openWoodMeshPopup
  )

  // Set the main group ref in the store when it becomes available
  const setMainGroupRef = React.useCallback((node: THREE.Group | null) => {
    if (node) {
      console.log('MyRoom: Setting main group ref in store:', node)
      useWoodAnimationStore.getState().setMainGroupRef({ current: node })
    }
  }, [])

  // Memoize the AxesHelper to prevent recreation on every render
  // const axesHelper = useMemo(() => new THREE.AxesHelper(20), [])

  return (
    <Suspense >
      <group dispose={null} ref={setMainGroupRef} position={[0, 0, 0]}>
        <group name="Scene">
          <RenderComponents 
            focusOnScreen={memoizedFocusOnScreen}
            onMeshRef={handleMeshRef}
            disablePointerRef={disablePointerRef}
          />
          {/* Optimized iframe with immediate loading */}
          {/* <OptimizedIframeScreen 
            src="https://vandangnhathung.github.io/lofi-ver-2/"
            position={[5.287, 6.719, -0.05]}
            rotation={[192 * (Math.PI / 180), 73 * (Math.PI / 180), -11.5 * (Math.PI / 180)]}
            isCameraFocused={isCameraFocused}
          /> */}
        </group>
        
        {/* Animated RectAreaLights with ordered animation */}
        <AnimatedRectAreaLights/>
   {/* Axes Helper at iframe position */}
        {/* <group position={[5.267, 6.165, -0.079]}
          rotation={[192 * (Math.PI / 180), 75 * (Math.PI / 180), -12 * (Math.PI / 180)]}
        >
          <primitive object={new AxesHelper(2)} />
        </group> */}


        {/* <group position={[0, 3, 0]}
        >
          <primitive object={new AxesHelper(2)} scale={10}/>
        </group> */}
      </group>
    </Suspense>
  )
}

// Memoize MyRoom component to prevent unnecessary re-renders
export const MyRoom = React.memo(MyRoomComponent, (prevProps, nextProps) => {
  return (
    prevProps.orbitControlsRef === nextProps.orbitControlsRef &&
    prevProps.disablePointerRef === nextProps.disablePointerRef
  )
})

useGLTF.preload('/models/Room_Portfolio.glb')