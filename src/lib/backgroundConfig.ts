export interface BackgroundConfig {
  grid: {
    size: number;          // spacing in pixels (e.g. 100px)
    opacity: number;       // line opacity (e.g. 0.03 = 3%)
    color: string;         // line stroke color
  };
  glow: {
    radius: number;        // size in pixels (e.g. 600px)
    color: string;         // radial gradient color stops
    opacity: number;       // peak opacity (e.g. 0.12)
  };
  noise: {
    opacity: number;       // noise grain opacity (e.g. 0.02)
  };
  vignette: {
    strength: number;      // border shadowing strength (e.g. 0.8)
  };
  ambient: {
    blobs: Array<{
      color: string;       // blob color
      width: string;       // width CSS string (e.g. "60vw")
      height: string;      // height CSS string
      top: string;         // positioning Y offset
      left: string;        // positioning X offset
      opacity: number;     // opacity
    }>;
  };
}

export const defaultBackgroundConfig: BackgroundConfig = {
  grid: {
    size: 100,
    opacity: 0.025,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  glow: {
    radius: 650,
    color: 'rgba(42, 86, 222, 0.12)', // Subtle accent blue glow matching --accent
    opacity: 0.8,
  },
  noise: {
    opacity: 0.02,
  },
  vignette: {
    strength: 0.95,
  },
  ambient: {
    blobs: [
      {
        color: 'rgba(42, 86, 222, 0.04)', // Accent indigo
        width: '50vw',
        height: '50vw',
        top: '-10%',
        left: '20%',
        opacity: 0.6,
      },
      {
        color: 'rgba(124, 58, 237, 0.03)', // Purple blur depth
        width: '60vw',
        height: '60vw',
        top: '40%',
        left: '-10%',
        opacity: 0.5,
      },
      {
        color: 'rgba(42, 86, 222, 0.02)',
        width: '45vw',
        height: '45vw',
        top: '75%',
        left: '50%',
        opacity: 0.4,
      }
    ],
  },
};
