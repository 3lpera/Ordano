// Este archivo es el punto de entrada para el servidor en JavaScript
import { spawn } from 'child_process';
import path from 'path';

const serverPath = path.join(process.cwd(), 'server.js');

console.log('Iniciando servidor Ordano...');

const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env }
});

serverProcess.on('error', (error) => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`El proceso del servidor finalizó con código ${code}`);
  process.exit(code || 0);
});

process.on('SIGINT', () => {
  console.log('\nCerrando servidor...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  serverProcess.kill('SIGTERM');
});
