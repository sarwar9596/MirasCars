import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5000/api',
	timeout: 10000,
	headers: { 'Content-Type': 'application/json' },
});

export default api;

// ─── Cars ──────────────────────────────────────────────────────────────────
export const carsAPI = {
	getAll: (params) => api.get('/cars', { params }),
	getById: (id) => api.get(`/cars/${id}`),
	getFeatured: () => api.get('/cars?featured=true'),
};

// ─── Blogs ──────────────────────────────────────────────────────────────────
export const blogsAPI = {
	getAll: (params) => api.get('/blog', { params }),
	getBySlug: (slug) => api.get(`/blog/${slug}`),
};

// ─── Contact / Inquiries ────────────────────────────────────────────────────
export const inquiriesAPI = {
	create: (data) => api.post('/inquiries', data),
};
