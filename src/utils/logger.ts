// Log to stderr so Cursor MCP logs show startup/errors (stdout is used for MCP protocol)
export const log = (msg: string) => console.error(`[ecommerce-mcp] ${msg}`);

export function setupErrorHandlers() {
    process.on('uncaughtException', (err) => {
        log(`uncaughtException: ${err.message}`);
        console.error(err);
    });

    process.on('unhandledRejection', (reason, p) => {
        log(`unhandledRejection: ${String(reason)}`);
    });
}
