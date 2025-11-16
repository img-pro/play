/**
 * API client for Img.pro
 * Shared across all micro-apps
 */
import type { MediaItem, MediaListResponse, UploadResponse, ListMediaOptions, UploadOptions } from './types';

export class ImgAPI {
  public baseUrl: string;
  private tokenKey = 'img_api_token';

  constructor(options: { apiUrl?: string } = {}) {
    // Use test API in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      this.baseUrl = options.apiUrl || 'https://test.api.img.pro';
    } else {
      this.baseUrl = options.apiUrl || 'https://api.img.pro';
    }
  }

  /**
   * Get authorization header
   */
  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};

    const token = localStorage.getItem(this.tokenKey);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Make API request with proper types
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...this.getAuthHeader(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API error ${response.status}: ${error}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Upload image
   */
  async upload(file: File, options: UploadOptions = {}): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    if (options.description) {
      formData.append('description', options.description);
    }
    if (options.public !== undefined) {
      formData.append('public', String(options.public));
    }

    return this.request<UploadResponse>('/v1/upload', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * List media with proper typing
   */
  async listMedia(options: ListMediaOptions = {}): Promise<MediaListResponse> {
    const params = new URLSearchParams();

    if (options.limit) {
      params.append('limit', String(options.limit));
    }
    if (options.cursor) {
      params.append('cursor', options.cursor);
    }

    const queryString = params.toString();
    const path = queryString ? `/v1/media?${queryString}` : '/v1/media';

    return this.request<MediaListResponse>(path);
  }

  /**
   * Get media details
   */
  async getMedia(id: string): Promise<MediaItem> {
    return this.request<MediaItem>(`/v1/media/${id}`);
  }

  /**
   * Delete media
   */
  async deleteMedia(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/v1/media/${id}`, {
      method: 'DELETE',
    });
  }
}