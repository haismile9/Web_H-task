# 🔄 TASK TO PROJECT NAVIGATION LOGIC

## 📋 TỔNG QUAN

Khi user click vào một task ở trang `/my-tasks`, hệ thống sẽ tự động chuyển hướng đến trang chi tiết project tương ứng (`/projects/{id}`). Điều này cho phép user xem context đầy đủ của task trong project và có thể thao tác với TaskBoard.

---

## 🏗️ KIẾN TRÚC IMPLEMENTATION

### 1. Backend API Structure

#### Task Data Model
```php
// Task Model includes project_id
class Task extends Model 
{
    protected $fillable = [
        'project_id',    // 🎯 Key field for navigation
        'title',
        'description', 
        'status',
        'deadline',
        'assigned_to',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
```

#### MyTasks API Response
```php
// GET /my-tasks returns:
{
    "tasks": [
        {
            "id": 1,
            "title": "Task Title",
            "description": "Task Description", 
            "status": "pending",
            "deadline": "2024-12-31",
            "project_id": 5,           // 🎯 Essential for navigation
            "assignedUsers": [...]
        }
    ]
}
```

### 2. Frontend Navigation Logic

#### MyTasks Component Structure
```tsx
// src/pages/MyTasks.tsx
const MyTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);

    // Each task card is wrapped in Link component
    {tasks.map(task => (
        <Link
            key={task.id}
            to={`/projects/${task.project_id}`}    // 🎯 Navigate to project
            className="task-card-link"
        >
            <TaskCard task={task} />
        </Link>
    ))}
};
```

#### Router Configuration
```tsx
// src/routers/AppRouter.tsx
<Route path="projects/:id" element={<ProjectDetails />} />
<Route path="my-tasks" element={<MyTasks />} />
```

### 3. Project Details Page

#### ProjectDetails Component
```tsx
// src/pages/ProjectDetails.tsx
const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const projectId = parseInt(id!);

    // Load project data
    const { project, loading, error } = useProjectDetails(projectId);

    return (
        <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            
            {/* 🎯 TaskBoard shows all tasks in project */}
            <TaskBoard projectId={projectId} />
        </div>
    );
};
```

#### TaskBoard Integration
```tsx
// src/components/TaskBoard.tsx  
const TaskBoard: React.FC<{ projectId: number }> = ({ projectId }) => {
    // Load all tasks for this project
    useEffect(() => {
        const fetchTasks = async () => {
            const res = await API.get(`/projects/${projectId}/tasks`);
            // Group tasks by status (pending, in_progress, done)
            const grouped = groupTasksByStatus(res.data.tasks);
            setColumns(grouped);
        };
    }, [projectId]);

    // Drag & drop functionality
    // Task editing capabilities  
    // Member assignment
};
```

---

## 🔄 USER FLOW WALKTHROUGH

### Step 1: User Views My Tasks
```
User navigates to: /my-tasks
↓
MyTasks component fetches: GET /my-tasks
↓ 
Backend returns tasks with project_id
↓
Frontend renders task cards as clickable Links
```

### Step 2: User Clicks on Task
```
User clicks task card
↓
React Router navigates to: /projects/{project_id}
↓
ProjectDetails component loads
↓
useParams extracts project ID from URL
```

### Step 3: Project Details Loads
```
ProjectDetails fetches: GET /projects/{id}
↓
Backend returns project info + members
↓
TaskBoard component fetches: GET /projects/{id}/tasks
↓
Backend returns all tasks in project
↓
User sees task in context of full project
```

---

## 📊 DATA FLOW DIAGRAM

```
┌─────────────┐    click task    ┌─────────────────┐
│  MyTasks    │ ───────────────> │ ProjectDetails  │
│  /my-tasks  │                  │ /projects/{id}  │
└─────────────┘                  └─────────────────┘
       │                                  │
       │ GET /my-tasks                    │ GET /projects/{id}
       ▼                                  ▼
┌─────────────┐                  ┌─────────────────┐
│   Backend   │                  │   Backend       │
│ TaskController                 │ ProjectController│
│ ::myTasks() │                  │ ::show()        │
└─────────────┘                  └─────────────────┘
       │                                  │
       ▼                                  ▼
┌─────────────┐                  ┌─────────────────┐
│Return tasks │                  │Return project + │
│with project_│                  │TaskBoard loads  │
│id field     │                  │all project tasks│
└─────────────┘                  └─────────────────┘
```

---

## 🛠️ TECHNICAL IMPLEMENTATION DETAILS

### Backend Controllers

#### TaskController::myTasks()
```php
public function myTasks()
{
    $user = Auth::user();
    
    // Get tasks assigned to current user via pivot table
    $tasks = Task::whereHas('assignedUsers', function ($query) use ($user) {
        $query->where('user_id', $user->id);
    })
    ->with(['assignedUsers:id,name,email'])
    ->get();
    
    // Ensure project_id is included in response
    return response()->json([
        'tasks' => $tasks->map(function ($task) {
            return [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'status' => $task->status,
                'deadline' => $task->deadline,
                'project_id' => $task->project_id,  // 🎯 Critical field
                'assignedUsers' => $task->assignedUsers,
            ];
        })
    ]);
}
```

#### ProjectController::show()
```php
public function show($id)
{
    $user = Auth::user();
    $project = Project::with(['owner', 'users'])->findOrFail($id);
    
    // Check if user has access (owner or member)
    if ($project->owner_id !== $user->id && !$project->users->contains($user)) {
        return response()->json(['message' => 'Bạn không thuộc dự án này'], 403);
    }
    
    return response()->json($project);
}
```

### Frontend Hooks

#### useProjectDetails Hook
```tsx
export const useProjectDetails = (id: number) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/projects/${id}`);
                setProject(response.data);
            } catch (err) {
                setError("Không thể tải thông tin dự án.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProjectDetails();
    }, [id]);

    return { project, loading, error };
};
```

### TypeScript Interfaces
```tsx
interface Task {
    id: number;
    title: string;
    description?: string;
    deadline?: string;
    status?: 'pending' | 'in_progress' | 'done';
    project_id: number;        // 🎯 Required for navigation
    assignedUsers?: User[];
}

interface Project {
    id: number;
    name: string;
    description: string;
    created_at: string;
    owner_id?: number;
}
```

---

## 🔐 SECURITY & AUTHORIZATION

### Access Control
```php
// Project access is verified at multiple levels:

1. TaskController::myTasks()
   - Only returns tasks assigned to authenticated user
   - User cannot see tasks they don't have access to

2. ProjectController::show()  
   - Checks if user is project owner OR project member
   - Returns 403 if user doesn't belong to project

3. TaskBoard API calls
   - GET /projects/{id}/tasks verifies project membership
   - User can only see tasks in projects they belong to
```

### Route Protection
```tsx
// Frontend routes are protected by authentication
<Route path="/" element={<BaseLayout />}>  {/* Auth guard */}
    <Route path="my-tasks" element={<MyTasks />} />
    <Route path="projects/:id" element={<ProjectDetails />} />
</Route>
```

---

## 🎨 UI/UX CONSIDERATIONS

### Visual Design
```tsx
// Task cards in MyTasks are styled as clickable links
<Link
    to={`/projects/${task.project_id}`}
    className="bg-base-200 p-4 rounded shadow hover:bg-base-300 transition block"
>
    <div className="task-card-content">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <span className="status-badge">{task.status}</span>
    </div>
</Link>
```

### User Experience Flow
1. **Clear Visual Feedback**: Hover effects indicate clickability
2. **Smooth Navigation**: React Router provides instant navigation  
3. **Context Preservation**: User lands on project page with full context
4. **Task Highlighting**: Could implement highlighting of originating task
5. **Breadcrumb Navigation**: Project page shows user came from My Tasks

### Accessibility
- **Keyboard Navigation**: Links are keyboard accessible
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Focus Management**: Focus state clearly visible

---

## 🧪 TESTING SCENARIOS

### Unit Tests
```javascript
// Test task navigation logic
describe('MyTasks Navigation', () => {
    test('should navigate to correct project when task clicked', () => {
        const task = { id: 1, project_id: 5, title: 'Test Task' };
        const { getByText } = render(<TaskCard task={task} />);
        
        fireEvent.click(getByText('Test Task'));
        expect(mockNavigate).toHaveBeenCalledWith('/projects/5');
    });
});
```

### Integration Tests  
```php
// Test API endpoints
class TaskNavigationTest extends TestCase
{
    public function test_my_tasks_includes_project_id()
    {
        $user = User::factory()->create();
        $project = Project::factory()->create();
        $task = Task::factory()->create(['project_id' => $project->id]);
        
        $task->assignedUsers()->attach($user->id);
        
        $response = $this->actingAs($user)->get('/my-tasks');
        
        $response->assertJsonFragment([
            'project_id' => $project->id
        ]);
    }
}
```

---

## 🚀 FUTURE ENHANCEMENTS

### Potential Improvements
1. **Task Highlighting**: Highlight the specific task user clicked from My Tasks
2. **Return Navigation**: "Back to My Tasks" button with state preservation
3. **Deep Linking**: Direct task URLs like `/projects/{id}/tasks/{taskId}`
4. **Task Preview**: Modal preview before full navigation
5. **Breadcrumb Trail**: Show navigation path (My Tasks → Project → Task)

### URL Structure Options
```
Current:  /my-tasks → /projects/{id}
Enhanced: /my-tasks → /projects/{id}?from=my-tasks
Advanced: /my-tasks → /projects/{id}/tasks/{taskId}
```

---

Đây là documentation chi tiết về logic click task để chuyển sang project. Tất cả các thành phần đã được implement và hoạt động chính xác theo flow này.
