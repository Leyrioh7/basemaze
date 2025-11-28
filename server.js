const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const BASE_DIR = __dirname;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.unityweb': 'application/octet-stream',
  '.data': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // Default to index.html for root
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(BASE_DIR, pathname);

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // Read file
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      // Get file extension
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';

      // Set headers
      const headers = {
        'Content-Type': contentType,
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Content-Security-Policy': "frame-ancestors *",
      };

      // Special handling for Unity WebGL files
      if (pathname.includes('.wasm.unityweb')) {
        headers['Content-Type'] = 'application/wasm';
        headers['Content-Encoding'] = 'gzip';
      } else if (pathname.includes('.data.unityweb')) {
        headers['Content-Type'] = 'application/octet-stream';
        headers['Content-Encoding'] = 'gzip';
      } else if (pathname.includes('.framework.js.unityweb')) {
        headers['Content-Type'] = 'application/javascript';
        headers['Content-Encoding'] = 'gzip';
      } else if (pathname.endsWith('.js') && pathname.includes('/Build/')) {
        headers['Content-Type'] = 'application/javascript';
      }

      res.writeHead(200, headers);
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}\n`);
  console.log('Press Ctrl+C to stop the server\n');
});

