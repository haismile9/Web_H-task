<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class TaskController extends Controller
{
    /**
     * Get all tasks for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $tasks = Task::where('assigned_user_id', $user->id)
                        ->orderBy('created_at', 'desc')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $tasks,
                'message' => 'Tasks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get today's tasks for the authenticated user
     */
    public function todayTasks(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $today = Carbon::today();
            
            $tasks = Task::where('assigned_user_id', $user->id)
                        ->where(function($query) use ($today) {
                            $query->whereDate('due_date', $today)
                                  ->orWhere('created_at', '>=', $today);
                        })
                        ->orderBy('priority', 'desc')
                        ->orderBy('due_date', 'asc')
                        ->get();

            return response()->json([
                'success' => true,
                'data' => $tasks,
                'count' => $tasks->count(),
                'message' => 'Today\'s tasks retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve today\'s tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new task
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'status' => 'in:pending,in_progress,completed,cancelled',
                'priority' => 'in:low,medium,high',
                'due_date' => 'nullable|date',
                'project_id' => 'nullable|exists:projects,id',
                'assigned_user_id' => 'nullable|exists:users,id'
            ]);

            $validated['status'] = $validated['status'] ?? 'pending';
            $validated['priority'] = $validated['priority'] ?? 'medium';
            
            if (!isset($validated['assigned_user_id'])) {
                $validated['assigned_user_id'] = $request->user()->id;
            }

            $task = Task::create($validated);

            return response()->json([
                'success' => true,
                'data' => $task,
                'message' => 'Task created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update task status
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,in_progress,completed,cancelled'
            ]);

            $task = Task::where('id', $id)
                       ->where('assigned_user_id', $request->user()->id)
                       ->firstOrFail();

            $task->update($validated);

            return response()->json([
                'success' => true,
                'data' => $task,
                'message' => 'Task status updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update task status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get task statistics for dashboard
     */
    public function statistics(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $today = Carbon::today();
            
            $stats = [
                'total_tasks' => Task::where('assigned_user_id', $user->id)->count(),
                'pending_tasks' => Task::where('assigned_user_id', $user->id)
                                      ->where('status', 'pending')->count(),
                'in_progress_tasks' => Task::where('assigned_user_id', $user->id)
                                          ->where('status', 'in_progress')->count(),
                'completed_tasks' => Task::where('assigned_user_id', $user->id)
                                        ->where('status', 'completed')->count(),
                'today_tasks' => Task::where('assigned_user_id', $user->id)
                                    ->whereDate('due_date', $today)->count(),
                'overdue_tasks' => Task::where('assigned_user_id', $user->id)
                                      ->where('due_date', '<', $today)
                                      ->where('status', '!=', 'completed')->count()
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Task statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve task statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
