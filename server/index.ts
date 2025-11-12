// This file serves as a wrapper to run the vanilla JavaScript server
// The actual server implementation is in server.js (vanilla JS, no TypeScript)
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(process.cwd(), 'server.js');

console.log('Starting StudySync server...');
console.log('This application uses vanilla JavaScript, HTML, and CSS (no TypeScript, no React)');

// Spawn the vanilla JS server
const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env }
});

serverProcess.on('error', (error) => {
  console.error('Error starting server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code || 0);
});

// Handle shutdown gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});
