<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProjects = Project::count();
        $totalTasks = Task::count();

        $tasksByStatus = Task::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        $tasksByUser = Task::with('assignedUser')
            ->selectRaw('assigned_to, COUNT(*) as count')
            ->whereNotNull('assigned_to')
            ->groupBy('assigned_to')
            ->get()
            ->map(function ($item) {
                return [
                    'user_id' => $item->assigned_to,
                    'user_name' => optional($item->assignedUser)->name,
                    'total_tasks' => $item->count,
                ];
            });

        $completed = Task::where('status', 'done')->count();
        $completedRate = $totalTasks > 0 ? round($completed / $totalTasks * 100, 2) : 0;

        return response()->json([
            'total_projects' => $totalProjects,
            'total_tasks' => $totalTasks,
            'tasks_by_status' => $tasksByStatus,
            'tasks_by_user' => $tasksByUser,
            'completed_rate' => $completedRate,
        ]);
    }
}
