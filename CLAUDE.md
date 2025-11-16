# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Astro-based API Playground** for Img.pro - an interactive web application for testing and exploring the image hosting API. The project is designed to provide developers with a visual interface to test API endpoints without writing code.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Working with the API Package

The shared API client lives in `lib/api/`:

```bash
# Build the API package (must be done before using changes in Astro)
cd lib/api
npm run build

# Watch mode for active development
cd lib/api
npm run dev
```

**Important**: After modifying TypeScript files in `lib/api/src/`, you must rebuild the package before the changes are visible in the Astro app.

## Architecture

### Monorepo Structure

This is a minimal monorepo with two main parts:

1. **Astro Web App** (root): The interactive playground UI
2. **API Package** (`lib/api/`): Shared TypeScript client for Img.pro API

The API package is linked via `"@img-pro/api": "file:./lib/api"` in package.json, allowing it to be imported like any npm package.

### API Package (`lib/api/`)

**Purpose**: Reusable TypeScript client for Img.pro API, designed to be shared across multiple micro-apps (playground, dashboard, etc.)

**Key Files**:
- `src/client.ts`: Main `ImgAPI` class with methods for upload, list, get, delete media
- `src/auth.ts`: `ImgAuth` class handling token storage and authentication
- `src/types.ts`: TypeScript interfaces for API responses (`MediaItem`, `UploadResponse`, etc.)
- `src/index.ts`: Public exports

**Environment Handling**: Both `ImgAPI` and `ImgAuth` automatically detect localhost and switch between:
- Development: `https://test.api.img.pro`
- Production: `https://api.img.pro`

**Build Output**: TypeScript compiled to `dist/` with type declarations

### Astro Application

**Framework**: Astro 5 with Tailwind CSS 4 (via Vite plugin)

**Key Technologies**:
- **Alpine.js**: Client-side reactivity and state management (see `PlaygroundApp.astro`)
- **Prism.js**: Syntax highlighting for code examples
- **Tailwind CSS 4**: Styling via `@tailwindcss/vite` plugin (no config file needed)

**File Structure**:
- `src/pages/`: Routes (file-based routing)
  - `index.astro`: Redirects to playground
  - `playground.astro`: Main playground interface
- `src/layouts/`: Layout templates
  - `PlaygroundLayout.astro`: Base layout with Alpine.js initialization, theme system, keyboard shortcuts
- `src/components/`: Astro components
  - `PlaygroundApp.astro`: Main interactive playground (800+ lines of Alpine.js logic)
- `src/styles/`: CSS files
  - `design-system.css`: Complete design system with CSS variables, light/dark themes, Dieter Rams-inspired aesthetic

### State Management & Interactivity

All interactivity is handled via **Alpine.js** embedded in Astro components:

**Alpine Stores** (in `PlaygroundLayout.astro`):
- `theme`: Dark/light mode management with system preference support

**Main Alpine Component** (`playgroundApp` in `PlaygroundApp.astro`):
- Manages all playground state: endpoints, requests, responses, history
- Handles API calls, authentication, environment switching
- Implements request builder with tabs (params, body, headers, test scenarios)
- Stores request history in localStorage (max 50 items)

### Design System

The project uses a custom design system (`src/styles/design-system.css`) with:
- CSS variables for theming (automatic dark/light mode)
- Minimalist aesthetic inspired by Dieter Rams, Braun, and Apple
- Method-specific colors (GET=green, POST=blue, PATCH=orange, DELETE=red)
- Consistent spacing, typography, and transitions
- Custom scrollbar styling

**Key Patterns**:
- All colors use CSS variables that automatically adapt to theme
- Monospace font for code/API paths: `var(--font-mono)`
- Sans-serif for UI: `var(--font-sans)`
- Method badges use `.method-badge` with `.method-{get|post|patch|delete}` classes

### Authentication Flow

1. API token stored in `localStorage` as `img_api_token`
2. `ImgAuth` class (`lib/api/src/auth.ts`) manages token lifecycle
3. Token included in Authorization header as `Bearer {token}`
4. Playground UI shows authentication status with visual indicator
5. Unauthenticated users can still test public endpoints

### API Endpoints Configuration

All available endpoints are defined in the `endpoints` array within the `playgroundApp` Alpine component. Each endpoint includes:
- Method, path, description
- `requiresAuth` flag
- `parameters` array with type, validation, descriptions
- Optional `testScenarios` for quick testing
- Optional `hasBody` flag for POST/PATCH requests

**Adding a new endpoint**: Edit the `endpoints` array in `src/components/PlaygroundApp.astro` (~line 368).

## Common Workflows

### Adding a New API Method to the Client

1. Add method signature to `lib/api/src/client.ts`
2. Add any new types to `lib/api/src/types.ts`
3. Export types from `lib/api/src/index.ts` if needed
4. Rebuild: `cd lib/api && npm run build`
5. Add corresponding endpoint to playground's `endpoints` array

### Modifying the Playground UI

- **Visual changes**: Edit `src/styles/design-system.css` or component-specific `<style>` blocks
- **New view/tab**: Add to `activeView` logic in `PlaygroundApp.astro`
- **Request builder changes**: Modify the Alpine component's methods (e.g., `buildUrl`, `executeRequest`)

### Theme Customization

All theme variables are in `src/styles/design-system.css`:
- Light mode: `:root { ... }`
- Dark mode: `[data-theme="dark"] { ... }`
- System preference: `@media (prefers-color-scheme: dark) { ... }`

### Keyboard Shortcuts

Defined in `PlaygroundLayout.astro`:
- `Cmd/Ctrl + K`: Command palette (if implemented)
- `Cmd/Ctrl + Shift + L`: Toggle theme
- `Cmd/Ctrl + Enter`: Execute current request

## TypeScript Configuration

- **Astro app**: Extends `astro/tsconfigs/strict`
- **API package**: Standard ES2022 with strict mode, outputs to `dist/`

## Important Notes

- The index page (`src/pages/index.astro`) is just a redirect to `/playground`
- Request/response history is stored in localStorage (not synced between devices)
- The playground automatically switches API URLs based on environment selection
- Alpine.js state is NOT persisted across page reloads (except for localStorage data)
- File uploads in the playground use FormData, not JSON
