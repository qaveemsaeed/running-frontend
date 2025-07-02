// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'),
  AUTH_BASE_URL: import.meta.env.DEV ? '/api' : (import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:5000/api'),
  
  // CORS Proxy for development (only use in development)
  CORS_PROXY: import.meta.env.DEV ? 'https://cors-anywhere.herokuapp.com/' : '',
  
  // Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/consumer/login',
    SIGNUP: '/consumer/sign-up',
    PROFILE: '/consumer/profile',
    USER_DATA: '/consumer/user-data',
    
    // Home & Recipes
    HOME: '/home',
    SEARCH: '/search',
    RECIPE: (id) => `/${id}`,
    
    // Cart
    CART: (userId) => `/cart/${userId}`,
    CART_ITEM: (userId, itemId) => `/cart/${userId}/${itemId}`,
    
    // Orders
    ORDERS: '/orders',
    USER_ORDERS: (userId) => `/orders/user/${userId}`,
    ORDER_STATUS: (orderId) => `/orders/${orderId}/status`,
    ORDER_CANCEL: (orderId) => `/orders/${orderId}/cancel`,
    CREATE_ORDER: (userId) => `/orders/${userId}`,
    
    // Admin
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_CREATE_FOOD: '/admin/create/food-item',
    ADMIN_CREATE_PRODUCT: '/admin/create/product',
    ADMIN_DELETE_FOOD: (id) => `/admin/food-item/${id}`,
    ADMIN_DELETE_PRODUCT: (id) => `/admin/product/${id}`,
  }
};

// Helper function to get full URL
export const getApiUrl = (endpoint) => {
  if (endpoint.startsWith('http')) {
    return endpoint; // Already a full URL
  }
  
  // Determine which base URL to use based on endpoint
  let baseUrl;
  if (endpoint.includes('/consumer/') || endpoint.includes('/auth/')) {
    baseUrl = API_CONFIG.AUTH_BASE_URL;
  } else {
    baseUrl = API_CONFIG.BASE_URL;
  }
  
  return `${baseUrl}${endpoint}`;
};

 