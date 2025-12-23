# Folder Structure Guide for Trade Union Hotel Search Platform

> A comprehensive guide for organizing the Trade Union Hotel Search Platform using modern web development practices

## Table of Contents

1. [Introduction](#introduction)
2. [Current Project Structure](#current-project-structure)
3. [Recommended Structure for Web App Migration](#recommended-structure-for-web-app-migration)
4. [Folder and File Descriptions](#folder-and-file-descriptions)
5. [Build Tool Specific Configurations](#build-tool-specific-configurations)
6. [Scalability Tips](#scalability-tips)
7. [Migration Path](#migration-path)
8. [Best Practices](#best-practices)
9. [Example Usage](#example-usage)
10. [Why This Structure?](#why-this-structure)
11. [Resources](#resources)

---

## Introduction

This guide provides best practices for organizing the Trade Union Hotel Search Platform as it evolves from a Selenium-based automation script to a modern web application. The current implementation uses Node.js with Selenium WebDriver for automated hotel search functionality, and this guide will help structure the upcoming web app conversion.

### When to Use This Structure

* **Current implementation**: Node.js Selenium script with comprehensive hotel monitoring
* **Web app migration**: When converting to browser-based application with Vue.js/React
* **Production deployment**: When implementing serverless architecture with Vercel/Netlify

---

## Current Project Structure

The Trade Union Hotel Search Platform currently follows a Node.js automation architecture:

```plaintext
monitora_vagas/
├── .github/
│   └── FOLDER_STRUCTURE_GUIDE.md
├── docs/
│   ├── README.md
│   ├── WEB_APP_CONVERSION_PROPOSAL.md
│   └── web_development_history.md
├── node_modules/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── selenium-script.js
├── test-general-regex.js
└── test-regex.js

```

### Current Architecture Benefits

✅ **Comprehensive automation** - Multi-weekend hotel vacancy monitoring
✅ **Advanced pattern recognition** - Sophisticated regex for vacancy detection
✅ **Hotel-specific organization** - Results grouped by hotel with room details
✅ **Error handling** - Robust error recovery and logging
✅ **HTML cleanup** - Clean output formatting without HTML tags
✅ **Brazilian date format** - DD/MM/YYYY format support with JavaScript injection

### Current Architecture Limitations

⚠️ **Command-line only** - No web interface for users
⚠️ **Single user** - Cannot handle concurrent searches
⚠️ **No data persistence** - Results are not saved or exportable
⚠️ **Browser dependency** - Requires Chrome/Chromium installation
⚠️ **Limited accessibility** - Technical users only
⚠️ **No real-time updates** - Manual script execution required

---

## Recommended Structure for Web App Migration

When converting to a web application, consider migrating to this modern folder structure:

```plaintext
monitora_vagas/
├── public/                      # Static assets (not processed by build tools)
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # Site favicon
│   ├── robots.txt              # SEO crawler instructions
│   └── images/                 # Static images
│       ├── afpesp-logo.png
│       └── hotel-icons/
│
├── src/                        # Source code (processed by build tools)
│   ├── assets/                 # Dynamic assets
│   │   ├── fonts/             # Web fonts
│   │   │   └── Inter/
│   │   ├── icons/             # SVG icons, icon fonts
│   │   └── images/            # Images imported in JS/CSS
│   │       ├── hero-background.jpg
│   │       └── hotel-thumbnails/
│   │
│   ├── components/            # Reusable UI components
│   │   ├── SearchForm/
│   │   │   ├── SearchForm.js
│   │   │   ├── SearchForm.css
│   │   │   └── index.js       # Barrel export
│   │   ├── ResultsTable/
│   │   │   ├── ResultsTable.js
│   │   │   ├── ResultsTable.css
│   │   │   └── index.js
│   │   ├── WeekendCard/
│   │   │   ├── WeekendCard.js
│   │   │   ├── WeekendCard.css
│   │   │   └── index.js
│   │   ├── ProgressBar/
│   │   │   ├── ProgressBar.js
│   │   │   ├── ProgressBar.css
│   │   │   └── index.js
│   │   └── index.js           # Export all components
│   │
│   ├── pages/                 # Page-level components
│   │   ├── Home/
│   │   │   ├── Home.js
│   │   │   ├── Home.css
│   │   │   └── index.js
│   │   ├── Search/
│   │   │   ├── Search.js
│   │   │   ├── Search.css
│   │   │   └── index.js
│   │   ├── Results/
│   │   │   ├── Results.js
│   │   │   ├── Results.css
│   │   │   └── index.js
│   │   └── index.js
│   │
│   ├── services/              # API and external service integrations
│   │   ├── afpesp/
│   │   │   ├── scraper.js     # AFPESP website scraping logic
│   │   │   ├── api.js         # API endpoints for search
│   │   │   └── parser.js      # HTML parsing utilities
│   │   └── storage/
│   │       └── localStorage.js
│   │
│   ├── utils/                 # Utility functions
│   │   ├── dates.js           # Weekend calculation and date formatting
│   │   ├── regex.js           # Hotel vacancy pattern matching
│   │   ├── export.js          # PDF/CSV export utilities
│   │   └── constants.js       # App-wide constants
│   │
│   ├── styles/                # Global styles
│   │   ├── base/
│   │   │   ├── reset.css      # CSS reset/normalize
│   │   │   ├── typography.css # Font definitions
│   │   │   └── variables.css  # CSS custom properties
│   │   ├── themes/
│   │   │   ├── dark.css       # Dark theme (current)
│   │   │   └── light.css      # Light theme (future)
│   │   └── main.css           # Import all global styles
│   │
│   ├── config/                # Configuration files
│   │   ├── afpesp.config.js   # AFPESP website configuration
│   │   └── app.config.js      # Application settings
│   │
│   ├── main.js                # Application entry point
│   └── index.html             # HTML template (for some bundlers)
│
├── dist/                       # Build output (git-ignored)
│   ├── index.html
│   ├── bundle.js
│   ├── styles.css
│   └── assets/
│
├── tests/                      # Test files
│   ├── unit/
│   │   ├── services/
│   │   │   └── afpesp.test.js
│   │   └── utils/
│   │       ├── dates.test.js
│   │       └── regex.test.js
│   ├── integration/
│   │   └── search-flow.test.js
│   └── e2e/
│       └── vacancy-monitoring.test.js
│
├── docs/                       # Project documentation
│   ├── README.md               # Documentation index
│   ├── WEB_APP_CONVERSION_PROPOSAL.md # Web app conversion strategy
│   ├── web_development_history.md     # Development history
│   ├── api/                    # API documentation
│   │   └── afpesp-integration.md
│   ├── architecture/           # Architecture decisions
│   │   └── serverless-design.md
│   └── guides/                 # User and developer guides
│       └── getting-started.md
│
├── .github/                    # GitHub specific files
│   ├── workflows/              # GitHub Actions CI/CD
│   │   ├── test.yml
│   │   └── deploy.yml
│   ├── ISSUE_TEMPLATE/
│   └── FOLDER_STRUCTURE_GUIDE.md
│
├── .vscode/                    # VS Code workspace settings
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
│
├── legacy/                     # Legacy Selenium implementation
│   ├── selenium-script.js     # Original automation script
│   ├── test-regex.js          # Regex pattern tests
│   └── test-general-regex.js  # General pattern tests
│
├── node_modules/               # Dependencies (git-ignored)
│
├── .env.example               # Environment variable template
├── .env                       # Environment variables (git-ignored)
├── .gitignore                 # Git ignore rules
├── .eslintrc.js              # ESLint configuration
├── .prettierrc               # Prettier configuration
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── vite.config.js            # Vite configuration
├── vercel.json               # Vercel deployment configuration
├── README.md                 # Project overview
└── CHANGELOG.md              # Version history

```

---

## Folder and File Descriptions

### `/public`

**Purpose:** Static assets that are copied directly to the build output without processing.

**Contains:**

* `index.html` - Main HTML template with root div for SPA mounting
* `favicon.ico`, `robots.txt`, `sitemap.xml` - SEO and browser files
* Static images that don't need optimization

**Best Practices:**

* Keep this minimal - most assets should be in `/src/assets`
* Files here are publicly accessible at root URL
* Use absolute paths: `/favicon.ico`, not `./favicon.ico`

### `/src`

**Purpose:** All source code that will be processed by build tools.

#### `/src/assets`

**Purpose:** Dynamic assets imported in JavaScript or CSS.

**When to use:**

* Images referenced in React/Vue components
* Fonts imported via `@font-face`
* Icons used programmatically

**Benefits:**

* Build tools can optimize (compress, resize)
* Cache busting via hashed filenames
* Tree-shaking removes unused assets

**Example:**

```javascript
import logo from '@/assets/images/logo.png';
import '@/assets/fonts/Montserrat/font.css';

```

#### `/src/components`

**Purpose:** Reusable UI components used across multiple pages.

**Organization:**

```text
components/
├── Button/
│   ├── Button.js         # Component logic
│   ├── Button.css        # Component styles
│   ├── Button.test.js    # Component tests
│   └── index.js          # Re-export for clean imports

```

**Best Practices:**

* One component per folder
* Co-locate styles, tests, and logic
* Use `index.js` for clean imports: `import { Button } from '@/components/Button'`
* Keep components small and focused (Single Responsibility Principle)

**Examples for Trade Union Platform:**

* `SearchForm` - Hotel and date selection form
* `ResultsTable` - Vacancy results display
* `WeekendCard` - Individual weekend availability card
* `ProgressBar` - Search progress indicator
* `ExportButtons` - PDF/CSV export controls

#### `/src/pages`

**Purpose:** Page-level components that represent distinct routes/views.

**Difference from components:**

* Pages compose multiple components
* Pages are route endpoints
* Pages handle data fetching and state management

**Examples for Trade Union Platform:**

* `Home` - Main landing page with search form
* `Search` - Hotel search configuration page
* `Results` - Vacancy results and summary page
* `History` - Previous search history
* `About` - About Trade Union services and project information

#### `/src/services`

**Purpose:** Business logic and API integrations.

**Organization:**

```text
services/
├── spotify/
│   ├── auth.js        # OAuth flow functions
│   ├── api.js         # API client
│   ├── types.js       # Type definitions
│   └── index.js       # Public API
└── storage/
    └── localStorage.js # localStorage wrapper

```

**Best Practices:**

* Separate concerns (auth vs data fetching)
* Return promises for async operations
* Handle errors consistently
* Export a clean public API

**Example for AFPESP Scraping:**

```javascript
// services/afpesp/scraper.js
export async function searchWeekendVacancies(searchParams) {
  const { hotelSelection, dateRange, weekends } = searchParams;
  const results = [];

  for (const weekend of weekends) {
    const vacancies = await searchSingleWeekend(weekend, hotelSelection);
    results.push({
      weekend: weekend.dates,
      status: vacancies.length > 0 ? 'AVAILABLE' : 'NO_AVAILABILITY',
      hotels: groupVacanciesByHotel(vacancies)
    });
  }

  return results;
}

export async function searchSingleWeekend(weekend, hotelSelection) {
  // Puppeteer scraping logic adapted from Selenium script
  // ... scraping implementation
}

```

#### `/src/utils`

**Purpose:** Pure utility functions with no side effects.

**What belongs here:**

* Data transformation functions
* Validation helpers
* Format/parse utilities
* Constants and enums

**What doesn't belong here:**

* API calls (use `/services`)
* Component logic (use `/components`)
* Business logic (use `/services`)

**Examples:**

```javascript
// utils/dates.js
export function getNextWeekends(monthsAhead = 2) { ... }
export function formatBrazilianDate(date) { ... }

// utils/regex.js
export const HOTEL_VACANCY_PATTERNS = {
  general: /([A-Z][a-z\s]+)\s*\(até\s+\d+\s+pessoas?\)/gi,
  specific: /BLUES\s+Luxo\s*\(até\s+3\s+pessoas?\)/gi
};

// utils/constants.js
export const AFPESP_CONFIG = {
  BASE_URL: 'https://associadoh.afpesp.org.br',
  VACANCY_PAGE: '/Servicos/Reservas/Vagas-disponiveis.aspx'
};
export const HOTEL_TYPES = ['Todas', 'Homem de Melo', 'Perdizes', 'Sumaré'];

```

#### `/src/styles`

**Purpose:** Global stylesheets and theme definitions.

**Organization:**

```text
styles/
├── base/
│   ├── reset.css       # Remove browser defaults
│   ├── typography.css  # Font imports and defaults
│   └── variables.css   # CSS custom properties
├── themes/
│   ├── dark.css        # Dark theme
│   └── light.css       # Light theme
└── main.css            # Import all global styles

```

**Best Practices:**

* Use CSS custom properties for theming:

  ```css
  :root {
    --color-primary: #1DB954;
    --color-bg: #121212;
    --color-text: #ffffff;
  }

  ```

* Component-specific styles stay with components
* Global styles only for truly global patterns

#### `/src/config`

**Purpose:** Configuration objects and environment-specific settings.

**Examples:**

```javascript
// config/afpesp.config.js
export const afpespConfig = {
  baseUrl: 'https://associadoh.afpesp.org.br',
  vacancyUrl: '/Servicos/Reservas/Vagas-disponiveis.aspx',
  timeout: 30000,
  retryAttempts: 3,
  dateFormat: 'DD/MM/YYYY'
};

// config/app.config.js
export const appConfig = {
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  searchTimeout: 30000,
  maxConcurrentSearches: 3
};

```

### `/dist`

**Purpose:** Build output directory (always git-ignored).

**Contains:**

* Bundled JavaScript
* Compiled CSS
* Optimized images
* Generated HTML

**Note:** Never commit this folder. It's regenerated on each build.

### `/tests`

**Purpose:** All test files organized by test type.

**Organization:**

* `unit/` - Individual function/component tests
* `integration/` - Multi-component interaction tests
* `e2e/` - Full user journey tests

**Naming Convention:**

* `*.test.js` or `*.spec.js`
* Mirror source structure: `src/services/spotify/auth.js` → `tests/unit/services/spotify/auth.test.js`

### `/docs`

**Purpose:** Project documentation beyond README.

**Organization:**

```text
docs/
├── api/                    # API documentation
├── architecture/           # Design decisions (ADRs)
├── guides/                 # How-to guides
└── images/                 # Documentation images

```

**Best Practices:**

* Use Markdown for easy version control
* Keep README focused, put deep dives in `/docs`
* Link between documents liberally

### Root Configuration Files

#### `package.json`

**Purpose:** Define dependencies, scripts, and project metadata.

**Essential scripts:**

```json
{
  "scripts": {
    "dev": "vite",                    // Development server
    "build": "vite build",            // Production build
    "preview": "vite preview",        // Preview production build
    "test": "vitest",                 // Run tests
    "lint": "eslint src/",            // Code linting
    "format": "prettier --write src/" // Code formatting
  }
}

```

#### `.env.example` and `.env`

**Purpose:** Environment variables (API keys, feature flags).

**.env.example** (committed):

```bash
VITE_AFPESP_BASE_URL=https://associadoh.afpesp.org.br
VITE_ENABLE_MOCK_DATA=false
VITE_SEARCH_TIMEOUT=30000
VITE_MAX_WEEKENDS=9

```

**.env** (git-ignored):

```bash
VITE_AFPESP_BASE_URL=https://associadoh.afpesp.org.br
VITE_ENABLE_MOCK_DATA=true
VITE_SEARCH_TIMEOUT=15000
VITE_MAX_WEEKENDS=12

```

**Best Practices:**

* Never commit `.env` (add to `.gitignore`)
* Always commit `.env.example` as a template
* Use build tool's env variable prefix (e.g., `VITE_` for Vite)

#### `.gitignore`

**Essential entries:**

```text
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
npm-debug.log*

```

---

## Build Tool Specific Configurations

### Vite (Recommended for Modern Projects)

**Why Vite:**

* ⚡ Lightning fast dev server (no bundling in dev)
* 🔥 Hot Module Replacement (HMR)
* 📦 Optimized production builds
* 🎯 Great TypeScript support
* 🌐 Native ES modules

**Installation:**

```bash
npm create vite@latest music-in-numbers -- --template vanilla
# or for TypeScript: --template vanilla-ts

```

**vite.config.js:**

```javascript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

```

### Webpack

**Why Webpack:**

* 🔧 Highly configurable
* 🎨 Rich plugin ecosystem
* 📊 Advanced code splitting
* 🌍 Industry standard

**Installation:**

```bash
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin css-loader style-loader

```

**webpack.config.js:**

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  devServer: {
    static: './dist',
    port: 3000,
    hot: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/')
    }
  }
};

```

### Parcel

**Why Parcel:**

* 🎁 Zero configuration
* 🚀 Fast builds
* 🔄 Built-in hot reloading
* 📦 Automatic dependency resolution

**Installation:**

```bash
npm install --save-dev parcel

```

**Usage (no config file needed):**

```json
{
  "scripts": {
    "dev": "parcel src/index.html",
    "build": "parcel build src/index.html"
  }
}

```

### Comparison Table

| Feature | Vite | Webpack | Parcel |
| ------- | ---- | ------- | ------ |
| Speed (dev) | ⚡⚡⚡ Very Fast | ⚡ Slower | ⚡⚡ Fast |
| Speed (build) | ⚡⚡ Fast | ⚡⚡ Fast | ⚡⚡ Fast |
| Configuration | Simple | Complex | Zero config |
| HMR | Excellent | Good | Good |
| TypeScript | Built-in | Requires loader | Built-in |
| Learning Curve | Low | High | Very Low |
| Ecosystem | Growing | Mature | Moderate |
| Best For | Modern SPAs | Enterprise | Quick prototypes |

---

## Scalability Tips

### 1. Feature-Based Organization (Alternative)

Instead of grouping by file type, group by feature:

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.js
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   └── Auth.page.js
│   ├── artist/
│   │   ├── components/
│   │   │   ├── ArtistCard.js
│   │   │   └── ArtistInfo.js
│   │   ├── services/
│   │   │   └── artistService.js
│   │   └── Artist.page.js
│   └── player/
│       ├── components/
│       │   └── MusicPlayer.js
│       └── Player.page.js

```

**When to use:**

* Large applications with distinct features
* Multiple team members working on different features
* Features that might become separate packages

### 2. Barrel Exports

Use `index.js` files to create clean import paths:

```javascript
// components/index.js
export { default as Sidebar } from './Sidebar';
export { default as MusicPlayer } from './MusicPlayer';
export { default as Card } from './Card';

// Usage
import { Sidebar, MusicPlayer, Card } from '@/components';

```

### 3. Path Aliases

Configure build tool to use clean import paths:

```javascript
// Instead of:
import { spotifyAuth } from '../../../services/spotify/auth';

// Use:
import { spotifyAuth } from '@/services/spotify/auth';

```

### 4. Code Splitting

Split code by route for faster initial load:

```javascript
// Lazy load pages
const Artist = () => import('@/pages/Artist');
const Library = () => import('@/pages/Library');

```

### 5. Shared Components Library

Extract truly reusable components to a shared library:

```text
src/
├── components/        # App-specific components
└── ui/               # Pure, reusable UI components
    ├── Button/
    ├── Input/
    └── Modal/

```

### 6. Monorepo Structure (Advanced)

For multiple related projects:

```plaintext
music-in-numbers/
├── apps/
│   ├── web/              # Main web app
│   ├── mobile/           # Mobile app (React Native)
│   └── admin/            # Admin dashboard
├── packages/
│   ├── ui/               # Shared UI components
│   ├── api-client/       # Shared API client
│   └── utils/            # Shared utilities
└── package.json

```

---

## Migration Path

### Phase 1: Setup Build Tools (1-2 hours)

1. **Initialize npm project:**

   ```bash
   npm init -y

   ```

2. **Install Vite:**

   ```bash
   npm install --save-dev vite

   ```

3. **Create basic structure:**

   ```bash
   mkdir -p public src/components src/services src/utils src/styles

   ```

4. **Move files:**
   * `src/*.html` → `public/index.html` (combine duplicates)
   * `src/styles.css` → `src/styles/main.css`
   * Create `src/main.js` as entry point

5. **Update package.json scripts:**

   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }

   ```

### Phase 2: Extract Components (2-4 hours)

1. **Identify reusable patterns** in HTML:
   * Sidebar navigation
   * Music player bar
   * Card components
   * Search bar

2. **Create component files:**

   ```javascript
   // src/components/Sidebar/Sidebar.js
   export function Sidebar() {
     return `
       <div class="sidebar">
         <!-- Extracted sidebar HTML -->
       </div>
     `;
   }

   ```

3. **Extract inline CSS to component CSS files**

4. **Import and render in main.js:**

   ```javascript
   import { Sidebar } from './components/Sidebar';
   import { MusicPlayer } from './components/MusicPlayer';

   document.querySelector('#app').innerHTML = `
     ${Sidebar()}
     ${MusicPlayer()}
   `;

   ```

### Phase 3: Refactor Services (1-2 hours)

1. **Extract OAuth logic:**

   ```javascript
   // src/services/spotify/auth.js
   export async function initiateAuth(clientId) { ... }
   export async function exchangeToken(code, clientId) { ... }

   ```

2. **Extract API calls:**

   ```javascript
   // src/services/spotify/api.js
   export async function getUserProfile(accessToken) { ... }
   export async function getArtist(artistId, accessToken) { ... }

   ```

3. **Extract utilities:**

   ```javascript
   // src/utils/crypto.js
   export function generateCodeVerifier() { ... }
   export async function generateCodeChallenge(verifier) { ... }

   ```

### Phase 4: Environment Variables (30 min)

1. **Create `.env.example`:**

   ```bash
   VITE_SPOTIFY_CLIENT_ID=your_client_id_here

   ```

2. **Update code to use environment variables:**

   ```javascript
   const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

   ```

3. **Add `.env` to `.gitignore`**

### Phase 5: Testing & Optimization (2-4 hours)

1. **Test development server:**

   ```bash
   npm run dev

   ```

2. **Test production build:**

   ```bash
   npm run build
   npm run preview

   ```

3. **Optimize:**
   * Enable minification
   * Configure code splitting
   * Optimize images

**Total Migration Time:** 6-12 hours (depending on project size)

---

## Best Practices

### 1. Separation of Concerns

**Good:**

```javascript
// services/spotify/auth.js - handles OAuth
export async function initiateAuth(clientId) { ... }

// components/LoginButton.js - handles UI
export function LoginButton({ onClick }) { ... }

// pages/Auth.js - orchestrates both
import { initiateAuth } from '@/services/spotify/auth';
import { LoginButton } from '@/components/LoginButton';

```

**Bad:**

```javascript
// Everything in one file
function LoginButton() {
  // Mixed UI and business logic
  async function login() {
    const verifier = generateCodeVerifier(); // Should be in utils
    const response = await fetch('...'); // Should be in services
    updateUI(); // Should be in component
  }
}

```

### 2. DRY (Don't Repeat Yourself)

**Current issue:** `index.html` and `music_in_numbers.html` are identical duplicates.

**Solution:** Single source of truth with build tools

```javascript
// Single HTML template in public/index.html
// Different entry points via routing or multiple builds

```

### 3. Naming Conventions

**Files:**

* Components: `PascalCase.js` (e.g., `MusicPlayer.js`)
* Utilities: `camelCase.js` (e.g., `generateToken.js`)
* Constants: `UPPER_SNAKE_CASE.js` (e.g., `API_CONSTANTS.js`)
* Styles: `kebab-case.css` (e.g., `music-player.css`)

**Folders:**

* `kebab-case` for multi-word (e.g., `music-player/`)
* `PascalCase` for components (e.g., `MusicPlayer/`)

### 4. Import Order

```javascript
// 1. External dependencies
import React from 'react';
import { useState } from 'react';

// 2. Internal modules (absolute imports)
import { spotifyAuth } from '@/services/spotify/auth';
import { Button } from '@/components/Button';

// 3. Relative imports
import { helper } from './utils';

// 4. Styles
import './styles.css';

// 5. Assets
import logo from './logo.png';

```

### 5. Configuration Over Code

**Good:**

```javascript
// config/spotify.config.js
export const SPOTIFY_CONFIG = {
  scopes: ['user-read-private', 'user-read-email'],
  authUrl: 'https://accounts.spotify.com/authorize'
};

// services/spotify/auth.js
import { SPOTIFY_CONFIG } from '@/config/spotify.config';

```

**Bad:**

```javascript
// Hardcoded values scattered throughout code
const scopes = 'user-read-private user-read-email'; // Repeated in multiple files

```

### 6. Git Hygiene

**.gitignore essentials:**

```text
# Dependencies
node_modules/

# Build
dist/
build/
.cache/

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Logs
*.log

```

**Commit messages:**

```bash
# Good
git commit -m "feat: add Spotify OAuth PKCE flow"
git commit -m "fix: resolve token refresh race condition"
git commit -m "refactor: extract auth service from components"

# Bad
git commit -m "updates"
git commit -m "fixed stuff"

```

### 7. Documentation

**Component documentation:**

```javascript
/**
 * MusicPlayer - Displays currently playing track with playback controls
 *
 * @param {Object} props
 * @param {string} props.trackName - Name of the current track
 * @param {string} props.artistName - Name of the artist
 * @param {Function} props.onPlay - Callback when play button is clicked
 *
 * @example
 * <MusicPlayer
 *   trackName="Happier Than Ever"
 *   artistName="Billie Eilish"
 *   onPlay={handlePlay}
 * />
 */
export function MusicPlayer({ trackName, artistName, onPlay }) {
  // ...
}

```

### 8. Error Handling

**Centralized error handling:**

```javascript
// services/spotify/api.js
class SpotifyAPIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function fetchUserProfile(accessToken) {
  try {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
      throw new SpotifyAPIError(
        'Failed to fetch user profile',
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    // Log to monitoring service
    console.error('Spotify API Error:', error);
    throw error;
  }
}

```

---

## Example Usage

### Example 1: Creating a New Feature

**Task:** Add a "Recently Played" page

1. **Create page structure:**

   ```bash
   mkdir -p src/pages/RecentlyPlayed
   touch src/pages/RecentlyPlayed/RecentlyPlayed.js
   touch src/pages/RecentlyPlayed/RecentlyPlayed.css
   touch src/pages/RecentlyPlayed/index.js

   ```

2. **Create component:**

   ```javascript
   // src/pages/RecentlyPlayed/RecentlyPlayed.js
   import { getRecentlyPlayed } from '@/services/spotify/api';
   import { Card } from '@/components/Card';
   import './RecentlyPlayed.css';

   export async function RecentlyPlayed() {
     const tracks = await getRecentlyPlayed();

     return `
       <div class="recently-played">
         <h2>Recently Played</h2>
         ${tracks.map(track => Card(track)).join('')}
       </div>
     `;
   }

   ```

3. **Add service method:**

   ```javascript
   // src/services/spotify/api.js
   export async function getRecentlyPlayed() {
     const token = localStorage.getItem('access_token');
     const response = await fetch(
       'https://api.spotify.com/v1/me/player/recently-played',
       { headers: { 'Authorization': `Bearer ${token}` } }
     );
     return await response.json();
   }

   ```

4. **Add to router/navigation**

### Example 2: Adding a Reusable Component

**Task:** Create a reusable Badge component

1. **Create component:**

   ```bash
   mkdir -p src/components/Badge
   touch src/components/Badge/Badge.js
   touch src/components/Badge/Badge.css
   touch src/components/Badge/index.js

   ```

2. **Implement component:**

   ```javascript
   // src/components/Badge/Badge.js
   import './Badge.css';

   /**
    * Badge - Display status or category labels
    * @param {Object} props
    * @param {string} props.text - Badge text
    * @param {string} props.variant - 'light' | 'dark' | 'primary'
    */
   export function Badge({ text, variant = 'light' }) {
     return `
       <button class="badge badge--${variant}">
         ${text}
       </button>
     `;
   }

   ```

   ```css
   /* src/components/Badge/Badge.css */
   .badge {
     background-color: #fff;
     border: none;
     border-radius: 100px;
     padding: 0.25rem 1rem;
     font-weight: 700;
     height: 2rem;
     color: #000;
     width: fit-content;
   }

   .badge--dark {
     background-color: #000;
     color: #fff;
   }

   .badge--primary {
     background-color: #1DB954;
     color: #fff;
   }

   ```

3. **Export from index:**

   ```javascript
   // src/components/Badge/index.js
   export { Badge } from './Badge';

   ```

4. **Use in components:**

   ```javascript
   import { Badge } from '@/components/Badge';

   const html = `
     <div class="box">
       <p>Create your first playlist</p>
       ${Badge({ text: 'Create playlist', variant: 'light' })}
     </div>
   `;

   ```

### Example 3: Environment-Specific Configuration

**Development:**

```javascript
// .env.development
VITE_SPOTIFY_CLIENT_ID=dev_client_id
VITE_API_BASE_URL=https://api.spotify.com/v1
VITE_ENABLE_MOCK_AUTH=true
VITE_LOG_LEVEL=debug

```

**Production:**

```javascript
// .env.production
VITE_SPOTIFY_CLIENT_ID=prod_client_id
VITE_API_BASE_URL=https://api.spotify.com/v1
VITE_ENABLE_MOCK_AUTH=false
VITE_LOG_LEVEL=error

```

**Usage:**

```javascript
// src/config/app.config.js
export const appConfig = {
  spotifyClientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  enableMockAuth: import.meta.env.VITE_ENABLE_MOCK_AUTH === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info'
};

```

---

## Why This Structure?

### Principle 1: Separation of Concerns

Each folder has a single, clear purpose:

* `/components` - UI only
* `/services` - Business logic and APIs
* `/utils` - Pure functions
* `/styles` - Global styling

**Benefits:**

* Easier to find files
* Reduced merge conflicts
* Better code reuse
* Simpler testing

### Principle 2: Scalability

The structure supports growth:

* Start small (few components)
* Add features incrementally
* Reorganize when needed (e.g., feature-based)
* Extract shared code easily

### Principle 3: Developer Experience

**Fast development:**

* Hot Module Replacement (instant updates)
* Fast builds with modern tools
* Autocomplete with proper imports
* Easier debugging with source maps

**Team collaboration:**

* Clear file ownership
* Consistent patterns
* Self-documenting structure
* Easy onboarding

### Principle 4: Build Optimization

Modern build tools provide:

* **Tree-shaking** - Remove unused code
* **Code-splitting** - Load only what's needed
* **Minification** - Smaller file sizes
* **Asset optimization** - Compressed images
* **Cache busting** - Versioned filenames

### Principle 5: Maintainability

**Easy to maintain because:**

* Single source of truth (no duplicates)
* Clear dependencies
* Isolated changes
* Comprehensive testing

---

## Resources

### Official Documentation

* [Vite Guide](https://vitejs.dev/guide/) - Modern build tool
* [Webpack Documentation](https://webpack.js.org/) - Module bundler
* [Parcel Documentation](https://parceljs.org/) - Zero-config bundler
* [npm Documentation](https://docs.npmjs.com/) - Package manager

### Best Practices Resources

* [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript) - Code quality principles
* [JavaScript Project Guidelines](https://github.com/elsewhencode/project-guidelines) - Project structure best practices
* [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Node.js guidelines
* [Frontend Checklist](https://github.com/thedaviddias/Front-End-Checklist) - Quality checklist
* [Markdownlint](https://github.com/DavidAnson/markdownlint/) - Markdown linting and style checking

### Tools

* [ESLint](https://eslint.org/) - Code linting
* [Prettier](https://prettier.io/) - Code formatting
* [Markdownlint](https://github.com/DavidAnson/markdownlint/) - Markdown linting and style checking
* [Vitest](https://vitest.dev/) - Testing framework
* [Husky](https://typicode.github.io/husky/) - Git hooks

### Project Examples

* [Vite Examples](https://github.com/vitejs/vite/tree/main/packages/create-vite) - Official starter templates
* [Real World App](https://github.com/gothinkster/realworld) - Full-stack examples
* [awesome-vite](https://github.com/vitejs/awesome-vite) - Curated Vite resources

### Related Documentation in This Project

* [HTML_CSS_JS_SEPARATION.md](./HTML_CSS_JS_SEPARATION.md) - Separation of concerns guide
* [HIGH_COHESION_GUIDE.md](./HIGH_COHESION_GUIDE.md) - High cohesion principles
* [LOW_COUPLING_GUIDE.md](./LOW_COUPLING_GUIDE.md) - Low coupling principles
* [README.md](../README.md) - Project overview

---

## Conclusion

This folder structure provides a solid foundation for scaling web projects from simple prototypes to production applications. Remember:

1. **Start simple** - Don't over-engineer early
2. **Adopt incrementally** - Migrate piece by piece
3. **Stay consistent** - Follow the established patterns
4. **Document changes** - Keep this guide updated
5. **Iterate** - Adjust the structure as your project evolves

The current AFPESP Hotel Vacancy Monitor implementation works great for its automated monitoring scope. Use this guide when you need to:

* Convert from Selenium script to web application
* Implement user-friendly web interface
* Deploy to serverless architecture (Vercel/Netlify)
* Add real-time progress updates and result export
* Scale to multiple concurrent users

**Questions or suggestions?** Open an issue or submit a pull request to improve this guide!

---

*Last updated: October 2025*
*Maintained by: AFPESP Monitor Team*
