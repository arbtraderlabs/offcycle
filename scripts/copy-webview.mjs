import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist/webview', { recursive: true });
await cp('src/webview', 'dist/webview', { recursive: true });
