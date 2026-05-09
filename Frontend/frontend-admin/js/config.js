/**
 * 管理后台配置文件
 * 支持通过环境变量或手动配置来设置API地址
 */
const config = {
    // API基础地址 - 优先使用环境变量，否则根据当前域名自动推断
    API_BASE: (function() {
        // 1. 检查是否有全局配置（可通过外部脚本注入）
        if (window.APP_CONFIG && window.APP_CONFIG.API_BASE) {
            return window.APP_CONFIG.API_BASE;
        }
        
        // 2. 根据当前环境自动推断
        const hostname = window.location.hostname;
        
        // 本地开发环境
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'http://localhost:8028/api';
        }
        
        // Docker环境 - 使用相对路径，由nginx代理
        // 生产环境 - 使用相对路径
        return '/api';
    })(),
    
    // 分页配置
    PAGE_SIZE: 10,
    
    // 物品分类
    CATEGORIES: {
        'Electronics': '电子产品',
        'Card': '证件卡片',
        'Bag': '箱包',
        'Book': '书籍',
        'Clothing': '衣物',
        'Other': '其他'
    },
    
    // 物品状态
    ITEM_STATUS: {
        0: { text: '待审核', class: 'warning' },
        1: { text: '已通过', class: 'success' },
        2: { text: '已拒绝', class: 'danger' },
        3: { text: '已认领', class: 'info' }
    },
    
    // 物品类型
    ITEM_TYPES: {
        0: { text: '失物', class: 'danger' },
        1: { text: '招领', class: 'success' }
    },
    
    // 用户角色
    USER_ROLES: {
        0: { text: '普通用户', class: 'secondary' },
        1: { text: '管理员', class: 'primary' }
    },
    
    // 用户状态
    USER_STATUS: {
        0: { text: '禁用', class: 'danger' },
        1: { text: '正常', class: 'success' }
    }
};

// 冻结配置对象，防止意外修改
Object.freeze(config);
Object.freeze(config.CATEGORIES);
Object.freeze(config.ITEM_STATUS);
Object.freeze(config.ITEM_TYPES);
Object.freeze(config.USER_ROLES);
Object.freeze(config.USER_STATUS);
