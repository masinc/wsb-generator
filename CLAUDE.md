# WSB Generator - Project Overview

## Description

A modern GUI application for creating and editing Windows Sandbox (WSB)
configuration files. This tool provides an intuitive interface to configure
Windows Sandbox settings without manually editing XML files.

## Technology Stack

### Core Technologies

- **Electron**: ^38.1.2 - Desktop application framework
- **Svelte**: ^5.39.3 - UI framework
- **TypeScript**: ^5.9.2 - Programming language

### Build Tools

- **electron-vite**: ^4.0.1 - Build tool
- **electron-builder**: ^25.1.8 - Application packager
- **Vite**: ^7.1.6 - Frontend build tool

### Styling

- **TailwindCSS**: ^4.1.15 - Utility-first CSS framework
- **DaisyUI**: ^5.3.7 - Component library for TailwindCSS

### Development Tools

- **ESLint**: ^9.36.0 - Linting
- **Prettier**: ^3.6.2 - Code formatting
- **svelte-check**: ^4.3.1 - Type checking for Svelte

### Libraries

- **@jsr/masinc__wsb**: 0.1.0 - WSB file parsing and serialization
- **lucide-svelte**: ^0.548.0 - Icon library

## Project Structure

- `src/main/` - Electron main process (IPC handlers, file operations)
- `src/preload/` - Preload scripts for secure IPC
- `src/renderer/` - Svelte UI components
  - `components/` - Reusable UI components
  - `components/settings/` - Settings-specific components
- `resources/` - Application resources (icons, etc.)

## Key Features

- WSB configuration file editor
- Path autocomplete for mapped folders
- Real-time configuration validation
- File operations (New, Open, Save, Save As)
- Keyboard shortcuts support
