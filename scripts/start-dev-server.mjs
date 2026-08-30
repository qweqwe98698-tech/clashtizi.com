import { dev } from 'astro';

try {
  const server = await dev({
    root: '.',
    server: { host: '0.0.0.0', port: 3000 }
  });
  console.log('Mizuki Dev Server Ready at http://localhost:3000/');
} catch (err) {
  console.error('Error starting server:', err);
}
