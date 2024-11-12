const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

// read the dist from the tsconfig.json
const tsServerConfigData = fs.readFileSync('./tsconfig.server.json', 'utf8');
const tsServerConfig = JSON5.parse(tsServerConfigData);
const distServerPath = path.join(__dirname, tsServerConfig.compilerOptions.outDir);

// do the same for the client
const tsClientConfigData = fs.readFileSync('./tsconfig.client.json', 'utf8');
const tsClientConfig = JSON5.parse(tsClientConfigData);
const distClientPath = path.join(__dirname, tsClientConfig.compilerOptions.outDir);

// do the same for the startup
const tsStartupConfigData = fs.readFileSync('./tsconfig.startup.json', 'utf8');
const tsStartupConfig = JSON5.parse(tsStartupConfigData);
const distStartupPath = path.join(__dirname, tsStartupConfig.compilerOptions.outDir);

// Directories to watch
const directories = [
    distServerPath,
    distClientPath,
    distStartupPath,
];

console.log('Directories to watch:', directories);

function RemoveEsModuleLine(fileContent) {
    let updatedContent = fileContent.replace(
        'Object.defineProperty(exports, "__esModule", { value: true });\n',
        '',
    );
    if (updatedContent !== fileContent) {
        console.log('Removed __esModule lines');
    }
    return updatedContent;
};

function FixRequires(fileContent) {
    let requireRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*require\("([^"]+)"\);/g;

    let updatedContent = fileContent.replace(requireRegex, (match, varName, className) => {
        let lastDotIndex = className.lastIndexOf('.');
        let subVarName = '';
        if (lastDotIndex !== -1) {
            subVarName = className.substring(lastDotIndex + 1);
        }
        return `let ${varName} = { $${subVarName}: Java.loadClass("${className}") };`;
    });

    if (updatedContent !== fileContent) {
        console.log('Replaced require to Java.loadclass lines');
    }
    return updatedContent;
};

function FixFile(filePath) {
    fs.readFile(filePath, 'utf8', (err, fileContent) => {
        if (err) {
            console.error(`Failed to read file ${filePath}:`, err);
            return;
        }

        let newfileContent = RemoveEsModuleLine(fileContent);
        newfileContent = FixRequires(newfileContent);

        if (newfileContent !== fileContent) {
            fs.writeFile(filePath, newfileContent, (err) => {
                if (err) {
                    console.error(`Failed to write file ${filePath}:`, err);
                    return;
                }
                console.log(`Updated file ${filePath}`);
            });
        }
    });
}

// Initialize chokidar watcher
const watcher = chokidar.watch(directories, {
    persistent: true,
    ignoreInitial: true, // Only watch for new changes
    // awaitWriteFinish: true, // Wait for file writes to finish before processing
    ignored: /(^|[/\\])\../, // Ignore dotfiles
    usePolling: true, // Required for Windows
    interval: 100, // Poll every 100ms
    awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
    },
});

// Watch for .js file changes
watcher.on('change', (filePath) => {
    console.log(`File ${filePath} has been changed`);
    if (filePath.endsWith('.js')) {
        watcher.unwatch(filePath);
        FixFile(filePath);

        setTimeout(() => {
            watcher.add(filePath);
        }, 100); // Re-enable after a short delay to avoid immediate retriggering
    }
});

watcher.on('add', (filePath) => {
    console.log(`File ${filePath} has been created`);
    if (filePath.endsWith('.js')) {
        FixFile(filePath);
    }
});

console.log('Watching for changes in .js files in specified directories...');
