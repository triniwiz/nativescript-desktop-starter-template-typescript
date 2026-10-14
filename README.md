# NativeScript Desktop Starter (TypeScript)

A NativeScript TypeScript starter that runs on Windows, iOS and Android. Pages
are XML with TypeScript code-behind. Layout uses
[MasonKit](https://github.com/triniwiz/nativescript-mason)'s `View`, `Text` and `Button`
(Flexbox and CSS Grid), and styling uses Tailwind CSS v4.

## Prerequisites

> NativeScript for Windows is in alpha. Expect rough edges.

To run on Windows you need the following. `npx ns doctor windows` checks them.

| Requirement | Notes |
| --- | --- |
| Windows 10 1809 (build 17763) or later | The app targets `net10.0-windows10.0.26100.0`, with a minimum of `10.0.17763.0`. |
| [Node.js](https://nodejs.org) LTS | Provides `npm` and `npx`. |
| [.NET 10 SDK](https://dotnet.microsoft.com/download) | The build runs `dotnet build`. Check it with `dotnet --version`. |
| Developer Mode | Settings → Privacy & security → For developers. Windows needs it to install and launch the unsigned debug build. |

For iOS and Android, follow the [NativeScript environment setup](https://docs.nativescript.org/setup/).

You don't need to install the NativeScript CLI globally. It's a dev dependency, and the npm scripts run it.

## Getting started

```bash
git clone https://github.com/triniwiz/nativescript-desktop-starter-template-typescript my-app
cd my-app
npm install
npm run windows   # or: npm run ios / npm run android
```

`npm run windows` builds the app, installs and launches it, then rebuilds and
restarts it as you save. `npm run clean` removes the build output, and
`npm run typecheck` checks the TypeScript.

Use npm. `package.json` relies on npm `overrides`.

## Project layout

| Path | What it's for |
| --- | --- |
| `src/app.ts` | App entry. Turns on `View.preflight` and registers MasonKit for XML. |
| `src/app-root.xml` | The root `Frame`. |
| `src/app.css` | Tailwind, plus the `dark:`, `ios:`, `android:`, `windows:`, `phone:` and `tablet:` variants. |
| `src/pages/home-page.xml` / `.ts` | The home screen and its code-behind. |
| `src/pages/playground-page.xml` / `.ts` | Flexbox and Grid examples. |
| `src/ui.ts` | `view()`, `text()` and `button()` helpers for building MasonKit views from data. |
| `postcss-masonkit.mjs` | Keeps the Tailwind layout utilities (`flex`, `grid`, `gap-*`, `max-w-*`, `absolute`, ...) that NativeScript's Tailwind plugin would otherwise remove. |

## Tips

- **Elements:** declare the MasonKit namespace on the page, then use
  `<m:View>` for boxes, `<m:Text>` for text and `<m:Button>` for buttons.
  `<m:View>` doesn't scroll; wrap content that should scroll in `<m:Scroll>`,
  as each page's root does:

  ```xml
  <Page xmlns:m="@triniwiz/nativescript-masonkit">
    <m:Scroll>
      <m:View class="flex flex-col gap-2 p-4">
        <m:Text class="text-2xl font-bold" textContent="{{ title }}" />
        <m:Button class="rounded-xl bg-indigo-500 px-4 py-2 text-white" textContent="Go" tap="onTap" />
      </m:View>
    </m:Scroll>
  </Page>
  ```

- **Building from data:** give a view an `id` in XML, then fill it from the
  code-behind with the helpers in `src/ui.ts`:

  ```ts
  render(viewById(page, 'list'), items.map((item) => text('text-base', item)));
  ```

- **Responsive layouts:** there are no `sm:` or `md:` breakpoints. Use layouts
  that fit the space they're given instead. They also reflow when the window
  is resized:

  ```xml
  <m:View class="grid grid-cols-[repeat(auto-fill,minmax(240,1fr))] gap-4">…</m:View>
  <m:View class="flex flex-row flex-wrap gap-4"><m:View class="flex-1 basis-40">…</m:View></m:View>
  <m:View class="mx-auto w-full max-w-5xl px-5">…</m:View>
  ```

- **Units:** unitless values are dp, and `px` means physical pixels, so write
  arbitrary values without a unit, for example `auto-rows-[96]`.
- **Avoid** `tracking-*`, `leading-*` and `bg-linear-*`. For gradients, write
  a `@utility` instead, like `bg-hero` in `src/app.css`.
- **Keep** `@import 'tailwindcss/theme'` and `@import 'tailwindcss/utilities'`
  in `src/app.css`, not `@import 'tailwindcss'`. Tailwind's preflight would
  hide every view.

## Troubleshooting

- **Something's missing from your setup:** `npx ns doctor windows` lists what it can't find and how to fix it.
- **The app builds but won't launch** ("deployment failed"): turn on Developer Mode.
- **A stale or broken build:** run `npm run clean`, then `npm run windows` again.

## Known issues

- HMR is off: the npm scripts pass `--no-hmr`, so a save rebuilds the bundle
  and restarts the app. With HMR on, `@nativescript/vite` bundles the pages'
  code-behind into the app entry, so MasonKit loads twice and the app fails to
  start ("Cannot redefine property").

## Temporary workarounds

These can be removed once the fixes are released:

- `@nativescript/core` and `@nativescript/vite` are installed through pkg.pr.new from
  [NativeScript/NativeScript#11468](https://github.com/NativeScript/NativeScript/pull/11468),
  which is the `feat/windows` branch plus percentage sizes inside MasonKit layouts.
- `@nativescript/windows` is pinned to an exact alpha, because a caret range
  would also match older, incompatible betas.
- `src/app.ts` registers MasonKit with `registerModule` so XML can resolve
  `xmlns:m="@triniwiz/nativescript-masonkit"`. Webpack did this from the XML;
  the Vite build doesn't yet.
- `viewById()` in `src/ui.ts` casts to MasonKit's `View`, because MasonKit's
  typings declare their own `Style` and its views don't type check as core
  views.
- `android-workarounds.mjs` names core's Android activity chunk without a
  hash. The generated Java activity loads it by the name it had at the last
  native build, so after a rebuild that renamed it, Android started the old
  chunk and crashed ("isEmbedded is not a function").
- `masonkit-hmr.mjs` stops MasonKit from loading twice during HMR. It only
  runs on the dev server, so it does nothing until HMR is back on.
- `postcss-selector-commas.mjs` makes classes with a comma, like
  `grid-cols-[repeat(auto-fill,minmax(240,1fr))]`, match
  ([NativeScript/NativeScript#11463](https://github.com/NativeScript/NativeScript/pull/11463)).
