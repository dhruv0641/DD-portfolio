export interface BackgroundConfig {
  grid: {
    columns: number;        // column grids (e.g. 4)
    color: string;          // grid line color (e.g. rgba(255, 255, 255, 0.04))
    maxWidth: string;       // grid limit (e.g. "1600px")
  };
  glow: {
    radius: number;         // pointer light diameter (e.g. 500)
    color: string;          // radial color stops
    opacity: number;        // glow alpha opacity
  };
  noise: {
    opacity: number;        // film grain opacity (e.g. 0.015)
    frequency: string;      // noise base frequency (e.g. "0.85")
  };
  vignette: {
    strength: number;       // Vignette gradient alpha (e.g. 0.8)
  };
  ambient: {
    color: string;          // Background base gradient color or layer details
  };
}

export const defaultBackgroundConfig: BackgroundConfig = {
  grid: {
    columns: 4,
    color: 'rgba(255, 255, 255, 0.04)',
    maxWidth: '1600px',
  },
  glow: {
    radius: 500,
    color: 'rgba(0, 102, 255, 0.05)', // Electric Blue at 5% opacity matching reference
    opacity: 1,
  },
  noise: {
    opacity: 0.015,
    frequency: '0.85',
  },
  vignette: {
    strength: 0.8,
  },
  ambient: {
    color: '#090909',
  },
};
