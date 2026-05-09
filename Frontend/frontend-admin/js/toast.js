/**
 * 管理后台 Toast 提示模块
 */

// Toast 提示函数
function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    const toastConfig = {
        success: { icon: 'bi-check-circle-fill', bg: 'bg-success', title: '成功' },
        error: { icon: 'bi-x-circle-fill', bg: 'bg-danger', title: '错误' },
        warning: { icon: 'bi-exclamation-circle-fill', bg: 'bg-warning', title: '警告' },
        info: { icon: 'bi-info-circle-fill', bg: 'bg-primary', title: '提示' }
    };
    const cfg = toastConfig[type] || toastConfig.info;
    
    const toastId = 'toast_' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${cfg.bg} text-white">
                <i class="bi ${cfg.icon} me-2"></i>
                <strong class="me-auto">${cfg.title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastEl = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3000 });
    bsToast.show();
    
    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

// 确认弹窗函数
let confirmCallback = null;

function showConfirmModal(message, callback) {
    confirmCallback = callback;
    document.getElementById('confirmMessage').textContent = message;
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}

function confirmAction() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
    modal.hide();
    if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
    }
}
