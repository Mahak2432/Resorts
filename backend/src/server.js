import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { connectDatabase } from './config/db.js';
import { getDataSourceKind } from './services/dataSource.js';
import { errorHandler, notFound } from './middleware/error.js';

import roomRoutes    from './routes/rooms.js';
import bookingRoutes from './routes/bookings.js';
import miscRoutes    from './routes/misc.js';
import paymentRoutes from './routes/payments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// API
app.use('/api', roomRoutes);
app.use('/api', bookingRoutes);
app.use('/api', miscRoutes);
app.use('/api', paymentRoutes);

// SPA in production
const distDir = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(distDir));
app.get(/^\/(?!api).*/, (_req, res, next) => {
  res.sendFile(path.join(distDir, 'index.html'), (err) => err && next());
});

app.use('/api/*', notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDatabase(process.env.MONGO_URI).finally(() => {
  app.listen(PORT, () => {
    console.log(`🌲 Whispering Pines API → http://localhost:${PORT}`);
    console.log(`   Active data source: ${getDataSourceKind()}`);
  });
});
