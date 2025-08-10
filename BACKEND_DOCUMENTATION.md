# 📚 BACKEND DOCUMENTATION - Web_QLCVN

## 🏗️ KIẾN TRÚC TỔNG QUAN

### Tech Stack
- **Framework**: Laravel 11.x
- **Authentication**: Laravel Sanctum 
- **Database**: MySQL/SQLite
- **CORS**: fruitcake/laravel-cors
- **Email**: Laravel Mail + Notifications
- **Crawling**: Guzzle HTTP Client

### Architecture Pattern
- **MVC** (Model-View-Controller)
- **Repository Pattern** (trong Controllers)
- **Service Layer** (InstagramCrawlerService, ShopeeScraperService)
- **Middleware-based Authentication**

---

## 🗃️ CẤU TRÚC DATABASE

### 1. Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'member', -- admin, leader, member
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### 2. Projects Table
```sql
CREATE TABLE projects (
    id BIGINT UNSIGNED PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    owner_id BIGINT UNSIGNED, -- FK to users
    background_url VARCHAR(255) NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Tasks Table
```sql
CREATE TABLE tasks (
    id BIGINT UNSIGNED PRIMARY KEY,
    project_id BIGINT UNSIGNED, -- FK to projects
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('pending', 'in_progress', 'done') DEFAULT 'pending',
    deadline DATE NULL,
    assigned_to BIGINT UNSIGNED NULL, -- FK to users (legacy)
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);
```

### 4. Pivot Tables

#### project_user (Many-to-Many: Projects ↔ Users)
```sql
CREATE TABLE project_user (
    id BIGINT UNSIGNED PRIMARY KEY,
    project_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    role VARCHAR(255) DEFAULT 'member', -- leader, member
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### task_user (Many-to-Many: Tasks ↔ Users)
```sql
CREATE TABLE task_user (
    id BIGINT UNSIGNED PRIMARY KEY,
    task_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5. Comments Table
```sql
CREATE TABLE comments (
    id BIGINT UNSIGNED PRIMARY KEY,
    task_id BIGINT UNSIGNED,
    user_id BIGINT UNSIGNED,
    content TEXT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 6. Instagram Posts Table
```sql
CREATE TABLE instagram_posts (
    id BIGINT UNSIGNED PRIMARY KEY,
    title VARCHAR(255) NULL,
    caption TEXT NULL,
    instagram_url VARCHAR(255) NOT NULL UNIQUE,
    image_urls JSON NOT NULL, -- Array of image URLs
    price DECIMAL(10,2) DEFAULT 0,
    instagram_id VARCHAR(255) NULL,
    username VARCHAR(255) NULL,
    likes_count INT DEFAULT 0,
    posted_at DATETIME NULL,
    status ENUM('active', 'sold', 'hidden') DEFAULT 'active',
    user_id BIGINT UNSIGNED, -- Who added this post
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 7. Shopee Products Table
```sql
CREATE TABLE shopee_products (
    id BIGINT UNSIGNED PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NULL,
    discount_percentage INT DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0,
    sold_count INT DEFAULT 0,
    image_url VARCHAR(500) NULL,
    product_url VARCHAR(500) NOT NULL UNIQUE,
    shop_name VARCHAR(255) NULL,
    shop_location VARCHAR(255) NULL,
    description TEXT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    user_id BIGINT UNSIGNED, -- Who added this product
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 8. Support Tables
- `email_verifications` - Email verification codes
- `personal_access_tokens` - Sanctum tokens
- `password_reset_tokens` - Password reset tokens
- `sessions` - User sessions
- `cache` & `cache_locks` - Cache system
- `jobs`, `job_batches`, `failed_jobs` - Queue system

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Sanctum Configuration
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1,127.0.0.1:5173')),

// Guards
'guards' => [
    'web' => ['driver' => 'session', 'provider' => 'users'],
    'api' => ['driver' => 'sanctum', 'provider' => 'users'],
]
```

### Authentication Flow
1. **Register**: `POST /register` → Send verification code → `POST /verify-email`
2. **Login**: `POST /login` → Get Sanctum token
3. **Logout**: `POST /logout` → Delete current token
4. **Token Refresh**: Auto-handled by Sanctum

### Role-based Authorization
- **admin**: Toàn quyền truy cập
- **leader**: Quản lý projects, tasks
- **member**: Chỉ truy cập projects được gán

```php
// Middleware usage
Route::middleware('role:admin')->get('/admin-only', ...);
Route::middleware('role:admin,leader')->get('/manage-projects', ...);
```

---

## 🛣️ API ROUTES STRUCTURE

### Public Routes (No Authentication)
```php
GET  /sanctum/csrf-cookie     # CSRF token
POST /register               # User registration 
POST /login                  # User login
POST /verify-email           # Email verification
POST /resend-code           # Resend verification code
GET  /test/instagram        # Test Instagram crawler
```

### Protected Routes (auth:sanctum)
```php
# Authentication
POST /logout                 # User logout

# Projects Management
GET    /projects             # List user's projects
POST   /projects             # Create new project  
GET    /projects/{id}        # Get project details
PUT    /projects/{id}        # Update project
DELETE /projects/{id}        # Delete project
POST   /projects/{id}/members      # Add member to project
DELETE /projects/{id}/members/{userId} # Remove member
GET    /projects/{id}/members      # Get project members

# Tasks Management  
GET    /projects/{projectId}/tasks  # Get project tasks
POST   /projects/{projectId}/tasks  # Create new task
GET    /tasks/{id}                  # Get task details
PUT    /tasks/{id}                  # Update task
DELETE /tasks/{id}                  # Delete task
GET    /my-tasks                    # Get current user's assigned tasks

# Comments
GET    /tasks/{taskId}/comments     # Get task comments
POST   /tasks/{taskId}/comments     # Add comment
DELETE /comments/{id}               # Delete comment

# Dashboard & Analytics
GET /dashboard                      # Dashboard data
GET /dashboard/tasks               # Task analytics

# User Management
GET /user                          # Current user info
GET /account                       # Account details
PUT /account                       # Update profile
POST /users                        # Create user (admin)
GET /users/all                     # List all users (admin)

# Statistics
GET /projects/count                # Projects count
GET /tasks/count                   # Tasks count  
GET /comments/count                # Comments count

# Instagram Crawler
GET    /instagram-posts            # List Instagram posts
POST   /instagram-posts/crawl      # Crawl Instagram post
GET    /instagram-posts/{post}     # Get post details
PUT    /instagram-posts/{post}     # Update post
DELETE /instagram-posts/{post}     # Delete post

# Shopee Crawler  
GET    /shopee-products            # List Shopee products
POST   /shopee-products/crawl      # Crawl Shopee product
GET    /shopee-products/{product}  # Get product details
PUT    /shopee-products/{product}  # Update product
DELETE /shopee-products/{product}  # Delete product
```

---

## 🏗️ MODELS & RELATIONSHIPS

### User Model
```php
class User extends Authenticatable
{
    // Relationships
    public function projects()           # belongsToMany(Project) - Projects owned
    public function tasksAssigned()     # belongsToMany(Task, 'task_user') - Assigned tasks
    public function tasks()             # hasMany(Task, 'assigned_to') - Legacy assigned tasks  
    public function comments()          # hasMany(Comment)
}
```

### Project Model
```php
class Project extends Model  
{
    // Relationships
    public function owner()             # belongsTo(User, 'owner_id')
    public function users()             # belongsToMany(User) - Project members
    public function tasks()             # hasMany(Task)
    
    // Scopes (có rất nhiều scope methods)
    public function scopeForUser($query, $userId)
    public function scopeWithOwnerTasksAndUsers($query)
    // ... many more scopes
}
```

### Task Model
```php
class Task extends Model
{
    // Relationships  
    public function project()           # belongsTo(Project)
    public function assignedUser()      # belongsTo(User, 'assigned_to') - Legacy
    public function assignedUsers()     # belongsToMany(User, 'task_user') - Current
    public function comments()          # hasMany(Comment)
}
```

### Comment Model
```php
class Comment extends Model
{
    // Relationships
    public function user()              # belongsTo(User)
    public function task()              # belongsTo(Task)
    
    // Scopes
    public function scopeForTask($query, $taskId)
    public function scopeWithUserAndTask($query)
}
```

---

## 🎛️ CONTROLLERS LOGIC

### AuthController
```php
class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validate input
        // 2. Delete old verification codes
        // 3. Generate 6-digit code
        // 4. Save to email_verifications table
        // 5. Send email notification
        // 6. Return success message
    }
    
    public function login(Request $request)  
    {
        // 1. Validate credentials
        // 2. Check user exists & password correct
        // 3. Create Sanctum token
        // 4. Return token + user data
    }
    
    public function logout(Request $request)
    {
        // 1. Delete current access token
        // 2. Return success message
    }
    
    public function verifyEmail(Request $request)
    {
        // 1. Validate email & code
        // 2. Check verification record exists & not expired
        // 3. Create user account
        // 4. Generate token
        // 5. Clean up verification record
    }
}
```

### ProjectController  
```php
class ProjectController extends Controller
{
    public function index()
    {
        // 1. Get authenticated user
        // 2. If admin → return all projects
        // 3. Else → return projects where user is owner OR member
    }
    
    public function store(Request $request)
    {
        // 1. Validate project data
        // 2. Create project with current user as owner
        // 3. Auto-add owner as project member with 'leader' role
    }
    
    public function show($id)
    {
        // 1. Find project with owner & users
        // 2. Check if user has access (owner or member)
        // 3. Return project details
    }
    
    public function addMember(Request $request, $id)
    {
        // 1. Find project & validate ownership
        // 2. Find user by email
        // 3. Check if user already member
        // 4. Add user with 'member' role
    }
}
```

### TaskController
```php
class TaskController extends Controller  
{
    public function index($projectId)
    {
        // 1. Find project with members
        // 2. Check user access (owner or member)
        // 3. Return tasks with assigned users
    }
    
    public function store(Request $request, $projectId)
    {
        // 1. Validate task data
        // 2. Check project access
        // 3. Create task
        // 4. Assign users via pivot table
    }
    
    public function myTasks()
    {
        // 1. Get current user
        // 2. Find tasks assigned via task_user pivot table
        // 3. Include project_id for navigation
        // 4. Return with assignedUsers relationship
    }
    
    public function update(Request $request, $id)
    {
        // 1. Find task with project
        // 2. Check user has access to project
        // 3. Update task fields
        // 4. Sync assigned users
    }
}
```

### DashboardController
```php
class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Get authenticated user
        // 2. Gather task summary (pending, in_progress, done counts)
        // 3. Gather project summary 
        // 4. Get recent activities
        // 5. Return comprehensive dashboard data
    }
    
    private function getUserProjects($userId)
    {
        // Get projects where user is owner OR member
    }
    
    private function getTaskSummary($userId, $today)
    {
        // Count tasks by status for user
        // Include overdue tasks count
    }
}
```

### Instagram/Shopee Controllers
```php
class InstagramPostController extends Controller
{
    public function crawl(Request $request)
    {
        // 1. Validate Instagram URL
        // 2. Use InstagramCrawlerService to extract data
        // 3. Save to database with current user_id
        // 4. Return crawled data
    }
}

class ShopeeProductController extends Controller  
{
    public function crawl(Request $request)
    {
        // 1. Validate Shopee URL
        // 2. Use ShopeeScraperService to extract data
        // 3. Save to database with current user_id
        // 4. Return crawled data
    }
}
```

---

## 🔧 SERVICES & UTILITIES

### InstagramCrawlerService
```php
class InstagramCrawlerService
{
    public function crawlPost($url)
    {
        // 1. Parse Instagram URL
        // 2. Extract post ID
        // 3. Use Instagram Graph API or web scraping
        // 4. Extract: images, caption, likes, username
        // 5. Return structured data
        // Note: Currently returns mock data due to Instagram restrictions
    }
}
```

### ShopeeScraperService  
```php
class ShopeeScraperService
{
    public function scrapeProduct($url)
    {
        // 1. Parse Shopee URL to extract shop & item IDs
        // 2. Make HTTP request to Shopee API
        // 3. Extract: title, price, images, rating, shop info
        // 4. Handle rate limiting & errors
        // 5. Return structured product data
    }
}
```

### RoleMiddleware
```php
class RoleMiddleware
{
    public function handle($request, Closure $next, ...$roles)
    {
        // 1. Check if user is authenticated
        // 2. Check if user role is in allowed roles
        // 3. Return 403 if not authorized
    }
}
```

---

## 📧 NOTIFICATIONS & MAIL

### Email Verification System
```php
class SendEmailVerificationCode extends Notification
{
    public function via($notifiable): array
    {
        return ['mail'];
    }
    
    public function toMail($notifiable): MailMessage
    {
        // Send verification code via email
        // Subject: "Mã xác minh tài khoản"
        // Body: Contains 6-digit verification code
    }
}
```

### Email Configuration
- **Driver**: SMTP/Mail
- **Templates**: Blade-based email templates
- **Queue**: Supports queued email sending

---

## ⚙️ CONFIGURATION & MIDDLEWARE

### CORS Configuration
```php
// config/cors.php
'allowed_origins' => ['*'], // For development
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### Middleware Stack
```php
// API Middleware
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],

// Custom Middleware
'role' => \App\Http\Middleware\RoleMiddleware::class,
```

### Environment Variables
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,127.0.0.1:5173

# Mail  
MAIL_MAILER=smtp
MAIL_HOST=your_smtp_host
MAIL_PORT=587
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
```

---

## 🔍 TESTING & DEBUGGING

### Available Test Classes
- `AuthenticationTest` - Authentication flow testing
- `ProfileUpdateTest` - Profile management testing

### Debugging Tools
- Laravel Telescope (if installed)
- Query logging
- Error logging in `storage/logs/`

### API Testing
- All endpoints return JSON responses
- Consistent error handling with HTTP status codes
- Request/Response validation

---

## 🚀 DEPLOYMENT CONSIDERATIONS

### Production Setup
1. **Environment**: Set `APP_ENV=production`
2. **Debug**: Set `APP_DEBUG=false`  
3. **Cache**: Run `php artisan config:cache`
4. **Database**: Run migrations `php artisan migrate`
5. **Storage**: Link storage `php artisan storage:link`
6. **Queue**: Set up queue workers for email sending

### Security
- Sanctum tokens for API authentication
- CORS properly configured for production domains
- Rate limiting on authentication endpoints
- Password hashing with bcrypt
- SQL injection protection via Eloquent ORM

### Performance
- Database indexing on foreign keys
- Query optimization with Eloquent relationships
- Caching support (Redis/File)
- Queue system for background tasks

---

## 📝 API RESPONSE FORMATS

### Success Response
```json
{
    "success": true,
    "data": { /* response data */ },
    "message": "Success message"
}
```

### Error Response  
```json
{
    "success": false,
    "message": "Error description",
    "errors": { /* validation errors */ }
}
```

### Authentication Response
```json
{
    "token": "sanctum_token_here",
    "user": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "role": "member"
    }
}
```

---

## 🔗 FRONTEND INTEGRATION NOTES

### Required Headers
```javascript
// For authenticated requests
headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

// For CORS
withCredentials: true
```

### Token Management
- Store token in localStorage: `localStorage.setItem('token', token)`
- Include in all API requests
- Handle token expiration (401 responses)
- Implement automatic logout on token expiry

### Task Assignment Logic
- Tasks use **task_user** pivot table (many-to-many)
- Legacy **assigned_to** field still exists but not actively used
- Frontend should use `assignedUsers` relationship data

---

Đây là documentation chi tiết về toàn bộ logic backend của hệ thống. Tất cả các chức năng đã được implement và hoạt động ổn định.
