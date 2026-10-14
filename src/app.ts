import { Application } from '@nativescript/core';
import * as MasonKit from '@triniwiz/nativescript-masonkit';

// Start every MasonKit element from Tailwind's preflight baseline
// (border-box, no UA margins/padding). Must run before any view is created.
MasonKit.View.preflight = true;

// Lets XML pages use MasonKit's elements through
// `xmlns:m="@triniwiz/nativescript-masonkit"` (<m:View>, <m:Text>, <m:Scroll>).
globalThis.registerModule('@triniwiz/nativescript-masonkit', () => MasonKit);

Application.run({ moduleName: 'app-root' });
