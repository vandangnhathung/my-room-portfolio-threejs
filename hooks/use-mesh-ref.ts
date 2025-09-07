import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useRegisterMesh } from '@/stores/useMeshesAnimationStore'

export const useMeshRef = (meshName: string) => {
  const meshRef = useRef<THREE.Mesh | null>(null)
  const registerMesh = useRegisterMesh()

  useEffect(() => {
    if (meshName) {
      registerMesh(meshName, meshRef)
    }
  }, [meshName, registerMesh])

  return meshRef
}
