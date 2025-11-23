import { Elysia } from 'elysia';
import { folderRoutes } from '@/infrastructure/http/routes/folder.route';
import { explorerRoutes } from '@/infrastructure/http/routes/explorer.route';

const API_PREFIX = process.env.API_PREFIX || '/api';
const API_VERSION = process.env.API_VERSION || '/v1';
const FULL_PREFIX = `${API_PREFIX}${API_VERSION}`;

export const apiRoutes = new Elysia({ prefix: FULL_PREFIX })
  .use(folderRoutes)
  .use(explorerRoutes);