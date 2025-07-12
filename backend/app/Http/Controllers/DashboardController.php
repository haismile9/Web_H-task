<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Get dashboard data for the authenticated user
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $today = Carbon::today();

        // Get all projects assigned to the user (both as owner and member)
        $projects = $this->getUserProjects($user->id);
        
        // Get task summary for the user
        $taskSummary = $this->getTaskSummary($user->id, $today);
        
        // Get project summary
        $projectSummary = $this->getProjectSummary($projects);
        
        // Get recent activities
        $activities = $this->getRecentActivities($user->id);

        return response()->json([
            'task_summary' => $taskSummary,
            'project_summary' => $projectSummary,
            'projects' => $projects,
            'activities' => $activities
        ]);
    }

    /**
     * Get all projects assigned to the user with task grouping
     */
    public function getUserProjects($userId)
    {
        $projects = Project::where(function($query) use ($userId) {
            $query->where('owner_id', $userId)
                  ->orWhereHas('users', function($q) use ($userId) {
                      $q->where('user_id', $userId);
                  });
        })
        ->with(['tasks' => function($query) use ($userId) {
            $query->where(function($q) use ($userId) {
                $q->where('assigned_to', $userId)
                  ->orWhereNull('assigned_to');
            });
        }, 'owner', 'users'])
        ->get()
        ->map(function ($project) {
            $tasks = $project->tasks;
            $today = Carbon::today();
            
            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'owner' => $project->owner,
                'members' => $project->users,
                'tasks' => [
                    'completed' => $tasks->where('status', 'done')->values(),
                    'pending' => $tasks->where('status', 'pending')->values(),
                    'in_progress' => $tasks->where('status', 'in_progress')->values(),
                    'overdue' => $tasks->where('status', '!=', 'done')
                                     ->where('deadline', '<', $today)
                                     ->values(),
                ],
                'task_summary' => [
                    'total' => $tasks->count(),
                    'completed' => $tasks->where('status', 'done')->count(),
                    'pending' => $tasks->where('status', 'pending')->count(),
                    'in_progress' => $tasks->where('status', 'in_progress')->count(),
                    'overdue' => $tasks->where('status', '!=', 'done')
                                     ->where('deadline', '<', $today)
                                     ->count(),
                ]
            ];
        });

        return $projects;
    }

    /**
     * Get task summary for the user
     */
    private function getTaskSummary($userId, $today)
    {
        $tasks = Task::where('assigned_to', $userId);
        
        return [
            'total' => $tasks->count(),
            'completed' => $tasks->where('status', 'done')->count(),
            'in_progress' => $tasks->where('status', 'in_progress')->count(),
            'pending' => $tasks->where('status', 'pending')->count(),
            'overdue' => $tasks->where('status', '!=', 'done')
                              ->where('deadline', '<', $today)
                              ->count(),
        ];
    }

    /**
     * Get project summary
     */
    private function getProjectSummary($projects)
    {
        $totalProjects = $projects->count();
        $doneProjects = $projects->filter(function($project) {
            return $project['task_summary']['total'] > 0 && 
                   $project['task_summary']['total'] === $project['task_summary']['completed'];
        })->count();
        
        $doingProjects = $projects->filter(function($project) {
            return $project['task_summary']['in_progress'] > 0;
        })->count();
        
        $plannedProjects = $totalProjects - $doneProjects - $doingProjects;

        return [
            'total' => $totalProjects,
            'done' => $doneProjects,
            'doing' => $doingProjects,
            'planned' => $plannedProjects
        ];
    }

    /**
     * Get recent activities
     */
    private function getRecentActivities($userId)
    {
        return Task::where('assigned_to', $userId)
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get(['title', 'status', 'updated_at'])
            ->map(function ($task) {
                return [
                    'type' => 'task_' . $task->status,
                    'content' => ucfirst($task->status) . ' task "' . $task->title . '"',
                    'created_at' => $task->updated_at,
                ];
            });
    }

    /**
     * Get project progress with detailed task breakdown
     */
    public function projectProgress(Request $request)
    {
        $user = auth()->user();
        $today = Carbon::today();
        $soon = Carbon::today()->addDays(2);

        $projects = Project::where(function($query) use ($user) {
            $query->where('owner_id', $user->id)
                  ->orWhereHas('users', function($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        })
        ->with(['tasks' => function($query) use ($user) {
            $query->where(function($q) use ($user) {
                $q->where('assigned_to', $user->id)
                  ->orWhereNull('assigned_to');
            });
        }])
        ->get()
        ->map(function ($project) use ($today, $soon) {
            $tasks = $project->tasks;
            
            return [
                'project_id' => $project->id,
                'project_name' => $project->name,
                'total_tasks' => $tasks->count(),
                'completed' => $tasks->where('status', 'done')->count(),
                'in_progress' => $tasks->where('status', 'in_progress')->count(),
                'pending' => $tasks->where('status', 'pending')->count(),
                'overdue' => $tasks->where('status', '!=', 'done')
                                  ->where('deadline', '<', $today)
                                  ->count(),
                'upcoming_due' => $tasks->where('status', '!=', 'done')
                                       ->where('deadline', '>=', $today)
                                       ->where('deadline', '<=', $soon)
                                       ->count(),
                'tasks_by_status' => [
                    'completed' => $tasks->where('status', 'done')->values(),
                    'pending' => $tasks->where('status', 'pending')->values(),
                    'in_progress' => $tasks->where('status', 'in_progress')->values(),
                    'overdue' => $tasks->where('status', '!=', 'done')
                                     ->where('deadline', '<', $today)
                                     ->values(),
                ]
            ];
        });

        return response()->json($projects);
    }

    /**
     * Get tasks grouped by status for a specific project
     */
    public function projectTasks(Request $request, $projectId)
    {
        $user = auth()->user();
        $today = Carbon::today();

        // Verify user has access to this project
        $project = Project::where(function($query) use ($user, $projectId) {
            $query->where('id', $projectId)
                  ->where(function($q) use ($user) {
                      $q->where('owner_id', $user->id)
                        ->orWhereHas('users', function($subQ) use ($user) {
                            $subQ->where('user_id', $user->id);
                        });
                  });
        })
        ->with(['tasks' => function($query) use ($user) {
            $query->where(function($q) use ($user) {
                $q->where('assigned_to', $user->id)
                  ->orWhereNull('assigned_to');
            });
        }, 'tasks.assignedUser'])
        ->firstOrFail();

        $tasks = $project->tasks;

        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
            ],
            'tasks' => [
                'completed' => $tasks->where('status', 'done')->values(),
                'pending' => $tasks->where('status', 'pending')->values(),
                'in_progress' => $tasks->where('status', 'in_progress')->values(),
                'overdue' => $tasks->where('status', '!=', 'done')
                                 ->where('deadline', '<', $today)
                                 ->values(),
            ],
            'summary' => [
                'total' => $tasks->count(),
                'completed' => $tasks->where('status', 'done')->count(),
                'pending' => $tasks->where('status', 'pending')->count(),
                'in_progress' => $tasks->where('status', 'in_progress')->count(),
                'overdue' => $tasks->where('status', '!=', 'done')
                                 ->where('deadline', '<', $today)
                                 ->count(),
            ]
        ]);
    }
}
