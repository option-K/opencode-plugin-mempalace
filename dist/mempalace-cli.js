import execa from 'execa';
async function executeMempalace(args, options = {}) {
    const defaultOptions = {
        timeout: 5000, // 5 seconds timeout to prevent hanging
        ...options,
    };
    const commands = [
        { cmd: 'mempalace', args: args },
        { cmd: 'python3', args: ['-m', 'mempalace', ...args] },
        { cmd: 'python', args: ['-m', 'mempalace', ...args] },
    ];
    let lastError;
    for (const { cmd, args: cmdArgs } of commands) {
        try {
            return await execa(cmd, cmdArgs, defaultOptions);
        }
        catch (error) {
            lastError = error;
            // If it's a timeout, don't try other commands, just fail fast
            if (error.timedOut)
                break;
        }
    }
    throw lastError;
}
export async function isInitialized(dir) {
    try {
        // Use bare 'status' without --palace. The mempalace CLI resolves the
        // palace path from ~/.mempalace/config.json or the MEMPALACE_PALACE_PATH
        // env var automatically. Passing '--palace' after the subcommand is a
        // positional error in mempalace's argparse (global flags must precede
        // the subcommand).
        await executeMempalace(['status']);
        return true;
    }
    catch (error) {
        return false;
    }
}
export async function initialize(dir) {
    try {
        await executeMempalace(['init', '--yes', dir], { input: '\n' });
    }
    catch (error) {
        console.warn(`Failed to initialize mempalace in ${dir}:`, error);
    }
}
export async function wakeUp(wing) {
    try {
        const { stdout } = await executeMempalace(['wake-up', '--wing', wing]);
        return stdout;
    }
    catch (error) {
        console.warn(`Failed to wake up mempalace:`, error);
        return null;
    }
}
export async function mine(dir, mode, wing) {
    try {
        await executeMempalace(['mine', dir, '--mode', mode, '--wing', wing]);
    }
    catch (error) {
        console.warn(`Failed to mine mempalace:`, error);
    }
}
export function mineSync(dir, mode, wing) {
    const options = { timeout: 5000 };
    const commands = [
        { cmd: 'mempalace', args: ['mine', dir, '--mode', mode, '--wing', wing] },
        { cmd: 'python3', args: ['-m', 'mempalace', 'mine', dir, '--mode', mode, '--wing', wing] },
        { cmd: 'python', args: ['-m', 'mempalace', 'mine', dir, '--mode', mode, '--wing', wing] },
    ];
    for (const { cmd, args } of commands) {
        try {
            execa.sync(cmd, args, options);
            return;
        }
        catch (error) {
            if (error.timedOut)
                break;
        }
    }
}
