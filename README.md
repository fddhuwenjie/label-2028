# 校园失物招领系统

基于 SSM（Spring + Spring MVC + MyBatis）+ Bootstrap 的校园失物招领管理系统。

## How to Run

### Docker 启动（推荐）

```bash
# 启动所有服务
docker compose up --build -d

# 查看日志
docker compose logs -f

# 停止服务
docker compose down

# 停止并删除数据卷
docker compose down -v
```

### 本地启动

**环境要求：**
- JDK 11+
- Maven 3.6+
- MySQL 8.0+
- Tomcat 9.0+

**1. 启动 MySQL 数据库**

创建数据库并执行初始化脚本：
```sql
CREATE DATABASE lost_found DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

然后执行 `Backend/src/main/resources/schema.sql` 初始化表结构和测试数据。

**2. 构建后端 WAR 包**

```bash
cd Backend

# 修改数据库配置（如需要）
# 编辑 src/main/resources/jdbc.properties 中的数据库连接信息

# 构建 WAR 包
mvn clean package -DskipTests
```

**3. 部署到 Tomcat**

将 `Backend/target/lost-found.war` 复制到 Tomcat 的 `webapps` 目录，启动 Tomcat。

后端默认运行在 http://localhost:8080

**4. 启动前端**

前端是纯静态文件，可以用任意静态服务器启动：

```bash
# 用户前端
cd Frontend/frontend-user
python -m http.server 8081
# 或
npx serve -p 8081

# 管理后台
cd Frontend/frontend-admin
python -m http.server 8082
# 或
npx serve -p 8082
```

**注意：** 本地启动时，前端会自动检测环境并配置API地址。如果自动检测不正确，可以通过以下方式手动配置：

方式一：在HTML中注入配置（推荐）
```html
<script>
  window.APP_CONFIG = { API_BASE: 'http://localhost:8080/api' };
</script>
```

方式二：修改配置文件
编辑 `Frontend/frontend-user/js/config.js` 和 `Frontend/frontend-admin/js/config.js` 中的 `API_BASE` 配置。

## Services

| 服务 | 地址 | 说明 |
|------|------|------|
| 用户前端 | http://localhost:8081 | 用户浏览、发布失物招领信息 |
| 管理后台 | http://localhost:8082 | 管理员审核、统计、用户管理 |
| 后端 API | http://localhost:8028 | RESTful API 服务（Docker）|
| MySQL | localhost:3028 | 数据库服务（Docker）|

## 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | 123456 |
| 普通用户 | testuser | 123456 |

## 题目内容

我来帮你设计一个完整的 校园失物招领系统 。这个系统将包含完整的前后端功能。 
一、项目规划 
系统架构 
前端 ：HTML + CSS + JavaScript + Bootstrap 
后端 ：Spring + Spring MVC + MyBatis (SSM) 
数据库 ：MySQL 
服务器 ：Tomcat 
功能模块 
用户模块 ：注册、登录、个人信息管理 
失物发布模块 ：发布丢失物品信息 
招领发布模块 ：发布捡到物品信息 
搜索匹配模块 ：搜索物品、智能匹配 
留言交流模块 ：用户间留言沟通 
后台管理模块 ：审核、统计、用户管理

### 系统架构
- 前端：HTML + CSS + JavaScript + Bootstrap
- 后端：SSM（Spring + Spring MVC + MyBatis）
- 数据库：MySQL
- 容器化：Docker + Docker Compose（Tomcat 部署）

### 功能模块
1. **用户模块**：注册、登录、个人信息管理
2. **失物发布模块**：发布丢失物品信息
3. **招领发布模块**：发布捡到物品信息
4. **搜索匹配模块**：搜索物品、分类筛选
5. **留言交流模块**：用户间留言沟通
6. **后台管理模块**：审核、统计、用户管理

### API 接口

**用户接口**
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/info` - 获取用户信息
- `PUT /api/user/update` - 更新个人信息
- `PUT /api/user/password` - 修改密码

**物品接口**
- `GET /api/item/list` - 物品列表（公开）
- `GET /api/item/{id}` - 物品详情（公开）
- `GET /api/item/my` - 我的物品
- `POST /api/item` - 发布物品
- `PUT /api/item/{id}` - 更新物品
- `DELETE /api/item/{id}` - 删除物品

**留言接口**
- `GET /api/message/list` - 留言列表
- `GET /api/message/unread` - 未读数量
- `POST /api/message` - 发送留言
- `PUT /api/message/read/{id}` - 标记已读

**管理接口**
- `GET /api/admin/stats` - 统计数据
- `GET /api/admin/users` - 用户列表
- `PUT /api/admin/user/{id}/status` - 禁用/启用用户
- `GET /api/admin/items` - 所有物品
- `PUT /api/admin/item/{id}/status` - 审核物品
- `DELETE /api/admin/item/{id}` - 删除物品

## 项目结构

```
.
├── Backend/                 # SSM 后端
│   ├── src/main/java/      # Java 源码
│   ├── src/main/resources/ # 配置文件
│   │   ├── applicationContext.xml  # Spring 核心配置
│   │   ├── spring-mvc.xml          # Spring MVC 配置
│   │   ├── mybatis-config.xml      # MyBatis 配置
│   │   ├── jdbc.properties         # 数据库配置
│   │   └── mapper/                 # MyBatis Mapper XML
│   ├── src/test/java/      # 单元测试
│   ├── src/main/webapp/    # Web 资源
│   │   └── WEB-INF/web.xml # Web 配置
│   ├── Dockerfile
│   ├── pom.xml
│   └── settings.xml        # Maven 镜像配置
├── Frontend/               # 前端
│   ├── frontend-user/      # 用户前端
│   │   ├── css/
│   │   ├── js/
│   │   │   ├── config.js       # 配置文件
│   │   │   ├── utils.js        # 工具函数
│   │   │   ├── toast.js        # 提示组件
│   │   │   ├── api.js          # API 请求
│   │   │   ├── app.js          # 主应用
│   │   │   └── forms.js        # 表单处理
│   │   ├── index.html
│   │   └── Dockerfile
│   └── frontend-admin/     # 管理后台
│       ├── css/
│       ├── js/
│       │   ├── config.js       # 配置文件
│       │   ├── utils.js        # 工具函数
│       │   ├── toast.js        # 提示组件
│       │   ├── api.js          # API 请求
│       │   └── admin.js        # 主应用
│       ├── index.html
│       └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

## 运行测试

```bash
cd Backend
mvn test
```
