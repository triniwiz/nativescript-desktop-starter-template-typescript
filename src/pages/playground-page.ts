import { EventData, NavigatedData, Observable, Page } from '@nativescript/core';
import { View } from '@triniwiz/nativescript-masonkit';
import { render, text, view, viewById } from '../ui';

// Class names must appear in full so Tailwind can find them.
const justifyOptions = [
  { label: 'Start', value: 'justify-start' },
  { label: 'Center', value: 'justify-center' },
  { label: 'Between', value: 'justify-between' },
  { label: 'End', value: 'justify-end' },
];

const directionOptions = [
  { label: 'Row', value: 'flex-row' },
  { label: 'Column', value: 'flex-col' },
];

const tiles = [
  { title: 'Featured', span: 'col-span-2 row-span-2', color: 'bg-indigo-500' },
  { title: 'Inbox', span: '', color: 'bg-violet-500' },
  { title: 'Photos', span: '', color: 'bg-fuchsia-500' },
  { title: 'Analytics', span: 'col-span-2', color: 'bg-sky-500' },
  { title: 'Music', span: '', color: 'bg-emerald-500' },
  { title: 'Notes', span: 'row-span-2', color: 'bg-amber-500' },
  { title: 'Maps', span: '', color: 'bg-rose-500' },
  { title: 'Weather', span: 'col-span-2', color: 'bg-teal-500' },
];

const allTags = [
  'Flexbox',
  'Grid',
  'Gap',
  'Wrap',
  'Aspect ratio',
  'Min / max',
  'Auto margins',
  'Spans',
  'Dark mode',
  'View and Text',
  'Tailwind',
  'Taffy',
];

const palette = [
  { name: 'Slate', color: 'bg-slate-500' },
  { name: 'Red', color: 'bg-red-500' },
  { name: 'Orange', color: 'bg-orange-500' },
  { name: 'Amber', color: 'bg-amber-500' },
  { name: 'Lime', color: 'bg-lime-500' },
  { name: 'Emerald', color: 'bg-emerald-500' },
  { name: 'Teal', color: 'bg-teal-500' },
  { name: 'Sky', color: 'bg-sky-500' },
  { name: 'Indigo', color: 'bg-indigo-500' },
  { name: 'Violet', color: 'bg-violet-500' },
  { name: 'Fuchsia', color: 'bg-fuchsia-500' },
  { name: 'Rose', color: 'bg-rose-500' },
];

function segmentClass(active: boolean) {
  return active
    ? 'bg-indigo-500 text-white'
    : 'bg-slate-100 text-slate-700 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-300';
}

class PlaygroundViewModel extends Observable {
  justify = justifyOptions[2].value;
  direction = directionOptions[0].value;
  tagCount = 6;

  get demoClass() {
    return `flex h-56 gap-3 rounded-2xl bg-slate-100 p-3 dark:bg-slate-800 ${this.direction} ${this.justify}`;
  }

  get demoCode() {
    return `class="flex ${this.direction} ${this.justify} gap-3"`;
  }

  get tagSummary() {
    return `${this.tagCount} of ${allTags.length} chips`;
  }

  update(changes: Partial<Pick<PlaygroundViewModel, 'justify' | 'direction' | 'tagCount'>>) {
    Object.assign(this, changes);
    for (const name of ['demoClass', 'demoCode', 'tagSummary']) {
      this.notifyPropertyChange(name, this[name as keyof this]);
    }
  }
}

let model: PlaygroundViewModel;
let page: Page;

export function onNavigatingTo(args: NavigatedData) {
  if (args.isBackNavigation) {
    return;
  }
  page = args.object as Page;
  model = new PlaygroundViewModel();
  page.bindingContext = model;

  render(
    viewById(page, 'tiles'),
    tiles.map((tile) =>
      view(
        `flex flex-col justify-end rounded-2xl p-4 ${tile.span} ${tile.color}`,
        text('text-base font-semibold text-white', tile.title),
      ),
    ),
  );

  render(
    viewById(page, 'palette'),
    palette.map((swatch) =>
      view(
        'flex flex-col gap-2',
        view(`aspect-square w-full rounded-2xl ${swatch.color}`),
        text('text-xs font-medium text-slate-600 dark:text-slate-400', swatch.name),
      ),
    ),
  );

  renderOptions();
  renderTags();
}

function renderOptions() {
  const option = (label: string, active: boolean, onTap: () => void) => {
    const button = text(`rounded-xl px-4 py-2 text-sm font-semibold ${segmentClass(active)}`, label);
    button.on('tap', onTap);
    return button;
  };

  render(viewById(page, 'options'), [
    ...justifyOptions.map(({ label, value }) =>
      option(label, model.justify === value, () => {
        model.update({ justify: value });
        renderOptions();
      }),
    ),
    ...directionOptions.map(({ label, value }) =>
      option(label, model.direction === value, () => {
        model.update({ direction: value });
        renderOptions();
      }),
    ),
  ]);
}

function renderTags() {
  render(
    viewById(page, 'tags'),
    allTags
      .slice(0, model.tagCount)
      .map((tag) =>
        text(
          'rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200',
          tag,
        ),
      ),
  );
}

export function goBack(args: EventData) {
  (args.object as View).page.frame.goBack();
}

export function removeTag() {
  model.update({ tagCount: Math.max(0, model.tagCount - 1) });
  renderTags();
}

export function addTag() {
  model.update({ tagCount: Math.min(allTags.length, model.tagCount + 1) });
  renderTags();
}
