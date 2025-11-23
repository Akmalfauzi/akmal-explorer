import type { ErrorHandler } from 'elysia';
import { DomainError } from '@/infrastructure/http/middleware/error-handler';

function buildErrorBody(error: DomainError, path: string) {
  return {
    error: error.code,
    message: error.message,
    path,
    details: error.details ?? null,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
  };
}

export const globalErrorHandler: ErrorHandler = ({ code, error, path }) => {
  const errorString = String(error);
  const errorMessage = (error as any)?.message || errorString;

  if (error instanceof DomainError) {
    let status = 500;
    switch (error.code) {
      case 'VALIDATION_ERROR':
        status = 400;
        break;
      case 'NOT_FOUND':
        status = 404;
        break;
      case 'UNAUTHORIZED':
        status = 401;
        break;
      case 'CONFLICT':
        status = 409;
        break;
      case 'INTERNAL_SERVER_ERROR':
        status = 500;
        break;
      default:
        status = 400;
    }
    
    return new Response(JSON.stringify(buildErrorBody(error, path)), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (code === 'VALIDATION') {
    return new Response(JSON.stringify({
      error: 'VALIDATION_FAILED',
      message: 'Input validation error',
      path,
      issues: (error as any)?.all ?? (error as any)?.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (
    errorMessage.includes('Failed query') ||
    errorMessage.includes('database') ||
    errorMessage.includes('Database query failed') ||
    errorMessage.includes('SQL') ||
    errorString.includes('Failed query') ||
    errorString.includes('params:') ||
    (error as any)?.code?.startsWith?.('P')
  ) {
    return new Response(JSON.stringify({
      error: 'DATABASE_ERROR',
      message: 'Database operation failed',
      path,
      details: process.env.NODE_ENV !== 'production' ? errorMessage : undefined,
      stack: process.env.NODE_ENV !== 'production' ? (error as any)?.stack : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (code === 'NOT_FOUND' || (error as any)?.code === 'NOT_FOUND' || (error as any)?.status === 404) {
    return new Response(JSON.stringify({
      error: 'ROUTE_NOT_FOUND',
      message: `Route ${path} not found`,
      path
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    error: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : errorMessage || 'Unknown error',
    path,
    stack: process.env.NODE_ENV !== 'production' ? (error as any)?.stack : undefined
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
};
