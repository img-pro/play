/**
 * Authentication client for Img.pro
 * Shared across all micro-apps
 */
export class ImgAuth {
  private tokenKey = 'img_api_token';
  public authUrl: string;
  public apiUrl: string;

  constructor(options: { authUrl?: string; apiUrl?: string } = {}) {
    // Default to production URLs
    this.authUrl = options.authUrl || 'https://img.pro';
    this.apiUrl = options.apiUrl || 'https://api.img.pro';
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set token
   */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    // Validate token by trying to fetch media with limit=1
    try {
      const response = await fetch(`${this.apiUrl}/v1/media?limit=1`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok && response.status === 401) {
        console.error('Token appears to be invalid or expired');
      }

      return response.ok;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  /**
   * Login - redirect to API keys page
   */
  async login(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.location.href = `${this.authUrl}/api-keys`;
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Get user info from token
   */
  getUser(): { token: string; authenticated: boolean } | null {
    const token = this.getToken();
    if (!token) return null;

    // Extract token ID part (before the |)
    return {
      token: token.split('|')[0],
      authenticated: true
    };
  }
}