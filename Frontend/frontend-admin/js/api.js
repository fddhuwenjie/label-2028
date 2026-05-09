/**
 * 管理后台 API 请求模块
 * 依赖: config.js
 */

// 认证信息
let token = localStorage.getItem('adminToken');
let user = JSON.parse(localStorage.getItem('adminUser') || 'null');

// API 请求封装
async function apiRequest(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    const response = await fetch(`${config.API_BASE}${url}`, { ...options, headers });
    const data = await response.json();
    if (data.code === 2001 || data.code === 2002) {
        logout();
        throw new Error('登录已过期');
    }
    if (data.code !== 0) throw new Error(data.message);
    return data.data;
}

// 设置认证信息
function setAuth(newToken, newUser) {
    token = newToken;
    user = newUser;
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
}

// 清除认证信息
function clearAuth() {
    token = null;
    user = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
}

// 获取当前用户
function getCurrentUser() {
    return user;
}

// 获取当前token
function getToken() {
    return token;
}
