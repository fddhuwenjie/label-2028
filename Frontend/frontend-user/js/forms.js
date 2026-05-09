/**
 * 表单处理模块
 * 依赖: config.js, utils.js, toast.js, api.js, app.js
 */

// 设置表单事件
function setupForms() {
    // 登录表单
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.login(
                document.getElementById('loginUsername').value,
                document.getElementById('loginPassword').value
            );
            hideModal('loginModal');
            updateNavbar();
            loadHomePage();
            showToast('登录成功', 'success');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    // 注册表单
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('regPassword').value;
        if (password.length < 6) {
            showToast('密码长度不能少于6位', 'warning');
            return;
        }
        const phone = document.getElementById('regPhone').value;
        if (phone && !isValidPhone(phone)) {
            showToast('请输入正确的手机号', 'warning');
            return;
        }
        try {
            await api.register({
                username: document.getElementById('regUsername').value,
                password: document.getElementById('regPassword').value,
                realName: document.getElementById('regRealName').value,
                phone: phone
            });
            showToast('注册成功！请登录', 'success');
            hideModal('registerModal');
            showModal('loginModal');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    // 发布物品表单
    document.getElementById('postForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const contactPhone = document.getElementById('postContactPhone').value;
        if (!contactPhone) {
            showToast('请填写联系电话', 'warning');
            return;
        }
        if (!isValidPhone(contactPhone)) {
            showToast('请输入正确的联系电话', 'warning');
            return;
        }
        try {
            let itemTime = document.getElementById('postItemTime').value;
            if (itemTime) {
                itemTime = itemTime.replace('T', ' ') + ':00';
            }
            await api.createItem({
                type: parseInt(document.getElementById('postType').value),
                title: document.getElementById('postTitle').value,
                category: document.getElementById('postCategory').value,
                description: document.getElementById('postDescription').value,
                location: document.getElementById('postLocation').value,
                itemTime: itemTime,
                contactName: document.getElementById('postContactName').value,
                contactPhone: contactPhone
            });
            showToast('发布成功！等待管理员审核', 'success');
            hideModal('postModal');
            loadHomePage();
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    // 留言表单
    document.getElementById('messageForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.sendMessage(
                parseInt(document.getElementById('messageItemId').value),
                document.getElementById('messageContent').value
            );
            showToast('留言发送成功！', 'success');
            hideModal('messageModal');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    // 个人资料表单
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('profilePhone').value;
        if (phone && !isValidPhone(phone)) {
            showToast('请输入正确的手机号', 'warning');
            return;
        }
        try {
            await api.updateProfile({
                realName: document.getElementById('profileRealName').value,
                phone: phone,
                email: document.getElementById('profileEmail').value,
                studentId: document.getElementById('profileStudentId').value,
                department: document.getElementById('profileDepartment').value
            });
            showToast('保存成功！', 'success');
        } catch (e) {
            showToast(e.message, 'error');
        }
    });

    // 修改密码表单
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        if (newPassword.length < 6) {
            showToast('新密码长度不能少于6位', 'warning');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast('两次输入的密码不一致', 'warning');
            return;
        }
        try {
            await api.updatePassword(
                document.getElementById('oldPassword').value,
                newPassword
            );
            showToast('密码修改成功！请重新登录', 'success');
            logout();
        } catch (e) {
            showToast(e.message, 'error');
        }
    });
}
