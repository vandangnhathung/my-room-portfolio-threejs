// Types
export type GLTFResult = GLTF & {
    nodes: {
      floor: THREE.Mesh
      Executive_office_chair_raycaster001: THREE.Mesh
      Executive_office_chair_raycaster: THREE.Mesh
      camera_raycaster: THREE.Mesh
      guitar_raycaster: THREE.Mesh
      screen_raycaster: THREE.Mesh
      screen001_raycaster: THREE.Mesh
      player_button_raycaster: THREE.Mesh
      misc_things: THREE.Mesh
      keyboard: THREE.Mesh
      headphone_raycaster: THREE.Mesh
      mouse: THREE.Mesh
      cup_coaster_raycaster: THREE.Mesh
      lamp_raycaster: THREE.Mesh
      paint001: THREE.Mesh
      vinyl_record_player_raycaster: THREE.Mesh
      misc_things004_raycaster: THREE.Mesh
      plant002: THREE.Mesh
      plant003: THREE.Mesh
      plant004: THREE.Mesh
      paint: THREE.Mesh
      workspace003: THREE.Mesh
      workspace004: THREE.Mesh
      workspace006: THREE.Mesh
      workspace007: THREE.Mesh
      plant001: THREE.Mesh
      misc_things009_raycaster: THREE.Mesh
      Cube001: THREE.Mesh
      plant: THREE.Mesh
      Room: THREE.Mesh
    }
    materials: {
      [key: string]: THREE.MeshStandardMaterial
    }
  }
  
  export interface MeshConfig {
    name: string
    position: [number, number, number]
    rotation?: [number, number, number]
    scale: number | [number, number, number]
    isInteractive: boolean
    onClick?: () => void
  }
  
  export interface TextureConfig {
    path: string
    colorSpace: THREE.ColorSpace
    flipY: boolean
    generateMipmaps: boolean
  }