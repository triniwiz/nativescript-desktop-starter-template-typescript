import { Page } from '@nativescript/core';
import { Button, Text, View } from '@triniwiz/nativescript-masonkit';

/**
 * Tiny helpers for building MasonKit views from data, the code equivalent of
 * `<m:View class="...">`, `<m:Text class="..." textContent="..." />` and
 * `<m:Button class="..." textContent="..." tap="..." />`.
 * Class names must appear in full so Tailwind can find them.
 */

export type Node = View | Text | Button;

export function view(className: string, ...children: Node[]): View {
  const result = new View();
  result.className = className;
  for (const child of children) {
    result.addChild(child);
  }
  return result;
}

export function text(className: string, textContent: string | number): Text {
  const result = new Text();
  result.className = className;
  result.textContent = String(textContent);
  return result;
}

export function button(className: string, textContent: string, onTap: () => void): Button {
  const result = new Button();
  result.className = className;
  result.textContent = textContent;
  result.on('tap', onTap);
  return result;
}

/** Replaces every child of `parent` with `children`. */
export function render(parent: View, children: Node[]) {
  parent.removeChildren();
  for (const child of children) {
    parent.addChild(child);
  }
}

/** Finds the `<m:View id="...">` with the given id on `page`. */
export function viewById(page: Page, id: string): View {
  // MasonKit's typings declare their own `Style`, so its views don't type
  // check as core views, even though they are core views at runtime.
  return page.getViewById(id) as unknown as View;
}
