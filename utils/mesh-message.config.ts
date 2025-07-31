export interface MeshInfo {
    name: string
    displayName: string
    description: string
    category: string
    interactionHint?: string
  }

export const meshInfoDatabase: Record<string, MeshInfo> = {

    'Executive_office_chair_raycaster001': {
      name: 'Executive_office_chair_raycaster001',
      displayName: 'Executive Office Chair',
      description: 'A comfortable executive office chair with ergonomic design',
      category: 'Furniture',
      interactionHint: 'Click to interact'
    },
    'Executive_office_chair_raycaster': {
      name: 'Executive_office_chair_raycaster',
      displayName: 'Rotating Executive Chair',
      description: 'A premium executive chair that gently rotates back and forth',
      category: 'Furniture',
      interactionHint: 'Watch it rotate automatically'
    },
    'camera_raycaster': {
      name: 'camera_raycaster',
      displayName: 'Professional Camera',
      description: 'A high-quality camera for capturing moments',
      category: 'Electronics',
      interactionHint: 'Click to take a photo'
    },
    'guitar_raycaster': {
      name: 'guitar_raycaster',
      displayName: 'Acoustic Guitar',
      description: 'A beautiful acoustic guitar for making music',
      category: 'Musical Instrument',
      interactionHint: 'Click to play a chord'
    },
    'screen001_raycaster': {
      name: 'screen001_raycaster',
      displayName: 'Secondary Monitor',
      description: 'An additional monitor for enhanced productivity',
      category: 'Electronics',
      interactionHint: 'Click to switch display'
    },
    'player_button_raycaster': {
      name: 'player_button_raycaster',
      displayName: 'Music Player Button',
      description: 'Control button for the music player system',
      category: 'Electronics',
      interactionHint: 'Click to play/pause music'
    },
    'headphone_raycaster': {
      name: 'headphone_raycaster',
      displayName: 'Premium Headphones',
      description: 'High-quality headphones for immersive audio experience',
      category: 'Electronics',
      interactionHint: 'Click to put on/off'
    },
    'cup_coaster_raycaster': {
      name: 'cup_coaster_raycaster',
      displayName: 'Coffee Cup & Coaster',
      description: 'A warm cup of coffee on a wooden coaster',
      category: 'Accessories',
      interactionHint: 'Click to take a sip'
    },
    'lamp_raycaster': {
      name: 'lamp_raycaster',
      displayName: 'Desk Lamp',
      description: 'An adjustable desk lamp for focused lighting',
      category: 'Lighting',
      interactionHint: 'Click to toggle light'
    },
    'vinyl_record_player_raycaster': {
      name: 'vinyl_record_player_raycaster',
      displayName: 'Vinyl Record Player',
      description: 'A vintage vinyl record player for analog music',
      category: 'Musical Equipment',
      interactionHint: 'Click to play vinyl'
    },
    'misc_things004_raycaster': {
      name: 'misc_things004_raycaster',
      displayName: 'Decorative Items',
      description: 'Various decorative items that add character to the space',
      category: 'Decoration',
      interactionHint: 'Click to examine'
    },
    'misc_things009_raycaster': {
      name: 'misc_things009_raycaster',
      displayName: 'Office Supplies',
      description: 'Essential office supplies for daily work',
      category: 'Office',
      interactionHint: 'Click to organize'
    },
   
  }