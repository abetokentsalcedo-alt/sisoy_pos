#!/usr/bin/env node
/**
 * Simple Node.js server that acts as a proxy to PHP backend
 * Runs on port 8000 and directly loads/executes PHP files
 */

const http = require('http');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const url = require('url');

const PORT = 8000;
const BACKEND_DIR = __dirname;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  // Remove leading slash
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1);
  }

  // Map to PHP file
  let phpFile = path.join(BACKEND_DIR, pathname.endsWith('.php') ? pathname : pathname + '.php');
  
  // Security: prevent directory traversal
  if (!phpFile.startsWith(BACKEND_DIR)) {
    res.writeHead(403);
    res.end(JSON.stringify({ error: 'Forbidden' }));
    return;
  }

  // Check if file exists
  if (!fs.existsSync(phpFile)) {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  try {
    // Execute PHP file using CLI
    const env = {
      ...process.env,
      REQUEST_METHOD: req.method,
      QUERY_STRING: new URLSearchParams(parsedUrl.query).toString(),
      SCRIPT_NAME: '/' + pathname,
      SCRIPT_FILENAME: phpFile,
    };

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        // Pass request body via environment or stdin
        const phpCommand = `php -d error_reporting=E_ALL -r "
          \\$_SERVER['REQUEST_METHOD'] = '${req.method}';
          \\$_GET = ${JSON.stringify(parsedUrl.query).replace(/"/g, '\\\\"')};
          if ('${req.method}' === 'POST' || '${req.method}' === 'PUT') {
            \\$_POST = \\$_REQUEST = json_decode('${body.replace(/'/g, "\\'")}', true) ?? [];
          }
          \\$_SERVER['CONTENT_TYPE'] = '${req.headers['content-type'] || 'application/json'}';
          include '${phpFile}';
        "`;

        // For simpler approach, use direct PHP execution
        const output = execSync(`php "${phpFile}"`, {
          env: {
            ...env,
            REQUEST_METHOD: req.method,
            QUERY_STRING: new URLSearchParams(parsedUrl.query).toString(),
          },
          encoding: 'utf-8',
          timeout: 5000,
        });

        res.writeHead(200);
        res.end(output);
      } catch (err) {
        console.error('PHP Error:', err.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'PHP execution failed', details: err.message }));
      }
    });
  } catch (err) {
    console.error('Server Error:', err.message);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Server error', details: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
  console.log(`Serving PHP files from: ${BACKEND_DIR}`);
});
