import { MeshConfig } from "@/types/type";

export const meshConfig: MeshConfig[] = [
    // Static meshes
    { name: 'floor', position: [0.48, 1.669, -7.652], rotation: [0, Math.PI / 2, 0], scale: 1, isInteractive: false },
    { name: 'misc_things', position: [1.125, 12.001, -1.266], scale: 1, isInteractive: false },
    { name: 'keyboard', position: [4.264, 4.514, 0.668], scale: 1, isInteractive: false, material: 'devices_on_table' },
    { name: 'mouse', position: [4.136, 4.485, 2.376], scale: 1, isInteractive: false, material: 'devices_on_table' },
    { name: 'paint001', position: [7.246, 6.069, -5.78], rotation: [0, 0, 0.138], scale: 1, isInteractive: false },
    { name: 'plant002', position: [1.125, 11.889, -1.266], scale: 1, isInteractive: false },
    { name: 'plant003', position: [1.125, 11.918, -1.266], scale: 1, isInteractive: false },
    { name: 'plant004', position: [1.125, 12.001, -1.266], scale: 1, isInteractive: false },
    { name: 'paint', position: [1.125, 12.001, -1.266], scale: 1, isInteractive: false },
    { name: 'workspace003', position: [1.977, 5.891, 5.089], scale: 1, isInteractive: false },
    { name: 'workspace004', position: [1.977, 5.891, 5.089], scale: 1, isInteractive: false },
    { name: 'workspace006', position: [1.977, 5.891, 5.089], scale: 1, isInteractive: false },
    { name: 'workspace007', position: [1.977, 5.891, 5.089], scale: 1, isInteractive: false },
    { name: 'plant001', position: [4.282, 9.393, 4.395], scale: 1, isInteractive: false },
    { name: 'Cube001', position: [-2.532, 3.727, 3.064], scale: 1, isInteractive: false },
    { name: 'plant', position: [-1.398, -10.285, 5.061], scale: 1, isInteractive: false },
    { name: 'Room', position: [-1.398, 3.066, 5.061], scale: 1, isInteractive: false },
    { name: 'screen', position: [5.367, 5.918, -0.059], scale: 1, isInteractive: false, material: 'screen_chair' },
    { name: 'screen001', position: [5.418, 5.88, 3.295], scale: 1, isInteractive: false, material: 'screen_chair' },

    // Interactive meshes
    { name: 'Executive_office_chair_raycaster001', position: [2.425, 1.673, 1.635], rotation: [-Math.PI, 1.516, -Math.PI], scale: 1, isInteractive: true, material: 'screen_chair' },
    { name: 'Executive_office_chair_raycaster', position: [2.661, 3.223, 1.622], rotation: [-Math.PI, 1.516, -Math.PI], scale: 1, isInteractive: true, material: 'screen_chair' },
    { name: 'camera_raycaster', position: [5.349, 4.492, 3.479], scale: 1, isInteractive: true, material: 'devices_on_table' },
    { name: 'guitar_raycaster', position: [2.996, 1.79, -2.331], rotation: [0, 0.875, 0], scale: 1, isInteractive: true, onClick: () => console.log('clicked') },
    { name: 'player_button_raycaster', position: [-1.965, 4.711, 2.343], scale: 1, isInteractive: true },
    { name: 'headphone_raycaster', position: [5.012, 4.499, 0.226], scale: 1, isInteractive: true, material: 'devices_on_table' },
    { name: 'cup_coaster_raycaster', position: [4.115, 4.528, -0.227], scale: 1, isInteractive: true, material: 'devices_on_table' },
    { name: 'lamp_raycaster', position: [-0.505, 4.486, 3.918], scale: 1, isInteractive: true },    { name: 'vinyl_record_player_raycaster', position: [-2.36, 4.571, 3.398], scale: 1, isInteractive: true },
    { name: 'misc_things004_raycaster', position: [6.875, 6.363, -4.456], scale: 1, isInteractive: true },
    { name: 'misc_things009_raycaster', position: [6.875, 6.363, -3.91], scale: 1, isInteractive: true },
    { name: 'inside_screen_popup', position: [5.367, 5.918, -0.059], scale: 1, isInteractive: true },
    { name: 'inside_screen001_popup', position: [5.418, 5.88, 3.295], scale: 1, isInteractive: true }
  ]