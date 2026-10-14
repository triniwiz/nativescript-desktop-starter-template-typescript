import { Device, EventData, NavigatedData, Observable, Page, Screen } from '@nativescript/core';
import { View } from '@triniwiz/nativescript-masonkit';
import { render, text, view, viewById } from '../ui';

const platform = Device.os;
const screen = `${Math.round(Screen.mainScreen.widthDIPs)} × ${Math.round(
  Screen.mainScreen.heightDIPs,
)} dp`;

const stats = [
  { label: 'Running on', value: platform },
  { label: 'Layout engine', value: 'Taffy' },
  { label: 'Styling', value: 'Tailwind v4' },
];

const features = [
  {
    icon: '▦',
    title: 'CSS Grid',
    body: 'Tracks, spans and auto-fill columns that reflow as the window grows.',
    tint: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300',
  },
  {
    icon: '⇆',
    title: 'Flexbox',
    body: 'Direction, wrapping, gap and alignment behave exactly like the web.',
    tint: 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300',
  },
  {
    icon: '</>',
    title: 'View and Text',
    body: 'Two native building blocks, <m:View> and <m:Text>, make up this whole screen.',
    tint: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-300',
  },
  {
    icon: '#',
    title: 'Tailwind utilities',
    body: 'Layout, spacing, colour and dark mode straight from your class list.',
    tint: 'bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300',
  },
  {
    icon: '⚡',
    title: 'Rust core',
    body: 'Layout is computed natively by MasonKit, not in JavaScript.',
    tint: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300',
  },
  {
    icon: '◎',
    title: 'One codebase',
    body: 'The same pages run on iOS, Android and Windows.',
    tint: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
];

const steps = [
  { text: 'Edit this screen in', file: 'src/pages/home-page.xml' },
  { text: 'Add global styles and variants in', file: 'src/app.css' },
  { text: 'Register extra elements or plugins in', file: 'src/app.ts' },
];

class HomeViewModel extends Observable {
  private taps = 0;
  tapLabel = 'Tap me';
  footer = `${platform} · ${screen}`;

  countTap() {
    this.taps++;
    this.set('tapLabel', `Tapped ${this.taps}×`);
  }
}

export function onNavigatingTo(args: NavigatedData) {
  if (args.isBackNavigation) {
    return;
  }
  const page = args.object as Page;
  page.bindingContext = new HomeViewModel();

  render(
    viewById(page, 'stats'),
    stats.map((stat) =>
      view(
        'card flex flex-1 basis-40 flex-col gap-1',
        text('text-sm text-slate-500 dark:text-slate-400', stat.label),
        text('text-2xl font-bold text-slate-900 dark:text-white', stat.value),
      ),
    ),
  );

  render(
    viewById(page, 'features'),
    features.map((feature) =>
      view(
        'card flex flex-col gap-3',
        view(
          `flex size-12 items-center justify-center rounded-2xl ${feature.tint}`,
          text('text-lg font-bold', feature.icon),
        ),
        text('text-lg font-semibold text-slate-900 dark:text-white', feature.title),
        text('text-sm text-slate-600 dark:text-slate-400', feature.body),
      ),
    ),
  );

  render(
    viewById(page, 'steps'),
    steps.map((step, index) =>
      view(
        'flex flex-row items-center gap-3',
        view(
          'flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500',
          text('text-sm font-bold text-white', index + 1),
        ),
        view(
          'flex flex-1 flex-row flex-wrap items-center gap-2',
          text('text-base text-slate-700 dark:text-slate-300', step.text),
          text(
            'rounded-lg bg-slate-100 px-2 py-1 font-mono text-sm text-indigo-600 dark:bg-slate-800 dark:text-indigo-300',
            step.file,
          ),
        ),
      ),
    ),
  );
}

export function openPlayground(args: EventData) {
  (args.object as View).page.frame.navigate('pages/playground-page');
}

export function countTap(args: EventData) {
  ((args.object as View).bindingContext as HomeViewModel).countTap();
}
