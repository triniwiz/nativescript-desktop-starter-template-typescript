import { defineConfig, mergeConfig } from 'vite';
import { typescriptConfig } from '@nativescript/vite/typescript';
import { protect, restore } from './postcss-masonkit.mjs';
import { masonkitSingleInstance } from './masonkit-hmr.mjs';
import { escapedSelectorCommas } from './postcss-selector-commas.mjs';

export default defineConfig(({ mode }) =>
  mergeConfig(typescriptConfig({ mode }), {
    plugins: [masonkitSingleInstance()],
    optimizeDeps: {
      // MasonKit must load as a single instance over the HMR server. If Vite
      // pre-bundles a subpath (e.g. `/web`), that copy is routed to the vendor
      // bundle, where MasonKit is deliberately absent, and its exports come
      // back undefined.
      exclude: [
        '@triniwiz/nativescript-masonkit',
        '@triniwiz/nativescript-masonkit/web',
        '@triniwiz/nativescript-masonkit/elements',
      ],
    },
    css: {
      postcss: {
        // Lets Tailwind layout utilities (flex, grid, gap, max-w, ...) reach
        // MasonKit views instead of being stripped for core layouts, and keeps
        // classes with commas in them, like `grid-cols-[repeat(...,...)]`.
        plugins: [protect(), restore(), escapedSelectorCommas()],
      },
    },
  }),
);
