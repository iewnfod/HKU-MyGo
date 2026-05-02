# HKU-MyGo

HKU-MyGo is a small web app that helps people find a walking route inside the University of Hong Kong. You choose a start point, an end point, and a route style. The app then shows the steps, estimated time, and distance.

The app supports different route needs, such as fastest route, busy-hour route, accessible route, indoor-only route, and more popular paths.

## Languages Used

- TypeScript and TSX for the React app
- JavaScript for small helper scripts
- CSS with Tailwind CSS for styling
- JSON for map, path, and translation data
- Dockerfile for optional container deployment

## Execution Environment

Recommended local environment:

- Node.js 22 or newer
- pnpm
- A modern web browser

The Docker setup uses `node:22-alpine`.

## Setup

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Then open the local Vite URL shown in the terminal. It is usually:

```text
http://localhost:5173
```

## Build and Run

Compile TypeScript and build the production files:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

Run the linter:

```bash
pnpm lint
```

Check that all translation files contain the same keys:

```bash
pnpm locales:validate
```

Update locale files from the source language:

```bash
pnpm locales:update
```

## Docker

Build the Docker image:

```bash
docker build -t hku-mygo .
```

Run the container:

```bash
docker run --rm -p 4173:4173 hku-mygo
```

Then open:

```text
http://localhost:4173
```

## Main File Guide

| File or folder | Purpose |
| --- | --- |
| `README.md` | This guide. It explains what the project is and how to run it. |
| `package.json` | Defines project dependencies and runnable commands. |
| `pnpm-lock.yaml` | Locks dependency versions for repeatable installs. |
| `index.html` | The HTML entry file used by Vite. |
| `vite.config.ts` | Vite configuration for the React app and path aliases. |
| `tsconfig.json` | Shared TypeScript configuration entry point. |
| `tsconfig.app.json` | TypeScript settings for the browser app. |
| `tsconfig.node.json` | TypeScript settings for Node-based config files. |
| `eslint.config.js` | ESLint rules for code quality checks. |
| `Dockerfile` | Builds and runs the app inside a Node container. |
| `.github/workflows/docker.yaml` | GitHub Actions workflow that builds and pushes the Docker image. |
| `.dockerignore` | Files Docker should skip when building an image. |
| `.gitignore` | Files Git should ignore. |
| `.editorconfig` | Shared editor formatting defaults. |
| `data/nodes.json` | Places on the HKU map. Each node is a searchable point. |
| `data/paths.json` | Path segments between nodes, including time, distance, and route metadata. |
| `data/locales/en_us.json` | English UI text. |
| `data/locales/zh_cn.json` | Simplified Chinese UI text. |
| `data/locales/zh_hk.json` | Traditional Chinese UI text. |
| `public/favicon.svg` | Browser tab icon. |
| `public/icons.svg` | Public SVG icon asset. |
| `public/logo.svg` | HKU-MyGo logo shown in the app. |
| `src/main.tsx` | Starts the React app and mounts it into the page. |
| `src/App.tsx` | Main app screen. It loads data, runs route searches, and shows results. |
| `src/main.css` | Global styles and Tailwind CSS setup. |
| `src/types/map.ts` | Type definitions for map nodes and paths. |
| `src/hooks/useI18n.ts` | React hook that connects the app to the translation service. |
| `src/services/MapDataService.ts` | Stores the loaded map nodes and path segments. |
| `src/services/DataSanitizerService.ts` | Cleans and prepares raw map data before use. |
| `src/services/NavigatorService.ts` | Finds routes between two points using the selected route mode. |
| `src/services/NodeSearchingService.ts` | Searches map nodes for the start and end inputs. |
| `src/services/I18nService.ts` | Loads and reads translated UI text. |
| `src/components/FloatingSearchBar.tsx` | Search panel for choosing start point, end point, language, and route options. |
| `src/components/SearchInput.tsx` | Reusable search input for selecting a map node. |
| `src/components/ModeButton.tsx` | Lets the user choose the route mode. |
| `src/components/PeakHourCheckBox.tsx` | Lets the user mark the trip as busy-hour travel. |
| `src/components/I18nButton.tsx` | Lets the user switch language. |
| `src/components/ExtendButton.tsx` | Expands or changes the search panel layout. |
| `src/components/ActiveStepsDisplay.tsx` | Shows the current step while viewing route instructions. |
| `src/components/RouteStepList.tsx` | Shows the full route, including distance and estimated time. |
| `src/components/RouteErrorPanel.tsx` | Shows a friendly message when no route is found. |
| `src/tools/update-locales.js` | Helper script for updating translation files. |
| `src/validator/locales-validator.js` | Checks translation files for missing keys. |
| `src/assets/hero.png` | Image asset used by the app. |
| `src/assets/react.svg` | Default React asset kept with the project. |
| `src/assets/vite.svg` | Default Vite asset kept with the project. |

## How the Program Works

1. The app loads `data/nodes.json` and `data/paths.json`.
2. The data is cleaned by `DataSanitizerService`.
3. `MapDataService` stores the clean map data.
4. The user chooses a start point, an end point, and a route mode.
5. `NavigatorService` calculates the best available route.
6. The route steps, total distance, and estimated time are shown on the page.

## Testing

Refer to `HKU-MyGo Test Document.csv`

## How to Access HKU MTR Station / Add Extra Nodes and Paths

Acquire `additionalNodes.json` and `additionalPaths.json` from the folder `additionalData` or create your own `.json` files.

Use the `Extend` function to upload the two `.json` files.

## Trivia

Why "MyGo"?

A pun on the Japanese word "Maigo" (迷子) for "lost person," and the English phrase "My Go" for "my own path." Designed for those who are lost in HKU to find their unique way out.

It is also a tribute to the anime/band BanG Dream! It's MyGO!!!!!, symbolizing "finding one's way even when lost" — which is exactly what this app does for students in the buildings in HKU!
