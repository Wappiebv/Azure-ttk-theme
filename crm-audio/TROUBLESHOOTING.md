# Troubleshooting Guide

## Import Error: "Failed to resolve import"

### Problem
```
[plugin:vite:import-analysis] Failed to resolve import "../../../lib/utils" from "src/components/layout/Sidebar.tsx"
```

### Solution 1: Fix the Import Path Manually

Open `src/components/layout/Sidebar.tsx` and find line 16-18. Change:

**FROM:**
```typescript
import { useAppStore } from '../../stores';
import { cn } from '../../../lib/utils';  // ← WRONG: 3 dots
```

**TO:**
```typescript
import { useAppStore } from '../../stores';
import { cn } from '../../lib/utils';  // ← CORRECT: 2 dots
```

The file structure is:
```
src/
├── components/
│   └── layout/
│       └── Sidebar.tsx  ← You are here
├── lib/
│   └── utils.ts         ← Target file
```

From `Sidebar.tsx` to `utils.ts`: go up 2 levels (`../../`), then into `lib/utils`

### Solution 2: Use Absolute Imports (Recommended)

Change the import to use the `@/` alias:

```typescript
import { useAppStore } from '@/stores';
import { cn } from '@/lib/utils';
```

### Solution 3: Clean Install

Sometimes node_modules can cause issues:

```bash
# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install

# Run dev server
npm run dev
```

### Solution 4: Check Node.js Version

Make sure you have Node.js 18 or higher:

```bash
node --version
```

If you have an older version, download the latest from https://nodejs.org/

## Port Already in Use

### Problem
```
Port 5173 is already in use
```

### Solution
Either:
1. Close the other application using port 5173
2. Or the dev server is already running in another terminal

## Module Not Found

### Problem
```
Cannot find module 'react' or '@tanstack/react-query'
```

### Solution
```bash
npm install
```

## TypeScript Errors

### Problem
```
Cannot find name 'React' or type errors
```

### Solution
Make sure all dependencies are installed:
```bash
npm install
```

## Still Having Issues?

1. Make sure you're in the correct directory:
   ```bash
   cd crm-audio
   ```

2. Check that `src/lib/utils.ts` exists:
   ```bash
   dir src\lib\utils.ts
   ```

3. Try running the build:
   ```bash
   npm run build
   ```

4. If all else fails, re-download the ZIP file from GitHub:
   ```
   https://github.com/Wappiebv/Azure-ttk-theme/archive/refs/heads/claude/audio-crm-app-zWWvd.zip
   ```
