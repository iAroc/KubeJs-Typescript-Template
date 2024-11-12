### VSCode with TypeScript for KubeJS Template

**Requirements:**
- Complete KubeJS setup
- VSCode
- ESLint (VSCode Extension)

**Usage:**

1. Clone this repository into your KubeJS folder, where you have your ProbeJS dump files. This will create a new folder, "KubeJs-Typescript-Template," alongside your existing folders (e.g., "assets," "client_scripts").
2. Navigate to the new folder and run `npm install` to install all necessary dependencies.
3. Open the `kubejs.code-workspace` file in VSCode to start working.

**Note:**
- If you clone the template to a different location, make sure to update the `outDir` in the following files to point to the correct folders:
  - `tsconfig.client.json`
  - `tsconfig.server.json`
  - `tsconfig.startup.json`
