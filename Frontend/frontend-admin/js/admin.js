/**
 * 管理后台主逻辑模块
 * 依赖: config.js, utils.js, toast.js, api.js
 */

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    if (getToken() && getCurrentUser() && getCurrentUser().role === 1) {
        showAdminPage();
    }
    setupLoginForm();
});

// 设置登录表单
function setupLoginForm() {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${config.API_BASE}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value
                })
            });
            const data = await response.json();
            if (data.code !== 0) throw new Error(data.message);
            if (data.data.user.role !== 1) throw new Error('需要管理员权限');
            
            setAuth(data.data.token, data.data.user);
            showToast('登录成功', 'success');
            showAdminPage();
        } catch (e) {
            showToast(e.message, 'error');
        }
    });
}

// 显示管理页面
function showAdminPage() {
    document.getElementById('loginPage').classList.add('d-none');
    document.getElementById('adminPage').classList.remove('d-none');
    document.getElementById('adminName').textContent = getCurrentUser().username;
    loadDashboard();
}

// 退出登录
function logout() {
    clearAuth();
    document.getElementById('loginPage').classList.remove('d-none');
    document.getElementById('adminPage').classList.add('d-none');
}

// 切换页面区域
function showSection(section) {
    // 更新侧边栏激活状态
    document.querySelectorAll('.sidebar .nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // 隐藏所有区域
    document.getElementById('dashboardSection').classList.add('d-none');
    document.getElementById('itemsSection').classList.add('d-none');
    document.getElementById('usersSection').classList.add('d-none');
    
    // 显示目标区域
    document.getElementById(section + 'Section').classList.remove('d-none');
    
    // 更新面包屑
    const sectionNames = {
        'dashboard': '数据统计',
        'items': '物品管理',
        'users': '用户管理'
    };
    document.getElementById('breadcrumbCurrent').textContent = sectionNames[section] || section;
    
    // 加载数据
    switch(section) {
        case 'dashboard': loadDashboard(); break;
        case 'items': loadItems(); break;
        case 'users': loadUsers(); break;
    }
}

// 加载统计数据
async function loadDashboard() {
    try {
        const stats = await apiRequest('/admin/stats');
        document.getElementById('statUsers').textContent = stats.userCount || 0;
        document.getElementById('statLost').textContent = stats.lostCount || 0;
        document.getElementById('statFound').textContent = stats.foundCount || 0;
        document.getElementById('statPending').textContent = stats.pendingCount || 0;
        
        // 状态分布
        document.getElementById('statusPending').textContent = stats.pendingCount || 0;
        document.getElementById('statusApproved').textContent = stats.approvedCount || 0;
        document.getElementById('statusRejected').textContent = stats.rejectedCount || 0;
        document.getElementById('statusClaimed').textContent = stats.claimedCount || 0;
        
        // 分类统计
        const categoryStats = stats.categoryStats || [];
        const maxCount = Math.max(...categoryStats.map(c => c.count), 1);
        document.getElementById('categoryStats').innerHTML = categoryStats.length === 0 
            ? '<p class="text-muted text-center py-4">暂无数据</p>'
            : categoryStats.map(c => `
                <div class="category-item">
                    <div class="category-info">
                        <span class="category-name">${getCategoryName(c.category)}</span>
                        <span class="category-count">${c.count}</span>
                    </div>
                    <div class="category-progress">
                        <div class="category-progress-bar" style="width: ${(c.count / maxCount * 100)}%"></div>
                    </div>
                </div>
            `).join('');
    } catch (e) {
        console.error(e);
    }
}

// 加载物品列表
async function loadItems(page = 1) {
    try {
        const params = new URLSearchParams({
            page,
            size: 10,
            type: document.getElementById('filterType').value,
            status: document.getElementById('filterStatus').value,
            keyword: document.getElementById('filterKeyword').value
        });
        
        const data = await apiRequest(`/admin/items?${params}`);
        const statusLabels = ['待审核', '已通过', '已拒绝', '已认领'];
        const statusClasses = ['warning', 'success', 'danger', 'info'];
        
        document.getElementById('itemsTable').innerHTML = data.list.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.title)}</td>
                <td><span class="badge bg-${item.type === 0 ? 'danger' : 'success'}">${item.type === 0 ? '失物' : '招领'}</span></td>
                <td>${getCategoryName(item.category)}</td>
                <td>${escapeHtml(item.username || '-')}</td>
                <td><span class="badge bg-${statusClasses[item.status]}">${statusLabels[item.status]}</span></td>
                <td>${formatDate(item.createTime)}</td>
                <td>
                    <div class="btn-group btn-group-sm">
                        ${item.status === 0 ? `
                            <button class="btn btn-success" onclick="updateItemStatus(${item.id}, 1)">通过</button>
                            <button class="btn btn-danger" onclick="updateItemStatus(${item.id}, 2)">拒绝</button>
                        ` : ''}
                        <button class="btn btn-outline-danger" onclick="deleteItem(${item.id})">删除</button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        renderPagination('itemsPagination', data, loadItems);
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// 更新物品状态
async function updateItemStatus(id, status) {
    try {
        await apiRequest(`/admin/item/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        showToast('状态更新成功', 'success');
        loadItems();
        loadDashboard();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// 删除物品
async function deleteItem(id) {
    showConfirmModal('确定要删除这条记录吗？', async () => {
        try {
            await apiRequest(`/admin/item/${id}`, { method: 'DELETE' });
            showToast('删除成功', 'success');
            loadItems();
        } catch (e) {
            showToast(e.message, 'error');
        }
    });
}

// 加载用户列表
async function loadUsers(page = 1) {
    try {
        const params = new URLSearchParams({
            page,
            size: 10,
            keyword: document.getElementById('userKeyword').value
        });
        
        const data = await apiRequest(`/admin/users?${params}`);
        
        document.getElementById('usersTable').innerHTML = data.list.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${escapeHtml(u.username)}</td>
                <td>${escapeHtml(u.realName || '-')}</td>
                <td>${escapeHtml(u.phone || '-')}</td>
                <td>${escapeHtml(u.studentId || '-')}</td>
                <td><span class="badge bg-${u.role === 1 ? 'primary' : 'secondary'}">${u.role === 1 ? '管理员' : '普通用户'}</span></td>
                <td><span class="badge bg-${u.status === 1 ? 'success' : 'danger'}">${u.status === 1 ? '正常' : '禁用'}</span></td>
                <td>${formatDate(u.createTime)}</td>
                <td>
                    ${u.role !== 1 ? `
                        <button class="btn btn-sm btn-${u.status === 1 ? 'warning' : 'success'}" onclick="updateUserStatus(${u.id}, ${u.status === 1 ? 0 : 1})">
                            ${u.status === 1 ? '禁用' : '启用'}
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `).join('');
        
        renderPagination('usersPagination', data, loadUsers);
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// 更新用户状态
async function updateUserStatus(id, status) {
    try {
        await apiRequest(`/admin/user/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
        showToast('状态更新成功', 'success');
        loadUsers();
    } catch (e) {
        showToast(e.message, 'error');
    }
}
