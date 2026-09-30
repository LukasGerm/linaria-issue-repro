# wyw-in-js + Vite 8: transform result built from the file on disk

Rolldown builds the module graph again for every output, so with two outputs `@wyw-in-js/vite` transforms every module twice, with the same `code`. On the second call wyw returns code built from the file on disk instead of from `code`. The TypeScript that Vite had already removed comes back, and the build fails with `PARSE_ERROR`. On 2.5.x this already happens on the first call, so one output fails too.

```sh
npm install
npm run build:one   # one output
npm run build:two   # two outputs
```

## The modules

Each file in `src/` exports a number and a Linaria `css` class that uses it:

```
page    → header, footer
header  → button, icon
footer  → button, icon
button  → spacing
icon    → spacing
```

`main.ts` re-exports all six. If it only re-exports `page`, the build passes.

## What goes wrong

`header.ts`:

```ts
import {css} from '@linaria/core';
import {buttonSize} from './button';
import {iconSize} from './icon';

export const headerSize: number = buttonSize + iconSize;

export const header = css`
  margin: ${headerSize}px;
`;
```

wyw's result on the first call (2.4.4, two outputs):

```js
import { buttonSize } from "./button";
import { iconSize } from "./icon";
export const headerSize = buttonSize + iconSize;
export const header = "h7fuw9u";
import "<root>/src/header.wyw-in-js.css";
```

On the second call, `: number` is back, and the quotes and spacing match the file on disk:

```js
import {buttonSize} from './button';
import {iconSize} from './icon';
export const headerSize: number = buttonSize + iconSize;
export const header = "h7fuw9u";
import "<root>/src/header.wyw-in-js.css";
```

Which files fail changes between runs, but it is always some of `header`, `footer`, `button` and `icon`.

## Results

20 runs each, same result every run:

| wyw | `build:one` | `build:two` |
|---|---|---|
| 2.1.6 | passes | fails |
| 2.4.4 | passes | fails |
| 2.5.1 (this `package.json`) | fails | fails |

To try another version, change `@wyw-in-js/vite`, `@linaria/core` and the overrides. The overrides keep `@linaria/core`'s `@wyw-in-js/processor-utils` on the same version as `@wyw-in-js/transform`:

- 2.4.4: `@wyw-in-js/vite` 2.4.4, `@linaria/core` 8.2.0, `@wyw-in-js/processor-utils` 2.4.1, `@wyw-in-js/shared` 2.4.0
- 2.1.6: `@wyw-in-js/vite` 2.1.6, `@linaria/core` 8.1.1, both overrides 2.1.0
