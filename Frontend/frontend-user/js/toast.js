/**
 * Toast 提示模块
 */

// Toast 提示函数
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    
    // 设置图标和标题
    const toastConfig = {
        success: { icon: 'bi-check-circle-fill text-success', title: '成功' },
        error: { icon: 'bi-x-circle-fill text-danger', title: '错误' },
        warning: { icon: 'bi-exclamation-circle-fill text-warning', title: '警告' },
        info: { icon: 'bi-info-circle-fill text-primary', title: '提示' }
    };
    
    const cfg = toastConfig[type] || toastConfig.info;
    toastIcon.className = `bi ${cfg.icon} me-2`;
    toastTitle.textContent = cfg.title;
    toastBody.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
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

// 显示弹窗
function showModal(modalId) {
    // 清空表单
    if (modalId === 'loginModal') {
        document.getElementById('loginForm').reset();
    } else if (modalId === 'registerModal') {
        document.getElementById('registerForm').reset();
    }
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

// 隐藏弹窗
function hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
}
