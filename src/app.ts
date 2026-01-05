import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import { verifyApiKey } from './middlewares/apiKey.middleware.js';
import { swaggerSpec } from './swagger.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ ok: true, name: 'Empleabilidad API' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ojo: todo lo que cuelga de /api pide x-api-key, no lo quites
app.use('/api', verifyApiKey, routes);

export default app;
