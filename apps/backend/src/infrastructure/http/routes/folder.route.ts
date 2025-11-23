import { Elysia, t } from 'elysia';
import { NotFoundError, ValidationError, InternalServerError } from '@/infrastructure/http/middleware/error-handler';
import { FolderMapper } from '@/application/mappers/folder.mapper';
import { container } from '@/infrastructure/di/container';

const { folderRepository, getTreeUseCase } = container;

export const folderRoutes = new Elysia({ prefix: '/folders' })

  .get('/tree', async ({ query }) => {
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 50;

    if (page < 1) throw new ValidationError('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');

    const result = await getTreeUseCase.execute(page, limit);
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
  }, {
    query: t.Object({
      page: t.Optional(t.String()),
      limit: t.Optional(t.String())
    })
  })

  .get('/:id/children', async ({ params, query }) => {
    const { id } = params;
    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 50;

    if (!id) throw new ValidationError('Folder ID is required');
    if (page < 1) throw new ValidationError('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');

    let parentFolder;
    try {
      parentFolder = await folderRepository.findById(id);
    } catch (dbError) {
      const errorMsg = (dbError as any)?.message || String(dbError);
      throw new InternalServerError(
        process.env.NODE_ENV === 'production' ? 'Database operation failed' : errorMsg,
        process.env.NODE_ENV === 'production' ? undefined : { originalError: errorMsg }
      );
    }

    if (!parentFolder) {
      throw new NotFoundError('Folder', id);
    }

    const result = await folderRepository.findByParentId(id, page, limit);
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
  })

  .get('/:id', async ({ params }) => {
    const { id } = params;

    if (!id) throw new ValidationError('Folder ID is required');

    let folder;
    try {
      folder = await folderRepository.findById(id);
    } catch (dbError) {
      const errorMsg = (dbError as any)?.message || String(dbError);
      throw new InternalServerError(
        process.env.NODE_ENV === 'production' ? 'Database operation failed' : errorMsg,
        process.env.NODE_ENV === 'production' ? undefined : { originalError: errorMsg }
      );
    }

    if (!folder) {
      throw new NotFoundError('Folder', id);
    }

    return {
      success: true,
      data: FolderMapper.toDto(folder),
      timestamp: new Date().toISOString()
    };
  }, {
    params: t.Object({ id: t.String() })
  });
