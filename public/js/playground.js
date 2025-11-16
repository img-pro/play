// Img.pro API Playground - Main JavaScript
import { ImgAuth, ImgAPIClient } from '@img-pro/api';

document.addEventListener('alpine:init', () => {
  Alpine.data('playground', () => ({
    // State
    activeView: 'endpoints',
    selectedEndpoint: null,
    requestTab: 'params',
    responseTab: 'body',
    bodyFormat: 'json',
    codeLanguage: 'curl',
    environment: localStorage.getItem('environment') || 'production',
    token: localStorage.getItem('img_api_token') || '',
    isAuthenticated: false,
    isLoading: false,
    response: null,
    expandResponse: false,

    // Modals
    showAuthModal: false,
    showEnvironmentModal: false,

    // Request Data
    requestParams: {},
    requestBody: '',
    formFields: [],
    customHeaders: [],
    jsonError: null,

    // Options
    options: {
      saveToHistory: true,
      mockErrors: false
    },

    // Filters
    filters: {
      auth: false,
      public: false
    },

    // History
    requestHistory: JSON.parse(localStorage.getItem('request_history') || '[]'),

    // API Endpoints
    endpoints: [
      {
        id: 'get-root',
        method: 'GET',
        path: '/',
        description: 'Get service information and available endpoints',
        requiresAuth: false,
        parameters: [],
        testScenarios: [
          {
            id: 'basic',
            name: 'Basic Info',
            type: 'success',
            description: 'Get service information',
            params: {}
          }
        ]
      },
      {
        id: 'upload',
        method: 'POST',
        path: '/v1/upload',
        description: 'Upload an image file',
        requiresAuth: true,
        hasBody: true,
        parameters: [
          {
            name: 'file',
            type: 'file',
            required: true,
            accept: 'image/*',
            description: 'Image file to upload (JPEG, PNG, GIF, WebP, HEIC, etc.)'
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            placeholder: 'Image description',
            description: 'Optional description for the image'
          },
          {
            name: 'tags',
            type: 'text',
            required: false,
            placeholder: 'tag1, tag2, tag3',
            description: 'Comma-separated tags (max 10 tags, 50 chars each)'
          },
          {
            name: 'ttl',
            type: 'text',
            required: false,
            placeholder: '7d or 604800',
            description: 'Time-to-live for ephemeral images (e.g., 5m, 2h, 7d, or seconds)'
          },
          {
            name: 'public',
            type: 'boolean',
            required: false,
            description: 'Make the image publicly accessible'
          }
        ],
        testScenarios: [
          {
            id: 'basic-upload',
            name: 'Basic Upload',
            type: 'success',
            description: 'Upload a simple image',
            params: {
              description: 'Test image upload'
            }
          },
          {
            id: 'with-tags',
            name: 'Upload with Tags',
            type: 'success',
            description: 'Upload with tags and metadata',
            params: {
              description: 'Tagged image',
              tags: 'test, playground, demo',
              public: true
            }
          },
          {
            id: 'ephemeral',
            name: 'Ephemeral Upload',
            type: 'success',
            description: 'Upload with expiration',
            params: {
              description: 'Temporary image',
              ttl: '1h'
            }
          },
          {
            id: 'no-auth',
            name: 'No Authentication',
            type: 'error',
            description: 'Attempt upload without token',
            params: {},
            clearAuth: true
          },
          {
            id: 'invalid-ttl',
            name: 'Invalid TTL',
            type: 'error',
            description: 'Invalid TTL format',
            params: {
              ttl: 'invalid'
            }
          },
          {
            id: 'too-many-tags',
            name: 'Too Many Tags',
            type: 'error',
            description: 'Exceed tag limit',
            params: {
              tags: 'tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, tag11'
            }
          }
        ]
      },
      {
        id: 'import',
        method: 'POST',
        path: '/v1/import',
        description: 'Import an image from a URL',
        requiresAuth: true,
        hasBody: true,
        parameters: [
          {
            name: 'url',
            type: 'url',
            required: true,
            placeholder: 'https://example.com/image.jpg',
            description: 'URL of the image to import'
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            placeholder: 'Image description',
            description: 'Optional description for the image'
          },
          {
            name: 'tags',
            type: 'text',
            required: false,
            placeholder: 'tag1, tag2, tag3',
            description: 'Comma-separated tags'
          },
          {
            name: 'ttl',
            type: 'text',
            required: false,
            placeholder: '7d',
            description: 'Time-to-live for ephemeral images'
          },
          {
            name: 'public',
            type: 'boolean',
            required: false,
            description: 'Make the image publicly accessible'
          }
        ],
        testScenarios: [
          {
            id: 'import-unsplash',
            name: 'Import from Unsplash',
            type: 'success',
            description: 'Import a sample Unsplash image',
            params: {
              url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400',
              description: 'Sample from Unsplash',
              tags: 'unsplash, demo'
            }
          },
          {
            id: 'import-invalid',
            name: 'Invalid URL',
            type: 'error',
            description: 'Attempt to import from invalid URL',
            params: {
              url: 'not-a-valid-url'
            }
          },
          {
            id: 'import-timeout',
            name: 'Timeout Test',
            type: 'error',
            description: 'Test timeout handling',
            params: {
              url: 'https://httpstat.us/200?sleep=35000'
            }
          }
        ]
      },
      {
        id: 'list-media',
        method: 'GET',
        path: '/v1/media',
        description: 'List media items for your team',
        requiresAuth: true,
        parameters: [
          {
            name: 'limit',
            type: 'number',
            required: false,
            placeholder: '50',
            description: 'Number of items to return (max 100)'
          },
          {
            name: 'cursor',
            type: 'text',
            required: false,
            placeholder: 'cursor_string',
            description: 'Pagination cursor from previous response'
          },
          {
            name: 'ids',
            type: 'text',
            required: false,
            placeholder: 'uid1,uid2,uid3',
            description: 'Comma-separated list of specific UIDs to fetch'
          },
          {
            name: 'tags',
            type: 'text',
            required: false,
            placeholder: 'tag1,tag2',
            description: 'Filter by tags'
          },
          {
            name: 'tag_mode',
            type: 'select',
            required: false,
            options: ['any', 'all'],
            description: 'Tag matching mode'
          }
        ],
        testScenarios: [
          {
            id: 'list-all',
            name: 'List All',
            type: 'success',
            description: 'List all media items',
            params: {}
          },
          {
            id: 'list-paginated',
            name: 'Paginated List',
            type: 'success',
            description: 'List with pagination',
            params: {
              limit: 10
            }
          },
          {
            id: 'list-by-tags',
            name: 'Filter by Tags',
            type: 'success',
            description: 'Filter media by tags',
            params: {
              tags: 'demo',
              tag_mode: 'any'
            }
          },
          {
            id: 'list-specific',
            name: 'Specific IDs',
            type: 'success',
            description: 'Get specific media items',
            params: {
              ids: 'abc123,def456'
            }
          }
        ]
      },
      {
        id: 'get-media',
        method: 'GET',
        path: '/v1/media/{uid}',
        description: 'Get details for a specific media item',
        requiresAuth: false,
        parameters: [
          {
            name: 'uid',
            type: 'text',
            required: true,
            placeholder: 'abc123',
            description: 'Unique identifier of the media item'
          }
        ],
        testScenarios: [
          {
            id: 'get-existing',
            name: 'Get Existing',
            type: 'success',
            description: 'Get an existing media item',
            params: {
              uid: 'sample123'
            }
          },
          {
            id: 'get-nonexistent',
            name: 'Non-existent',
            type: 'error',
            description: 'Attempt to get non-existent media',
            params: {
              uid: 'doesnotexist'
            }
          },
          {
            id: 'get-private',
            name: 'Private Media',
            type: 'error',
            description: 'Access private media without auth',
            params: {
              uid: 'private123'
            },
            clearAuth: true
          }
        ]
      },
      {
        id: 'update-media',
        method: 'PATCH',
        path: '/v1/media/{uid}',
        description: 'Update metadata for a media item',
        requiresAuth: true,
        hasBody: true,
        parameters: [
          {
            name: 'uid',
            type: 'text',
            required: true,
            placeholder: 'abc123',
            description: 'Unique identifier of the media item'
          },
          {
            name: 'name',
            type: 'text',
            required: false,
            placeholder: 'new-filename.jpg',
            description: 'New filename'
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            placeholder: 'New description',
            description: 'New description'
          },
          {
            name: 'tags',
            type: 'text',
            required: false,
            placeholder: 'tag1, tag2',
            description: 'New tags (replaces existing)'
          },
          {
            name: 'public',
            type: 'boolean',
            required: false,
            description: 'Update public status'
          }
        ],
        testScenarios: [
          {
            id: 'update-all',
            name: 'Update All Fields',
            type: 'success',
            description: 'Update all metadata fields',
            params: {
              uid: 'sample123',
              name: 'updated-name.jpg',
              description: 'Updated description',
              tags: 'updated, new',
              public: true
            }
          },
          {
            id: 'update-partial',
            name: 'Partial Update',
            type: 'success',
            description: 'Update only description',
            params: {
              uid: 'sample123',
              description: 'Only updating description'
            }
          },
          {
            id: 'update-unauthorized',
            name: 'Unauthorized',
            type: 'error',
            description: 'Update without permission',
            params: {
              uid: 'other-team-media',
              description: 'Should fail'
            }
          }
        ]
      },
      {
        id: 'delete-media',
        method: 'DELETE',
        path: '/v1/media/{uid}',
        description: 'Delete a media item',
        requiresAuth: true,
        parameters: [
          {
            name: 'uid',
            type: 'text',
            required: true,
            placeholder: 'abc123',
            description: 'Unique identifier of the media item to delete'
          }
        ],
        testScenarios: [
          {
            id: 'delete-single',
            name: 'Delete Single',
            type: 'success',
            description: 'Delete a single media item',
            params: {
              uid: 'sample123'
            }
          },
          {
            id: 'delete-nonexistent',
            name: 'Non-existent',
            type: 'error',
            description: 'Delete non-existent media',
            params: {
              uid: 'doesnotexist'
            }
          }
        ]
      },
      {
        id: 'batch-update',
        method: 'PATCH',
        path: '/v1/media',
        description: 'Update multiple media items at once',
        requiresAuth: true,
        hasBody: true,
        parameters: [
          {
            name: 'ids',
            type: 'text',
            required: true,
            placeholder: 'uid1,uid2,uid3',
            description: 'Comma-separated UIDs (max 100)'
          },
          {
            name: 'description',
            type: 'text',
            required: false,
            placeholder: 'Batch description',
            description: 'New description for all items'
          },
          {
            name: 'tags',
            type: 'text',
            required: false,
            placeholder: 'tag1, tag2',
            description: 'Tags to apply'
          },
          {
            name: 'tag_mode',
            type: 'select',
            required: false,
            options: ['replace', 'add', 'remove'],
            description: 'How to apply tags'
          },
          {
            name: 'public',
            type: 'boolean',
            required: false,
            description: 'Update public status'
          }
        ],
        testScenarios: [
          {
            id: 'batch-replace-tags',
            name: 'Replace Tags',
            type: 'success',
            description: 'Replace tags on multiple items',
            params: {
              ids: 'abc123,def456,ghi789',
              tags: 'batch, updated',
              tag_mode: 'replace'
            }
          },
          {
            id: 'batch-add-tags',
            name: 'Add Tags',
            type: 'success',
            description: 'Add tags to existing',
            params: {
              ids: 'abc123,def456',
              tags: 'new-tag',
              tag_mode: 'add'
            }
          },
          {
            id: 'batch-too-many',
            name: 'Too Many UIDs',
            type: 'error',
            description: 'Exceed 100 UID limit',
            params: {
              ids: Array.from({length: 101}, (_, i) => `uid${i}`).join(','),
              description: 'Should fail'
            }
          }
        ]
      },
      {
        id: 'batch-delete',
        method: 'DELETE',
        path: '/v1/media',
        description: 'Delete multiple media items at once',
        requiresAuth: true,
        parameters: [
          {
            name: 'ids',
            type: 'text',
            required: true,
            placeholder: 'uid1,uid2,uid3',
            description: 'Comma-separated UIDs to delete (max 100)'
          }
        ],
        testScenarios: [
          {
            id: 'batch-delete-multiple',
            name: 'Delete Multiple',
            type: 'success',
            description: 'Delete multiple items',
            params: {
              ids: 'abc123,def456,ghi789'
            }
          },
          {
            id: 'batch-delete-mixed',
            name: 'Mixed Results',
            type: 'success',
            description: 'Some exist, some don\'t',
            params: {
              ids: 'exists1,notexist,exists2'
            }
          }
        ]
      }
    ],

    // Documentation content
    documentationContent: '',
    examplesContent: '',

    // Initialize
    init() {
      this.loadAuth();
      this.applyEnvironment();
      this.selectEndpoint(this.endpoints[0]);
      this.loadDocumentation();
      this.loadExamples();

      // Listen for execute shortcut
      document.addEventListener('execute-request', () => {
        if (this.selectedEndpoint && !this.isLoading) {
          this.executeRequest();
        }
      });
    },

    // Auth Management
    loadAuth() {
      const token = localStorage.getItem('img_api_token');
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
      }
    },

    saveToken() {
      if (this.token) {
        localStorage.setItem('img_api_token', this.token);
        this.isAuthenticated = true;
      } else {
        localStorage.removeItem('img_api_token');
        this.isAuthenticated = false;
      }
      this.showAuthModal = false;
    },

    // Environment Management
    applyEnvironment() {
      localStorage.setItem('environment', this.environment);
    },

    getApiUrl() {
      return this.environment === 'production'
        ? 'https://api.img.pro'
        : 'https://test.api.img.pro';
    },

    // Endpoint Selection
    selectEndpoint(endpoint) {
      this.selectedEndpoint = endpoint;
      this.requestParams = {};
      this.requestBody = '';
      this.formFields = [];
      this.response = null;
      this.requestTab = 'params';
      this.responseTab = 'body';
    },

    applyFilters() {
      // Filter endpoints based on selected filters
      // This would filter the endpoints array in practice
    },

    // File Handling
    handleFileSelect(event, paramName) {
      const file = event.target.files[0];
      if (file) {
        this.requestParams[paramName] = file;
      }
    },

    formatFileSize(bytes) {
      if (!bytes) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    // JSON Handling
    formatJSON() {
      try {
        const parsed = JSON.parse(this.requestBody);
        this.requestBody = JSON.stringify(parsed, null, 2);
        this.jsonError = null;
      } catch (e) {
        this.jsonError = 'Invalid JSON: ' + e.message;
      }
    },

    validateJSON() {
      try {
        JSON.parse(this.requestBody);
        this.jsonError = null;
        alert('JSON is valid!');
      } catch (e) {
        this.jsonError = 'Invalid JSON: ' + e.message;
      }
    },

    loadExampleBody() {
      const examples = {
        'import': {
          url: 'https://example.com/image.jpg',
          description: 'Example image',
          tags: 'example, demo'
        },
        'update-media': {
          name: 'updated-name.jpg',
          description: 'Updated description',
          tags: 'updated, tags'
        },
        'batch-update': {
          description: 'Batch updated',
          tags: 'batch',
          tag_mode: 'replace'
        }
      };

      const example = examples[this.selectedEndpoint?.id];
      if (example) {
        this.requestBody = JSON.stringify(example, null, 2);
      }
    },

    // Form Fields
    addFormField() {
      this.formFields.push({ key: '', value: '' });
    },

    removeFormField(index) {
      this.formFields.splice(index, 1);
    },

    // Headers
    addHeader() {
      this.customHeaders.push({ key: '', value: '' });
    },

    removeHeader(index) {
      this.customHeaders.splice(index, 1);
    },

    // Test Scenarios
    loadScenario(scenario) {
      // Clear existing params
      this.requestParams = {};

      // Load scenario params
      if (scenario.params) {
        Object.assign(this.requestParams, scenario.params);
      }

      // Handle special cases
      if (scenario.clearAuth) {
        this.token = '';
        this.isAuthenticated = false;
      }

      // If it has body params, format as JSON
      if (this.selectedEndpoint.hasBody) {
        const bodyParams = { ...scenario.params };
        // Remove path params from body
        this.selectedEndpoint.parameters.forEach(param => {
          if (param.type !== 'file' && !param.name.includes('uid') && !param.name.includes('ids')) {
            delete bodyParams[param.name];
          }
        });
        this.requestBody = JSON.stringify(bodyParams, null, 2);
      }
    },

    // Request Execution
    async executeRequest() {
      this.isLoading = true;
      this.response = null;

      try {
        const startTime = performance.now();

        // Build request
        const url = this.buildUrl();
        const options = this.buildRequestOptions();

        // Mock errors if enabled
        if (this.options.mockErrors && Math.random() > 0.5) {
          throw new Error('Mock error: Random failure for testing');
        }

        // Execute request
        const response = await fetch(url, options);
        const responseTime = Math.round(performance.now() - startTime);

        // Parse response
        let body;
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          body = await response.json();
        } else if (contentType?.includes('image/')) {
          const blob = await response.blob();
          body = {
            type: 'image',
            size: blob.size,
            url: URL.createObjectURL(blob)
          };
        } else {
          body = await response.text();
        }

        // Store response
        this.response = {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: body,
          time: responseTime,
          size: JSON.stringify(body).length,
          isImage: contentType?.includes('image/')
        };

        // Save to history
        if (this.options.saveToHistory) {
          this.saveToHistory();
        }

        // Syntax highlight if JSON
        if (contentType?.includes('application/json')) {
          setTimeout(() => {
            Prism.highlightAll();
          }, 100);
        }

      } catch (error) {
        this.response = {
          status: 0,
          statusText: 'Network Error',
          headers: {},
          body: { error: error.message },
          time: 0,
          size: 0
        };
      } finally {
        this.isLoading = false;
      }
    },

    buildUrl() {
      let path = this.selectedEndpoint.path;

      // Replace path parameters
      Object.entries(this.requestParams).forEach(([key, value]) => {
        if (path.includes(`{${key}}`)) {
          path = path.replace(`{${key}}`, value);
        }
      });

      // Build query string
      const queryParams = new URLSearchParams();
      this.selectedEndpoint.parameters.forEach(param => {
        const value = this.requestParams[param.name];
        if (value && !path.includes(`{${param.name}}`) && param.type !== 'file') {
          queryParams.append(param.name, value);
        }
      });

      const queryString = queryParams.toString();
      const url = `${this.getApiUrl()}${path}`;

      return queryString ? `${url}?${queryString}` : url;
    },

    buildRequestOptions() {
      const options = {
        method: this.selectedEndpoint.method,
        headers: {}
      };

      // Add auth header
      if (this.token && this.selectedEndpoint.requiresAuth) {
        options.headers['Authorization'] = `Bearer ${this.token}`;
      }

      // Add custom headers
      this.customHeaders.forEach(header => {
        if (header.key && header.value) {
          options.headers[header.key] = header.value;
        }
      });

      // Add body
      if (this.selectedEndpoint.hasBody) {
        if (this.bodyFormat === 'json') {
          options.headers['Content-Type'] = 'application/json';
          options.body = this.requestBody;
        } else if (this.selectedEndpoint.method === 'POST' && this.selectedEndpoint.id === 'upload') {
          // Handle file upload
          const formData = new FormData();
          this.selectedEndpoint.parameters.forEach(param => {
            const value = this.requestParams[param.name];
            if (value) {
              if (param.type === 'file') {
                formData.append(param.name, value);
              } else if (param.type === 'boolean') {
                formData.append(param.name, value ? '1' : '0');
              } else {
                formData.append(param.name, value);
              }
            }
          });
          options.body = formData;
        } else {
          // Form data
          const formData = new FormData();
          this.formFields.forEach(field => {
            if (field.key) {
              formData.append(field.key, field.value);
            }
          });
          options.body = formData;
        }
      }

      return options;
    },

    // Response Handling
    getStatusClass(status) {
      if (status >= 200 && status < 300) return 'success';
      if (status >= 400 && status < 500) return 'warning';
      if (status >= 500) return 'error';
      return 'info';
    },

    formatResponseBody(body) {
      if (typeof body === 'object') {
        return Prism.highlight(
          JSON.stringify(body, null, 2),
          Prism.languages.json,
          'json'
        );
      }
      return body;
    },

    copyResponse() {
      const text = typeof this.response.body === 'object'
        ? JSON.stringify(this.response.body, null, 2)
        : this.response.body;

      navigator.clipboard.writeText(text);
      alert('Response copied to clipboard!');
    },

    downloadResponse() {
      const text = typeof this.response.body === 'object'
        ? JSON.stringify(this.response.body, null, 2)
        : this.response.body;

      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `response-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },

    // Code Generation
    generateCode(language) {
      const generators = {
        curl: this.generateCurl.bind(this),
        javascript: this.generateJavaScript.bind(this),
        python: this.generatePython.bind(this),
        php: this.generatePHP.bind(this),
        go: this.generateGo.bind(this),
        rust: this.generateRust.bind(this),
        swift: this.generateSwift.bind(this)
      };

      const code = generators[language]?.() || '// Not implemented yet';
      return Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language);
    },

    generateCurl() {
      let cmd = `curl -X ${this.selectedEndpoint.method}`;

      // Add URL
      cmd += ` "${this.buildUrl()}"`;

      // Add headers
      if (this.token && this.selectedEndpoint.requiresAuth) {
        cmd += ` \\\n  -H "Authorization: Bearer ${this.token}"`;
      }

      // Add body
      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        cmd += ` \\\n  -H "Content-Type: application/json"`;
        cmd += ` \\\n  -d '${this.requestBody}'`;
      }

      return cmd;
    },

    generateJavaScript() {
      let code = `const response = await fetch('${this.buildUrl()}', {\n`;
      code += `  method: '${this.selectedEndpoint.method}',\n`;
      code += `  headers: {\n`;

      if (this.token && this.selectedEndpoint.requiresAuth) {
        code += `    'Authorization': 'Bearer ${this.token}',\n`;
      }

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `    'Content-Type': 'application/json'\n`;
        code += `  },\n`;
        code += `  body: JSON.stringify(${this.requestBody})\n`;
      } else {
        code += `  }\n`;
      }

      code += `});\n\n`;
      code += `const data = await response.json();\n`;
      code += `console.log(data);`;

      return code;
    },

    generatePython() {
      let code = `import requests\n\n`;
      code += `url = "${this.buildUrl()}"\n`;

      if (this.token && this.selectedEndpoint.requiresAuth) {
        code += `headers = {\n`;
        code += `    "Authorization": "Bearer ${this.token}"\n`;
        code += `}\n\n`;
      }

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `data = ${this.requestBody}\n\n`;
        code += `response = requests.${this.selectedEndpoint.method.toLowerCase()}(url, headers=headers, json=data)\n`;
      } else {
        const headersParam = (this.token && this.selectedEndpoint.requiresAuth) ? ', headers=headers' : '';
        code += `response = requests.${this.selectedEndpoint.method.toLowerCase()}(url${headersParam})\n`;
      }

      code += `print(response.json())`;

      return code;
    },

    generatePHP() {
      let code = `<?php\n`;
      code += `$url = "${this.buildUrl()}";\n`;
      code += `$ch = curl_init($url);\n\n`;
      code += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${this.selectedEndpoint.method}");\n`;
      code += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n\n`;

      if (this.token && this.selectedEndpoint.requiresAuth) {
        code += `$headers = [\n`;
        code += `    "Authorization: Bearer ${this.token}"\n`;
        code += `];\n`;
        code += `curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n\n`;
      }

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `$data = '${this.requestBody}';\n`;
        code += `curl_setopt($ch, CURLOPT_POSTFIELDS, $data);\n\n`;
      }

      code += `$response = curl_exec($ch);\n`;
      code += `curl_close($ch);\n\n`;
      code += `$data = json_decode($response, true);\n`;
      code += `print_r($data);`;

      return code;
    },

    generateGo() {
      let code = `package main\n\n`;
      code += `import (\n`;
      code += `    "fmt"\n`;
      code += `    "net/http"\n`;
      code += `    "io/ioutil"\n`;

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `    "bytes"\n`;
      }

      code += `)\n\n`;
      code += `func main() {\n`;
      code += `    url := "${this.buildUrl()}"\n\n`;

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `    payload := []byte(\`${this.requestBody}\`)\n`;
        code += `    req, _ := http.NewRequest("${this.selectedEndpoint.method}", url, bytes.NewBuffer(payload))\n`;
      } else {
        code += `    req, _ := http.NewRequest("${this.selectedEndpoint.method}", url, nil)\n`;
      }

      if (this.token && this.selectedEndpoint.requiresAuth) {
        code += `    req.Header.Set("Authorization", "Bearer ${this.token}")\n`;
      }

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `    req.Header.Set("Content-Type", "application/json")\n`;
      }

      code += `\n    client := &http.Client{}\n`;
      code += `    resp, _ := client.Do(req)\n`;
      code += `    defer resp.Body.Close()\n\n`;
      code += `    body, _ := ioutil.ReadAll(resp.Body)\n`;
      code += `    fmt.Println(string(body))\n`;
      code += `}`;

      return code;
    },

    generateRust() {
      let code = `use reqwest;\n\n`;
      code += `#[tokio::main]\n`;
      code += `async fn main() -> Result<(), reqwest::Error> {\n`;
      code += `    let url = "${this.buildUrl()}";\n`;
      code += `    let client = reqwest::Client::new();\n\n`;

      let method = this.selectedEndpoint.method.toLowerCase();
      code += `    let mut request = client.${method}(url);\n\n`;

      if (this.token && this.selectedEndpoint.requiresAuth) {
        code += `    request = request.header("Authorization", "Bearer ${this.token}");\n`;
      }

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `    request = request.header("Content-Type", "application/json");\n`;
        code += `    request = request.body(r#"${this.requestBody}"#);\n`;
      }

      code += `\n    let response = request.send().await?;\n`;
      code += `    let body = response.text().await?;\n`;
      code += `    println!("{}", body);\n\n`;
      code += `    Ok(())\n`;
      code += `}`;

      return code;
    },

    generateSwift() {
      let code = `import Foundation\n\n`;
      code += `let url = URL(string: "${this.buildUrl()}")!\n`;
      code += `var request = URLRequest(url: url)\n`;
      code += `request.httpMethod = "${this.selectedEndpoint.method}"\n\n`;

      if (this.token && this.selectedEndpoint.requiresAuth) {
        code += `request.setValue("Bearer ${this.token}", forHTTPHeaderField: "Authorization")\n`;
      }

      if (this.selectedEndpoint.hasBody && this.bodyFormat === 'json') {
        code += `request.setValue("application/json", forHTTPHeaderField: "Content-Type")\n`;
        code += `let jsonData = """${this.requestBody}""".data(using: .utf8)\n`;
        code += `request.httpBody = jsonData\n\n`;
      }

      code += `let task = URLSession.shared.dataTask(with: request) { data, response, error in\n`;
      code += `    guard let data = data else {\n`;
      code += `        print("Error: \\(error?.localizedDescription ?? "Unknown error")")\n`;
      code += `        return\n`;
      code += `    }\n\n`;
      code += `    if let json = try? JSONSerialization.jsonObject(with: data, options: []) {\n`;
      code += `        print(json)\n`;
      code += `    }\n`;
      code += `}\n\n`;
      code += `task.resume()`;

      return code;
    },

    // History Management
    saveToHistory() {
      const historyItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        method: this.selectedEndpoint.method,
        path: this.selectedEndpoint.path,
        url: this.buildUrl(),
        status: this.response.status,
        request: {
          params: this.requestParams,
          body: this.requestBody,
          headers: this.customHeaders
        },
        response: this.response
      };

      this.requestHistory.unshift(historyItem);

      // Keep only last 50 items
      if (this.requestHistory.length > 50) {
        this.requestHistory = this.requestHistory.slice(0, 50);
      }

      localStorage.setItem('request_history', JSON.stringify(this.requestHistory));
    },

    loadFromHistory(item) {
      // Find the endpoint
      const endpoint = this.endpoints.find(e => e.path === item.path);
      if (endpoint) {
        this.selectEndpoint(endpoint);

        // Load request data
        this.requestParams = item.request.params || {};
        this.requestBody = item.request.body || '';
        this.customHeaders = item.request.headers || [];

        // Load response
        this.response = item.response;

        // Switch to endpoints view
        this.activeView = 'endpoints';
      }
    },

    clearHistory() {
      if (confirm('Are you sure you want to clear all history?')) {
        this.requestHistory = [];
        localStorage.removeItem('request_history');
      }
    },

    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;

      if (diff < 60000) {
        return 'Just now';
      } else if (diff < 3600000) {
        return `${Math.floor(diff / 60000)} minutes ago`;
      } else if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)} hours ago`;
      } else {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      }
    },

    // Documentation Loading
    loadDocumentation() {
      // This would load the full API documentation
      this.documentationContent = `
        <div class="documentation-container">
          <h1>API Documentation</h1>
          <!-- Full documentation would be loaded here -->
        </div>
      `;
    },

    loadExamples() {
      // This would load code examples
      this.examplesContent = `
        <div class="examples-container">
          <h1>Code Examples</h1>
          <!-- Code examples would be loaded here -->
        </div>
      `;
    }
  }));
});