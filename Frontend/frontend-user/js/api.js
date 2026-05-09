/**
 * API 请求模块
 * 依赖: config.js
 */

const api = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    clearAuth() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    async request(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${config.API_BASE}${url}`, {
            ...options,
            headers
        });

        const data = await response.json();
        
        if (data.code === 2001 || data.code === 2002) {
            this.clearAuth();
            updateNavbar();
            throw new Error(data.message || '登录已过期，请重新登录');
        }
        
        if (data.code !== 0) {
            throw new Error(data.message || '请求失败');
        }
        
        return data.data;
    },

    // User APIs
    async login(username, password) {
        const data = await this.request('/user/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        this.setAuth(data.token, data.user);
        return data;
    },

    async register(user) {
        return this.request('/user/register', {
            method: 'POST',
            body: JSON.stringify(user)
        });
    },

    async getUserInfo() {
        return this.request('/user/info');
    },

    async updateProfile(user) {
        return this.request('/user/update', {
            method: 'PUT',
            body: JSON.stringify(user)
        });
    },

    async updatePassword(oldPassword, newPassword) {
        return this.request('/user/password', {
            method: 'PUT',
            body: JSON.stringify({ oldPassword, newPassword })
        });
    },

    // Item APIs
    async getItems(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/item/list?${query}`);
    },

    async getItem(id) {
        return this.request(`/item/${id}`);
    },

    async getSimilarItems(id, limit = 5) {
        return this.request(`/item/${id}/similar?limit=${limit}`);
    },

    async getMyItems(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/item/my?${query}`);
    },

    async createItem(item) {
        return this.request('/item', {
            method: 'POST',
            body: JSON.stringify(item)
        });
    },

    async updateItem(id, item) {
        return this.request(`/item/${id}`, {
            method: 'PUT',
            body: JSON.stringify(item)
        });
    },

    async deleteItem(id) {
        return this.request(`/item/${id}`, {
            method: 'DELETE'
        });
    },

    // Message APIs
    async getMessages(params = {}) {
        const query = new URLSearchParams(params).toString();
        return this.request(`/message/list?${query}`);
    },

    async getUnreadCount() {
        return this.request('/message/unread');
    },

    async sendMessage(itemId, content) {
        return this.request('/message', {
            method: 'POST',
            body: JSON.stringify({ itemId, content })
        });
    },

    async markAsRead(id) {
        return this.request(`/message/read/${id}`, {
            method: 'PUT'
        });
    },

    async markAllAsRead() {
        return this.request('/message/read-all', {
            method: 'PUT'
        });
    },

    async getItemMessages(itemId) {
        return this.request(`/message/item/${itemId}`);
    }
};
