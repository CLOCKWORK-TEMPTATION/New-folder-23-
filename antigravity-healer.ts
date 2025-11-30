import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// --- 1. Configuration & Interfaces ---

interface HealConfig {
    targetProcesses: string[];
    dryRun: boolean; // If true, only logs what would happen without deleting
}

interface LogEntry {
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
    message: string;
}

// --- 2. Logging System (Utility Class) ---

class Logger {
    public static log(level: LogEntry['level'], message: string): void {
        const timestamp = new Date().toISOString();
        const color = this.getColor(level);
        const reset = "\x1b[0m";
        console.log(`${color}[${timestamp}] [${level}] ${message}${reset}`);
    }

    private static getColor(level: LogEntry['level']): string {
        switch (level) {
            case 'INFO': return "\x1b[36m"; // Cyan
            case 'WARN': return "\x1b[33m"; // Yellow
            case 'ERROR': return "\x1b[31m"; // Red
            case 'SUCCESS': return "\x1b[32m"; // Green
            default: return "\x1b[37m"; // White
        }
    }
}

// --- 3. System Operations Manager (Base Logic) ---

class SystemManager {
    protected platform: NodeJS.Platform;
    protected homeDir: string;

    constructor() {
        this.platform = os.platform();
        this.homeDir = os.homedir();
    }

    /**
     * Executes a shell command and handles errors gracefully.
     */
    protected async runCommand(command: string): Promise<boolean> {
        try {
            await execAsync(command);
            return true;
        } catch (error: any) {
            // Ignore errors if process not found (common scenario)
            if (error.stderr && !error.stderr.includes('not found') && !error.stderr.includes('No such process')) {
                Logger.log('WARN', `Command failed: ${command}. Details: ${error.message}`);
            }
            return false;
        }
    }
}

// --- 4. The Healer Logic (Core Implementation) ---

class AntigravityHealer extends SystemManager {
    private config: HealConfig;

    constructor(config: HealConfig) {
        super();
        this.config = config;
    }

    /**
     * Identifies and kills hung processes based on the OS.
     */
    public async killZombieAgents(): Promise<void> {
        Logger.log('INFO', 'Scanning for hung Agent processes...');
        
        const targets = this.config.targetProcesses;
        let killCmd = '';

        if (this.platform === 'win32') {
            // Windows: taskkill /F /IM <name>
            for (const target of targets) {
                // Wildcard matching simulation for Windows usually requires specific names, 
                // but here we iterate known executable names.
                // Note: Windows executables need .exe extension usually
                killCmd = `taskkill /F /IM "${target}.exe" /T`; 
                await this.runCommand(killCmd);
            }
        } else {
            // macOS / Linux: pkill -f <name>
            for (const target of targets) {
                killCmd = `pkill -f "${target}"`;
                await this.runCommand(killCmd);
            }
        }

        Logger.log('SUCCESS', 'Process cleanup routine finished.');
    }

    /**
     * Determines cache paths based on OS and clears them.
     */
    public async clearIdeCache(): Promise<void> {
        Logger.log('INFO', 'Locating IDE cache directories...');

        const cachePaths: string[] = this.getCachePaths();
        
        for (const cachePath of cachePaths) {
            await this.deleteDirectory(cachePath);
        }
    }

    private getCachePaths(): string[] {
        const paths: string[] = [];

        if (this.platform === 'win32') {
            paths.push(path.join(this.homeDir, 'AppData', 'Roaming', 'Google', 'Antigravity', 'Cache'));
            paths.push(path.join(this.homeDir, 'AppData', 'Roaming', 'Google', 'Antigravity', 'GPUCache'));
        } else if (this.platform === 'darwin') {
            paths.push(path.join(this.homeDir, 'Library', 'Application Support', 'Google', 'Antigravity', 'Cache'));
            paths.push(path.join(this.homeDir, 'Library', 'Application Support', 'Google', 'Antigravity', 'GPUCache'));
        } else { // Linux
            paths.push(path.join(this.homeDir, '.config', 'google-antigravity', 'Cache'));
        }

        return paths;
    }

    private async deleteDirectory(targetPath: string): Promise<void> {
        if (this.config.dryRun) {
            Logger.log('INFO', `[DRY RUN] Would delete: ${targetPath}`);
            return;
        }

        try {
            await fs.rm(targetPath, { recursive: true, force: true });
            Logger.log('SUCCESS', `Cleared Cache: ${targetPath}`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                Logger.log('INFO', `Path already clean: ${targetPath}`);
            } else if (error.code === 'EPERM' || error.code === 'EACCES') {
                Logger.log('ERROR', `Permission denied for: ${targetPath}. Try running as Admin/Sudo.`);
            } else {
                Logger.log('ERROR', `Failed to delete ${targetPath}: ${error.message}`);
            }
        }
    }

    /**
     * Main execution flow
     */
    public async execute(): Promise<void> {
        Logger.log('INFO', 'Starting Antigravity Troubleshooting Sequence (TypeScript)...');
        
        try {
            // Step 1: Kill Processes
            await this.killZombieAgents();
            
            // Step 2: Brief pause to allow OS to release file locks
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Step 3: Clear Cache
            await this.clearIdeCache();
            
            Logger.log('SUCCESS', 'Maintenance complete. Please restart Antigravity IDE.');
            
        } catch (error) {
            Logger.log('ERROR', `Critical failure during execution: ${error}`);
        }
    }
}

// --- 5. Entry Point ---

(async () => {
    const config: HealConfig = {
        targetProcesses: ["Antigravity Helper", "antigravity-agent", "g-agent-service"],
        dryRun: false
    };

    const healer = new AntigravityHealer(config);
    await healer.execute();
})();