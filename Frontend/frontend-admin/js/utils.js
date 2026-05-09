/**
 * 管理后台工具函数模块
 */

// 格式化日期
function formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// HTML转义
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 获取分类中文名
function getCategoryName(category) {
    return config.CATEGORIES[category] || category || '-';
}

// 获取状态信息
function getStatusInfo(status) {
    return config.ITEM_STATUS[status] || { text: '未知', class: 'secondary' };
}

// 获取类型信息
function getTypeInfo(type) {
    return config.ITEM_TYPES[type] || { text: '未知', class: 'secondary' };
}

// 获取用户角色信息
function getRoleInfo(role) {
    return config.USER_ROLES[role] || { text: '未知', class: 'secondary' };
}

// 获取用户状态信息
function getUserStatusInfo(status) {
    return config.USER_STATUS[status] || { text: '未知', class: 'secondary' };
}

// 渲染分页
function renderPagination(containerId, data, callback) {
    const container = document.getElementById(containerId);
    const totalPages = Math.ceil(data.total / data.size);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<ul class="pagination">';
    html += `<li class="page-item ${data.page <= 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); ${callback.name}(${data.page - 1})">上一页</a></li>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= data.page - 2 && i <= data.page + 2)) {
            html += `<li class="page-item ${i === data.page ? 'active' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); ${callback.name}(${i})">${i}</a></li>`;
        } else if (i === data.page - 3 || i === data.page + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    html += `<li class="page-item ${data.page >= totalPages ? 'disabled' : ''}"><a class="page-link" href="#" onclick="event.preventDefault(); ${callback.name}(${data.page + 1})">下一页</a></li>`;
    html += '</ul>';
    container.innerHTML = html;
}
