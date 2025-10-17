import 'dotenv/config';
import { onRequest } from 'firebase-functions/v2/https';
import { createApp } from './app';

const app = createApp();

export const api = onRequest({
    region: 'us-central1',
    cors: true,
    memory: '256MiB',
    timeoutSeconds: 30,
}, app);

const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env['NODE_ENV'] || 'development'}`);
});
