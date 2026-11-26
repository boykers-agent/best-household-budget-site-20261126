// serve.ts — serve app/ locally for testing: `node serve.ts` then open
// http://localhost:8080 (or `node serve.ts --port 8090`). Standard library only.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.argv.find((a, i) => process.argv[i - 1] === '--port') ?? 8080);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json' };

createServer(async (req, res) => {
  try {
    const path = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
    const file = await readFile(join(here, 'app', path));
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(file);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
}).listen(port, () => console.log('HomeLedger at http://localhost:' + port));
