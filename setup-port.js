#!/usr/bin/env node
/**
 * Setup script to detect available port and update .env file
 * Runs before `next dev` to ensure NEXT_PUBLIC_API_URL points to correct port
 */

const net = require('net');
const fs = require('fs');
const path = require('path');

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

async function main() {
  try {
    const availablePort = await findAvailablePort(3000);
    const envPath = path.join(__dirname, '.env');
    
    // Read current .env
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update NEXT_PUBLIC_API_URL with the available port
    envContent = envContent.replace(
      /NEXT_PUBLIC_API_URL=http:\/\/localhost:\d+\/api/,
      `NEXT_PUBLIC_API_URL=http://localhost:${availablePort}/api`
    );
    
    // Write back to .env
    fs.writeFileSync(envPath, envContent);
    
    console.log(`✅ Port ${availablePort} is available. Updated .env with NEXT_PUBLIC_API_URL=http://localhost:${availablePort}/api`);
  } catch (err) {
    console.error('Error setting up port:', err.message);
    process.exit(1);
  }
}

main();
