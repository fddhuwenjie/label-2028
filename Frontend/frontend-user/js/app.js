/**
 * 主应用模块
 * 依赖: config.js, utils.js, toast.js, api.js
 */

// 页面初始化
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    loadHomePage();
    setupForms();
});

// 更新导航栏状态
function updateNavbar() {
    const guestNav = document.getElementById('guestNav');
    const loggedNav = document.getElementById('loggedNav');
    const usernameDisplay = document.getElementById('usernameDisplay');

    if (api.user) {
        guestNav.classList.add('d-none');
        loggedNav.classList.remove('d-none');
        usernameDisplay.textContent = api.user.username;
        updateUnreadCount();
    } else {
        guestNav.classList.remove('d-none');
        loggedNav.classList.add('d-none');
    }
}

// 更新未读消息数量
async function updateUnreadCount() {
    if (!api.user) return;
    try {
        const count = await api.getUnreadCount();
        const badge = document.getElementById('unreadBadge');
        if (count > 0) {
            badge.textContent = count;
            badge.classList.remove('d-none');
        } else {
            badge.classList.add('d-none');
        }
    } catch (e) {
        console.error(e);
    }
}

// 页面切换
function showPage(page) {
    const pages = ['home', 'lost', 'found', 'searchResults', 'myItems', 'messages', 'profile', 'itemDetail'];
    pages.forEach(p => {
        document.getElementById(p + 'Page').classList.add('d-none');
    });
    document.getElementById(page + 'Page').classList.remove('d-none');

    // 更新导航栏激活状态
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        const onclick = link.getAttribute('onclick');
        if (onclick) {
            if (page === 'home' && onclick.includes("'home'")) {
                link.classList.add('active');
            } else if (page === 'lost' && onclick.includes("'lost'")) {
                link.classList.add('active');
            } else if (page === 'found' && onclick.includes("'found'")) {
                link.classList.add('active');
            }
        }
    });

    // 加载对应页面数据
    switch(page) {
        case 'home': loadHomePage(); break;
        case 'lost': loadLostPage(); break;
        case 'found': loadFoundPage(); break;
        case 'myItems': loadMyItems(); break;
        case 'messages': loadMessages(); break;
        case 'profile': loadProfile(); break;
        case 'searchResults': loadSearchResults(); break;
    }
}

// 加载首页数据
async function loadHomePage() {
    try {
        const [lostData, foundData] = await Promise.all([
            api.getItems({ type: 0, size: config.HOME_LIST_SIZE }),
            api.getItems({ type: 1, size: config.HOME_LIST_SIZE })
        ]);

        document.getElementById('recentLost').innerHTML = renderItemList(lostData.list, 'lost');
        document.getElementById('recentFound').innerHTML = renderItemList(foundData.list, 'found');
    } catch (e) {
        console.error(e);
    }
}

// 渲染物品列表
function renderItemList(items, type) {
    if (!items || items.length === 0) {
        return '<div class="list-group-item text-muted">暂无数据</div>';
    }
    return items.map(item => `
        <a href="#" class="list-group-item list-group-item-action type-${type}" onclick="showItemDetail(${item.id}, 'home')">
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${escapeHtml(item.title)}</h6>
                <small class="text-muted">${formatDate(item.createTime)}</small>
            </div>
            <p class="mb-1 text-truncate">${escapeHtml(item.description || '')}</p>
            <small><i class="bi bi-geo-alt"></i> ${escapeHtml(item.location || '未知')}</small>
        </a>
    `).join('');
}

// 加载失物列表
async function loadLostPage(page = 1) {
    try {
        const keyword = document.getElementById('lostSearchInput').value;
        const category = document.getElementById('lostSearchCategory').value;
        const data = await api.getItems({ type: 0, keyword, category, page, size: config.PAGE_SIZE });
        document.getElementById('lostList').innerHTML = renderItemCards(data.list, 'lost');
        renderPagination('lostPagination', data, (p) => loadLostPage(p));
    } catch (e) {
        console.error(e);
    }
}

// 加载招领列表
async function loadFoundPage(page = 1) {
    try {
        const keyword = document.getElementById('foundSearchInput').value;
        const category = document.getElementById('foundSearchCategory').value;
        const data = await api.getItems({ type: 1, keyword, category, page, size: config.PAGE_SIZE });
        document.getElementById('foundList').innerHTML = renderItemCards(data.list, 'found');
        renderPagination('foundPagination', data, (p) => loadFoundPage(p));
    } catch (e) {
        console.error(e);
    }
}

// 渲染物品卡片
function renderItemCards(items, fromPage) {
    if (!items || items.length === 0) {
        return '<div class="col-12 text-center text-muted py-5">暂无数据</div>';
    }
    return items.map(item => {
        const typeInfo = getTypeInfo(item.type);
        const categoryIcon = getCategoryIcon(item.category);
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 item-card">
                <div class="card h-100">
                    <div class="card-img-placeholder ${item.type === 0 ? 'lost' : 'found'}">
                        <i class="bi ${categoryIcon}"></i>
                    </div>
                    <div class="card-body">
                        <span class="badge bg-${typeInfo.class}">${typeInfo.text}</span>
                        <h5 class="card-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h5>
                        <p class="card-text text-truncate-2" title="${escapeHtml(item.description || '')}">${escapeHtml(item.description || '暂无描述')}</p>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted"><i class="bi bi-geo-alt"></i> ${escapeHtml(item.location || '未知')}</small>
                            <button class="btn btn-sm btn-primary" onclick="showItemDetail(${item.id}, '${fromPage}')">详情</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 获取分类图标
function getCategoryIcon(category) {
    const icons = {
        'Electronics': 'bi-phone',
        'Card': 'bi-credit-card',
        'Bag': 'bi-bag',
        'Book': 'bi-book',
        'Clothing': 'bi-handbag',
        'Other': 'bi-box'
    };
    return icons[category] || 'bi-box';
}

// 记录详情页来源
let detailFromPage = 'home';

// 显示物品详情
async function showItemDetail(id, fromPage) {
    if (fromPage) {
        detailFromPage = fromPage;
    }
    
    try {
        const item = await api.getItem(id);
        const statusInfo = getStatusInfo(item.status);
        const typeInfo = getTypeInfo(item.type);
        const backPage = detailFromPage || (item.type === 0 ? 'lost' : 'found');
        
        document.getElementById('itemDetail').innerHTML = `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h4 class="mb-0">${escapeHtml(item.title)}</h4>
                    <span class="badge bg-${typeInfo.class}">${typeInfo.text}</span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-8 col-md-7">
                            <p><strong>详细描述：</strong></p>
                            <p>${escapeHtml(item.description || '暂无描述')}</p>
                            <hr>
                            <p><i class="bi bi-tag"></i> <strong>分类：</strong> ${getCategoryName(item.category)}</p>
                            <p><i class="bi bi-geo-alt"></i> <strong>地点：</strong> ${escapeHtml(item.location || '未知')}</p>
                            <p><i class="bi bi-calendar"></i> <strong>时间：</strong> ${formatDate(item.itemTime)}</p>
                            <p><i class="bi bi-person"></i> <strong>发布者：</strong> ${escapeHtml(item.username || '匿名')}</p>
                            <p><i class="bi bi-info-circle"></i> <strong>状态：</strong> <span class="badge bg-${statusInfo.class}">${statusInfo.text}</span></p>
                        </div>
                        <div class="col-lg-4 col-md-5">
                            <div class="card bg-light">
                                <div class="card-body">
                                    <h5>联系方式</h5>
                                    <p><i class="bi bi-person"></i> ${escapeHtml(item.contactName || '未提供')}</p>
                                    <p><i class="bi bi-telephone"></i> ${escapeHtml(item.contactPhone || '未提供')}</p>
                                    ${api.user ? `<button class="btn btn-primary w-100" onclick="showMessageModal(${item.id})"><i class="bi bi-envelope"></i> 发送留言</button>` : '<p class="text-muted">登录后可联系</p>'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-4">
                        <h5><i class="bi bi-lightbulb text-warning"></i> 智能匹配推荐</h5>
                        <p class="text-muted small">根据分类、地点、时间智能匹配可能相关的${item.type === 0 ? '招领' : '失物'}信息</p>
                        <div id="similarItems" class="row">
                            <div class="col-12 text-center text-muted py-3">加载中...</div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button class="btn btn-secondary" onclick="showPage('${backPage}')">返回</button>
                </div>
            </div>
        `;
        showPage('itemDetail');
        loadSimilarItems(id);
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// 加载智能匹配结果
async function loadSimilarItems(itemId) {
    try {
        const items = await api.getSimilarItems(itemId, 4);
        const container = document.getElementById('similarItems');
        if (!items || items.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-muted py-3">暂无匹配结果</div>';
            return;
        }
        container.innerHTML = items.map(item => {
            const typeInfo = getTypeInfo(item.type);
            return `
                <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
                    <div class="card h-100 similar-card" onclick="showItemDetail(${item.id})">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title mb-0" style="font-size:0.9rem; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(item.title)}</h6>
                                <span class="badge bg-${typeInfo.class} ms-2" style="font-size:0.7rem; flex-shrink:0;">${typeInfo.text}</span>
                            </div>
                            <p class="card-text text-muted mb-0" style="font-size:0.75rem"><i class="bi bi-geo-alt"></i> ${escapeHtml(item.location || '未知')}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        document.getElementById('similarItems').innerHTML = '<div class="col-12 text-center text-muted py-3">加载失败</div>';
    }
}

// 加载我的发布
async function loadMyItems(type = null) {
    if (!api.user) {
        showToast('请先登录', 'warning');
        showModal('loginModal');
        return;
    }
    try {
        const params = { size: 20 };
        if (type !== null) params.type = type;
        const data = await api.getMyItems(params);
        
        document.getElementById('myItemsList').innerHTML = data.list.length === 0 
            ? '<div class="col-12 text-center text-muted py-5">暂无数据</div>'
            : data.list.map(item => {
                const statusInfo = getStatusInfo(item.status);
                const typeInfo = getTypeInfo(item.type);
                return `
                    <div class="col-lg-3 col-md-4 col-sm-6 item-card">
                        <div class="card h-100">
                            <div class="card-body">
                                <span class="badge bg-${typeInfo.class} mb-2">${typeInfo.text}</span>
                                <span class="badge bg-${statusInfo.class} mb-2">${statusInfo.text}</span>
                                <h5 class="card-title">${escapeHtml(item.title)}</h5>
                                <p class="card-text text-truncate">${escapeHtml(item.description || '')}</p>
                                <p class="card-text"><small class="text-muted">${formatDate(item.createTime)}</small></p>
                            </div>
                            <div class="card-footer bg-transparent">
                                <button class="btn btn-sm btn-outline-primary" onclick="showItemDetail(${item.id}, 'myItems')">查看</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="deleteMyItem(${item.id})">删除</button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// 切换我的发布 tab
function switchMyItemsTab(element, type) {
    document.querySelectorAll('#myItemsTabs .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    element.classList.add('active');
    loadMyItems(type);
}

// 删除我的物品
async function deleteMyItem(id) {
    showConfirmModal('确定要删除这条记录吗？', async () => {
        try {
            await api.deleteItem(id);
            showToast('删除成功', 'success');
            loadMyItems();
        } catch (e) {
            showToast(e.message, 'error');
        }
    });
}

// 加载消息列表
async function loadMessages() {
    if (!api.user) {
        showToast('请先登录', 'warning');
        showModal('loginModal');
        return;
    }
    try {
        const data = await api.getMessages({ size: 50 });
        document.getElementById('messagesList').innerHTML = data.list.length === 0
            ? '<div class="list-group-item text-muted">暂无消息</div>'
            : data.list.map(msg => `
                <div class="list-group-item ${msg.isRead === 0 && msg.receiverId === api.user.id ? 'message-unread' : ''}" onclick="markMessageRead(${msg.id}, this)">
                    <div class="d-flex w-100 justify-content-between flex-wrap">
                        <h6 class="mb-1">${msg.senderId === api.user.id ? '发给：' + escapeHtml(msg.receiverName) : '来自：' + escapeHtml(msg.senderName)}</h6>
                        <small class="text-muted">${formatDate(msg.createTime)}</small>
                    </div>
                    <p class="mb-1">${escapeHtml(msg.content)}</p>
                    <small class="text-muted">关于：${escapeHtml(msg.itemTitle || '未知物品')}</small>
                </div>
            `).join('');
        updateUnreadCount();
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// 标记消息已读
async function markMessageRead(id, element) {
    try {
        await api.markAsRead(id);
        element.classList.remove('message-unread');
        updateUnreadCount();
    } catch (e) {
        console.error(e);
    }
}

// 加载个人资料
async function loadProfile() {
    if (!api.user) {
        showToast('请先登录', 'warning');
        showModal('loginModal');
        return;
    }
    try {
        const user = await api.getUserInfo();
        document.getElementById('profileUsername').value = user.username;
        document.getElementById('profileRealName').value = user.realName || '';
        document.getElementById('profilePhone').value = user.phone || '';
        document.getElementById('profileEmail').value = user.email || '';
        document.getElementById('profileStudentId').value = user.studentId || '';
        document.getElementById('profileDepartment').value = user.department || '';
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// 搜索物品
function searchItems() {
    const keyword = document.getElementById('searchInput').value;
    const category = document.getElementById('searchCategory').value;
    
    document.getElementById('lostSearchInput').value = keyword;
    document.getElementById('lostSearchCategory').value = category;
    document.getElementById('foundSearchInput').value = keyword;
    document.getElementById('foundSearchCategory').value = category;

    const onLostPage = !document.getElementById('lostPage').classList.contains('d-none');
    const onFoundPage = !document.getElementById('foundPage').classList.contains('d-none');

    if (onLostPage) {
        loadLostPage();
    } else if (onFoundPage) {
        loadFoundPage();
    } else {
        // 默认展示搜索结果页，同时搜索失物和招领
        showPage('searchResults');
    }
}

// 加载搜索结果（同时搜索失物和招领）
async function loadSearchResults() {
    const keyword = document.getElementById('searchInput').value;
    const category = document.getElementById('searchCategory').value;
    try {
        const [lostData, foundData] = await Promise.all([
            api.getItems({ type: 0, keyword, category, size: config.PAGE_SIZE }),
            api.getItems({ type: 1, keyword, category, size: config.PAGE_SIZE })
        ]);
        const hasLost = lostData.list && lostData.list.length > 0;
        const hasFound = foundData.list && foundData.list.length > 0;

        const lostHeader = document.getElementById('searchLostHeader');
        const foundHeader = document.getElementById('searchFoundHeader');
        const noData = document.getElementById('searchNoData');

        if (!hasLost && !hasFound) {
            lostHeader.classList.add('d-none');
            foundHeader.classList.add('d-none');
            document.getElementById('searchLostResults').innerHTML = '';
            document.getElementById('searchFoundResults').innerHTML = '';
            noData.classList.remove('d-none');
        } else {
            noData.classList.add('d-none');
            lostHeader.classList.toggle('d-none', !hasLost);
            foundHeader.classList.toggle('d-none', !hasFound);
            document.getElementById('searchLostResults').innerHTML = hasLost ? renderItemCards(lostData.list, 'searchResults') : '';
            document.getElementById('searchFoundResults').innerHTML = hasFound ? renderItemCards(foundData.list, 'searchResults') : '';
        }
    } catch (e) {
        console.error(e);
    }
}

// 显示发布弹窗
function showPostModal(type) {
    if (!api.user) {
        showToast('请先登录', 'warning');
        showModal('loginModal');
        return;
    }
    document.getElementById('postType').value = type;
    document.getElementById('postModalTitle').textContent = type === 0 ? '发布失物信息' : '发布招领信息';
    document.getElementById('postLocationLabel').innerHTML = type === 0 
        ? '丢失地点 <span class="text-danger">*</span>' 
        : '捡到地点 <span class="text-danger">*</span>';
    document.getElementById('postItemTimeLabel').innerHTML = type === 0 
        ? '丢失时间 <span class="text-danger">*</span>' 
        : '捡到时间 <span class="text-danger">*</span>';
    document.getElementById('postForm').reset();
    showModal('postModal');
}

// 显示留言弹窗
function showMessageModal(itemId) {
    document.getElementById('messageItemId').value = itemId;
    document.getElementById('messageContent').value = '';
    showModal('messageModal');
}

// 退出登录
function logout() {
    api.clearAuth();
    updateNavbar();
    showPage('home');
}
