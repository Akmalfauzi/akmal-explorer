import { swagger } from "@elysiajs/swagger";

export const swaggerConfig = swagger({
  path: '/docs',
  documentation: {
    info: {
      title: 'Akmal Explorer API',
      version: '1.0.0',
      description: 'API documentation for Akmal Explorer - A modern file explorer application',
      contact: {
        name: 'API Support',
        email: 'akmalfauziofficial@gmail.com'
      }
    },
    tags: [
      {
        name: 'Folders',
        description: 'Folder browsing operations'
      },
      {
        name: 'Files',
        description: 'File browsing operations'
      },
      {
        name: 'Search',
        description: 'Search functionality'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'NOT_FOUND'
            },
            message: {
              type: 'string',
              example: 'Resource not found'
            },
            path: {
              type: 'string',
              example: '/folders/123'
            },
            details: {
              type: 'object',
              nullable: true
            }
          }
        },
        Folder: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
            },
            name: {
              type: 'string',
              example: 'My Documents'
            },
            parentId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              example: null
            },
            path: {
              type: 'string',
              example: '/'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            }
          }
        },
        File: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'a47ac10b-58cc-4372-a567-0e02b2c3d479'
            },
            name: {
              type: 'string',
              example: 'document.pdf'
            },
            folderId: {
              type: 'string',
              format: 'uuid',
              example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
            },
            path: {
              type: 'string',
              example: '/folder/document.pdf'
            },
            size: {
              type: 'integer',
              example: 1024000
            },
            mimeType: {
              type: 'string',
              example: 'application/pdf'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            }
          }
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              example: 100
            },
            page: {
              type: 'integer',
              example: 1
            },
            limit: {
              type: 'integer',
              example: 50
            },
            totalPages: {
              type: 'integer',
              example: 2
            }
          }
        },
        PaginatedFolderResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Folder'
                  }
                },
                meta: {
                  $ref: '#/components/schemas/PaginationMeta'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            }
          }
        },
        FolderContentResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                folders: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Folder'
                      }
                    },
                    meta: {
                      $ref: '#/components/schemas/PaginationMeta'
                    }
                  }
                },
                files: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/File'
                      }
                    },
                    meta: {
                      $ref: '#/components/schemas/PaginationMeta'
                    }
                  }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            }
          }
        },
        SingleFolderResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              $ref: '#/components/schemas/Folder'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            }
          }
        },
        SearchResult: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              example: 'document'
            },
            type: {
              type: 'string',
              enum: ['folder', 'file'],
              example: 'file'
            },
            result: {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    oneOf: [
                      { $ref: '#/components/schemas/Folder' },
                      { $ref: '#/components/schemas/File' }
                    ]
                  }
                },
                meta: {
                  $ref: '#/components/schemas/PaginationMeta'
                }
              }
            }
          }
        },
        SearchResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              $ref: '#/components/schemas/SearchResult'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-22T10:30:00.000Z'
            }
          }
        }
      },
      responses: {
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'VALIDATION_ERROR',
                message: 'Page must be greater than 0',
                path: '/folders/tree'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'NOT_FOUND',
                message: 'Folder with id \'invalid-id\' not found',
                path: '/folders/invalid-id',
                details: {
                  resource: 'Folder',
                  id: 'invalid-id'
                }
              }
            }
          }
        }
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000',
        description: 'API Server'
      }
    ]
  }
});