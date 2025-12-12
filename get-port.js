#!/usr/bin/env node
/**
 * Script to find an available port and output it
 * Usage: node get-port.js [startPort]
 */

const net = require('net');

async function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port in use, try next port
        resolve(findAvailablePort(startPort + 1));
      } else {
        resolve(startPort);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(startPort);
    });
    
    server.listen(startPort);
  });
}

const startPort = parseInt(process.argv[2]) || 3000;
findAvailablePort(startPort).then((port) => {
  console.log(port);
});
