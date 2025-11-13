// Este archivo es el punto de entrada para el servidor en JavaScript
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(process.cwd(), 'server.js');

console.log('Starting StudySync server...');

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

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});
