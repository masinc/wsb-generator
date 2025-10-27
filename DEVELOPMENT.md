# Development Guide

## Prerequisites

- Node.js (LTS version recommended)
- pnpm (package manager)

## Setup

```bash
# Install dependencies
$ pnpm install
```

## Development

```bash
# Start development server with hot reload
$ pnpm dev

# Type checking
$ pnpm typecheck

# Lint code
$ pnpm lint

# Format code
$ pnpm format
```

## Building

```bash
# Build for Windows (recommended)
$ pnpm build:win

# Build for macOS
$ pnpm build:mac

# Build for Linux
$ pnpm build:linux

# Build without packaging
$ pnpm build:unpack
```

## Technology Stack

- **Framework**: Electron
- **UI Library**: Svelte 5
- **Language**: TypeScript
- **Styling**: TailwindCSS + DaisyUI
- **Build Tool**: electron-vite
- **Package Manager**: pnpm

## Project Structure

```
wsb-generator/
├── src/
│   ├── main/          # Electron main process
│   ├── preload/       # Preload scripts
│   └── renderer/      # Svelte UI
│       ├── components/
│       │   └── settings/
│       └── App.svelte
├── resources/         # Application resources
└── out/              # Build output
```

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- Extensions:
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

## Release

This project uses GitHub Actions to automatically build and release the application when a version tag is pushed.

### Release Process

1. **Update Version**
   ```bash
   # Update version in package.json
   pnpm version <major|minor|patch>
   # This will create a commit and tag automatically
   ```

2. **Push Tag to GitHub**
   ```bash
   # Push the version commit and tag
   git push && git push --tags
   ```

3. **GitHub Actions Workflow**
   - The workflow is automatically triggered when a tag matching `v*.*.*` is pushed
   - Builds the Windows installer (`.exe`)
   - Creates a draft release on GitHub with the built artifacts

4. **Publish the Release**
   - Go to [GitHub Releases](https://github.com/masinc/wsb-generator/releases)
   - Find the draft release created by the workflow
   - Edit the release notes to describe the changes
   - Click "Publish release" to make it public

### Release Workflow Details

The [release.yml](.github/workflows/release.yml) workflow:
- Triggers on: Git tags matching `v*.*.*` pattern
- Platform: Windows only (WSB is Windows-specific)
- Artifacts: Builds `.exe` installer and related files
- Release: Creates a draft release with artifacts attached

### Manual Build (Optional)

If you need to build locally without releasing:

```bash
# Build for Windows
$ pnpm build:win

# Output will be in dist/ directory
```

### Release Checklist

Before pushing a release tag:

- [ ] All changes are committed and pushed
- [ ] Code is formatted (`pnpm format`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Application runs correctly (`pnpm dev`)
- [ ] Version number is updated in package.json
- [ ] Update CHANGELOG or release notes if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Guidelines

- Follow the existing code style
- Run `pnpm format` before committing
- Ensure all type checks pass with `pnpm typecheck`
- Test your changes thoroughly
