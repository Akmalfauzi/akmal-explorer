import { Elysia, t } from 'elysia';
import { NotFoundError, ValidationError } from '@/infrastructure/http/middleware/error-handler';
import { container } from '@/infrastructure/di/container';

const { folderRepository, searchUseCase, getFolderContentUseCase } = container;

export const explorerRoutes = new Elysia()

  .get('/search', async ({ query }) => {
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 20;
    const q = query.q || '';
    const type = query.type as 'folder' | 'file' | undefined;

    if (page < 1) throw new ValidationError('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
    if (q.length > 255) throw new ValidationError('Search query must be less than 255 characters');
    if (type && !['folder', 'file'].includes(type)) {
      throw new ValidationError('Type must be either "folder" or "file"');
    }

    const result = await searchUseCase.execute(q, page, limit, type);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
  }, {
    query: t.Object({
      q: t.String(),
      page: t.Optional(t.String()),
      limit: t.Optional(t.String()),
      type: t.Optional(t.Union([t.Literal('folder'), t.Literal('file')]))
    })
  })

  .get('/folders/:id/content', async ({ params, query }) => {
    const { id } = params;
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 50;

    if (!id) throw new ValidationError('Folder ID is required');
    if (page < 1) throw new ValidationError('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');

    const folder = await folderRepository.findById(id);
    if (!folder) {
      throw new NotFoundError('Folder', id);
    }

    const result = await getFolderContentUseCase.execute(id, page, limit);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
  }, {
    params: t.Object({ id: t.String() }),
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String())
    })
  });
