// Centralized bear data - single source of truth
export interface Bear {
  id: string;           // Unique identifier (using original bear names for clarity)
  name: string;         // Display name for UI
  shortName: string;    // Short name for bracket display
  image: string;        // Path to bear image
}

// Single source of truth for all bear data
export const bears: Bear[] = [
  {
    id: '128Jr',
    name: '128 Grazer Jr',
    shortName: '128 Jr',
    image: '/bears/128grazer-1758560774361.png'
  },
  {
    id: '609',
    name: 'Bear 609',
    shortName: '609',
    image: '/bears/609-1758562237210.png'
  },
  {
    id: '26',
    name: 'Bear 26',
    shortName: '26',
    image: '/bears/26-1758557305581.png'
  },
  {
    id: '909',
    name: 'Bear 909',
    shortName: '909',
    image: '/bears/909-1758562402990.png'
  },
  {
    id: '503',
    name: 'Bear 503',
    shortName: '503',
    image: '/bears/503-1758560839893.png'
  },
  {
    id: '901',
    name: 'Bear 901',
    shortName: '901',
    image: '/bears/901-1758562371329.png'
  },
  {
    id: '99',
    name: 'Bear 99',
    shortName: '99',
    image: '/bears/99-1758560720167.png'
  },
  {
    id: '856',
    name: 'Bear 856',
    shortName: '856',
    image: '/bears/856-1758562333630.png'
  },
  {
    id: '602',
    name: 'Bear 602',
    shortName: '602',
    image: '/bears/602-1758562266438.png'
  },
  {
    id: '128',
    name: '128 Grazer',
    shortName: '128',
    image: '/bears/128grazer-1758560774361.png'
  },
  {
    id: '32',
    name: '32 Chunk',
    shortName: '32',
    image: '/bears/32chunk-1758560671158.png'
  },
  {
    id: '910',
    name: 'Bear 910',
    shortName: '910',
    image: '/bears/910-1758562455268.png'
  }
];

// Create lookup maps for easy access
export const bearById = new Map(bears.map(bear => [bear.id, bear]));

// Helper function to get bear by ID (with error handling)
export function getBear(id: string): Bear {
  const bear = bearById.get(id);
  if (!bear) {
    throw new Error(`Bear with id "${id}" not found`);
  }
  return bear;
}

// Helper function to safely get bear by ID (returns null if not found)
export function findBear(id: string): Bear | null {
  return bearById.get(id) || null;
}