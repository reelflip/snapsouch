
import { ArtStyle } from './types';

export const artStyles: ArtStyle[] = [
  {
    id: 'sketch',
    name: 'Pencil Sketch',
    prompt: 'Convert this image into a highly detailed, realistic black and white pencil sketch. Focus on shading, texture, and crisp lines.',
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    prompt: 'Transform this photo into a vibrant, colorful cartoon style. Use bold outlines, simplified shapes, and bright, flat colors like a modern animated movie.',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    prompt: 'Reimagine this image as a soft and expressive watercolor painting. Emphasize blended colors, soft edges, and the characteristic texture of watercolor on paper.',
  },
  {
    id: 'oil_painting',
    name: 'Oil Painting',
    prompt: 'Turn this picture into a classic oil painting. Create visible, textured brushstrokes and rich, deep colors with a focus on light and shadow, reminiscent of an old master.',
  },
  {
    id: 'pop_art',
    name: 'Pop Art',
    prompt: 'Convert this photo into a Pop Art style, inspired by Andy Warhol. Use bold, contrasting, and unnatural colors in a repeating pattern or with heavy screen-printing effects.',
  },
  {
    id: 'pixel_art',
    name: 'Pixel Art',
    prompt: 'Transform this image into 16-bit pixel art. Simplify the details into a grid of colored squares, creating a retro video game aesthetic.',
  },
];
