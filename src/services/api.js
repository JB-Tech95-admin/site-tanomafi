const RAW_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_BASE_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api`;

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('tanomafi_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur serveur (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiService = {
  // Upload Local Image File
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Erreur lors du téléchargement du fichier sary');
    }

    return await response.json(); // { success: true, url: '...' }
  },

  // Authentication
  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name, email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  getUsers: async () => {
    return request('/auth/users');
  },

  // Members / Tanora
  getMembers: async () => {
    return request('/members');
  },

  createMember: async (memberData) => {
    return request('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  updateMember: async (id, memberData) => {
    return request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  deleteMember: async (id) => {
    return request(`/members/${id}`, {
      method: 'DELETE',
    });
  },

  // Churches
  getChurches: async () => {
    return request('/churches');
  },

  createChurch: async (churchData) => {
    return request('/churches', {
      method: 'POST',
      body: JSON.stringify(churchData),
    });
  },

  updateChurch: async (id, churchData) => {
    return request(`/churches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(churchData),
    });
  },

  deleteChurch: async (id) => {
    return request(`/churches/${id}`, {
      method: 'DELETE',
    });
  },

  // Contact Messages
  sendContactMessage: async (name, email, message) => {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
    });
  },

  replyContactMessage: async (id, replyText) => {
    return request(`/contact/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyText }),
    });
  },

  getContactMessages: async () => {
    return request('/contact');
  },

  markContactRead: async (id) => {
    return request(`/contact/${id}/read`, {
      method: 'PUT',
    });
  },

  deleteContactMessage: async (id) => {
    return request(`/contact/${id}`, {
      method: 'DELETE',
    });
  },

  // Gallery
  getGallery: async () => {
    return request('/gallery');
  },

  createGalleryItem: async (itemData) => {
    return request('/gallery', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  deleteGalleryItem: async (id) => {
    return request(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },

  // Stats
  getDashboardStats: async () => {
    return request('/stats/dashboard');
  },
};
