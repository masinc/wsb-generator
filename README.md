# WSB Generator

A modern GUI application for creating and editing Windows Sandbox (WSB) configuration files.

## Features

- **User-friendly Interface**: Intuitive GUI for configuring Windows Sandbox settings without manual XML editing
- **Comprehensive Settings**: Configure all Windows Sandbox options including:
  - Virtual GPU settings
  - Network configuration
  - Audio/Video input controls
  - Memory allocation
  - Clipboard and printer redirection
  - Protected client mode
  - Mapped folders with read-only options
  - Logon commands
- **File Management**: Open, edit, and save WSB configuration files
- **Path Autocomplete**: Smart directory autocomplete for mapped folder paths
- **Real-time Validation**: Instant feedback on configuration changes
- **Cross-platform Development**: Built with Electron, Svelte, and TypeScript

## Requirements

- Windows 10/11 with Windows Sandbox enabled

## Installation

Download the latest release from the [Releases](https://github.com/masinc/wsb-generator/releases) page.

## Usage

1. Launch the application
2. Configure Windows Sandbox settings using the GUI:
   - Set basic permissions (GPU, Network, Audio/Video input)
   - Add mapped folders to share files with the sandbox
   - Configure logon commands to run on startup
   - Adjust memory allocation if needed
3. Save the configuration as a `.wsb` file
4. Double-click the `.wsb` file to launch Windows Sandbox with your settings

## Development

For developers interested in contributing or building from source, please see [DEVELOPMENT.md](DEVELOPMENT.md).

## License

See LICENSE file for details.
