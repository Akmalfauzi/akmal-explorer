export interface HttpConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface HttpError {
  message: string;
  status?: number;
  data?: any;
}

export class HttpClient {
  private config: HttpConfig;

  constructor(config: HttpConfig) {
    this.config = {
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      ...config,
    };
  }

  async get<T = any>(url: string, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, options);
  }

  async post<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, {
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, {
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, options);
  }

  private async request<T = any>(
    method: string,
    url: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const { params, ...fetchOptions } = options;
    let fullUrl = `${this.config.baseURL}${url}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    const config: RequestInit = {
      method,
      headers: {
        ...this.config.headers,
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    };

    try {
      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error) {
      const httpError: HttpError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };

      if (error instanceof Error && 'status' in error) {
        httpError.status = (error as any).status;
      }

      throw httpError;
    }
  }
}