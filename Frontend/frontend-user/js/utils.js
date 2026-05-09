/**
 * 工具函数模块
 */

// 格式化日期
function formatDate(dateStr) {
    if (!dateStr) return '未知';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// HTML转义，防止XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 手机号校验（中国大陆11位手机号）
function isValidPhone(phone) {
    if (!phone) return true; // 允许为空
    return /^1[3-9]\d{9}$/.test(phone);
}

// 获取分类中文名
function getCategoryName(category) {
    return config.CATEGORIES[category] || category || '未知';
}

// 获取状态信息
function getStatusInfo(status) {
    return config.ITEM_STATUS[status] || { text: '未知', class: 'secondary' };
}

// 获取类型信息
function getTypeInfo(type) {
    return config.ITEM_TYPES[type] || { text: '未知', class: 'secondary' };
}

// 渲染分页
function renderPagination(containerId, data, callback) {
    const container = document.getElementById(containerId);
    const totalPages = Math.ceil(data.total / data.size);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<ul class="pagination justify-content-center">';
    html += `<li class="page-item ${data.page <= 1 ? 'disabled' : ''}"><a class="page-link" onclick="event.preventDefault(); ${data.page > 1 ? `(${callback.toString()})(${data.page - 1})` : ''}">上一页</a></li>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= data.page - 2 && i <= data.page + 2)) {
            html += `<li class="page-item ${i === data.page ? 'active' : ''}"><a class="page-link" onclick="event.preventDefault(); (${callback.toString()})(${i})">${i}</a></li>`;
        } else if (i === data.page - 3 || i === data.page + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    html += `<li class="page-item ${data.page >= totalPages ? 'disabled' : ''}"><a class="page-link" onclick="event.preventDefault(); ${data.page < totalPages ? `(${callback.toString()})(${data.page + 1})` : ''}">下一页</a></li>`;
    html += '</ul>';
    container.innerHTML = html;
}
