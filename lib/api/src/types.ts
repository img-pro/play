/**
 * Type definitions for Img.pro API
 */

export interface MediaItem {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
  filesize: number;
  description?: string;
  sizes?: {
    [key: string]: {
      src: string;
      width: number;
      height: number;
      filesize: number;
    };
  };
}

export interface MediaListResponse {
  data: MediaItem[];
  next_cursor?: string;
  has_more: boolean;
}

export interface UploadResponse {
  success: boolean;
  data: MediaItem;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface ListMediaOptions {
  limit?: number;
  cursor?: string;
}

export interface UploadOptions {
  description?: string;
  public?: boolean;
}