import * as fs from 'fs';

export function initialize(configPath: string) {
    prepareConfigDirectory(configPath);
}

function prepareConfigDirectory(configPath: string) {
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath, { recursive: true });
    }
}
