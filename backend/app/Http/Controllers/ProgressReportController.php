<?php

namespace App\Http\Controllers;

use App\Models\ProgressReport;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\ChartExportService;

class ProgressReportController extends Controller
{
    protected $chartExportService;

    public function __construct(ChartExportService $chartExportService)
    {
        $this->middleware('auth:sanctum');
        $this->chartExportService = $chartExportService;
    }

    /**
     * Get progress reports for a project
     */
    public function index(Request $request, $projectId)
    {
        $user = Auth::user();
        $project = Project::with('users')->findOrFail($projectId);

        // Check project access
        if ($project->owner_id !== $user->id && !$project->users->contains($user)) {
            return response()->json(['message' => 'Bạn không thuộc dự án này'], 403);
        }

        $query = ProgressReport::forProject($projectId)
            ->with(['user:id,name,email', 'creator:id,name,email']);

        // Filter by user if specified
        if ($request->has('user_id')) {
            $query->forUser($request->user_id);
        }

        // Filter by period
        if ($request->has('period')) {
            $query->where('period', $request->period);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->inPeriod($request->start_date, $request->end_date);
        }

        $reports = $query->latest()->paginate(20);

        return response()->json($reports);
    }

    /**
     * Create new progress report
     */
    public function store(Request $request, $projectId)
    {
        $user = Auth::user();
        $project = Project::with('users')->findOrFail($projectId);

        // Check project access
        if ($project->owner_id !== $user->id && !$project->users->contains($user)) {
            return response()->json(['message' => 'Bạn không thuộc dự án này'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'period' => 'required|in:weekly,monthly,custom',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'main_tasks' => 'nullable|array',
            'main_tasks.*' => 'exists:tasks,id',
            'support_tasks' => 'nullable|array',
            'support_tasks.*' => 'exists:tasks,id',
            'completion_percentage' => 'required|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'achievements' => 'nullable|string',
            'status' => 'nullable|in:draft,submitted,approved',
        ]);

        // Verify user belongs to project
        if (!$project->users->contains($request->user_id) && $project->owner_id !== $request->user_id) {
            return response()->json(['message' => 'User không thuộc dự án này'], 422);
        }

        // Verify tasks belong to project
        if ($request->main_tasks) {
            $invalidTasks = Task::whereIn('id', $request->main_tasks)
                ->where('project_id', '!=', $projectId)
                ->exists();
            if ($invalidTasks) {
                return response()->json(['message' => 'Một số task không thuộc dự án này'], 422);
            }
        }

        $report = ProgressReport::create([
            'project_id' => $projectId,
            'user_id' => $request->user_id,
            'created_by' => $user->id,
            'period' => $request->period,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'main_tasks' => $request->main_tasks ?? [],
            'support_tasks' => $request->support_tasks ?? [],
            'completion_percentage' => $request->completion_percentage,
            'notes' => $request->notes,
            'achievements' => $request->achievements,
            'status' => $request->status ?? 'draft',
        ]);

        return response()->json($report->load(['user:id,name,email', 'creator:id,name,email']), 201);
    }

    /**
     * Get specific progress report
     */
    public function show($projectId, $reportId)
    {
        $user = Auth::user();
        $project = Project::with('users')->findOrFail($projectId);

        // Check project access
        if ($project->owner_id !== $user->id && !$project->users->contains($user)) {
            return response()->json(['message' => 'Bạn không thuộc dự án này'], 403);
        }

        $report = ProgressReport::with(['user:id,name,email', 'creator:id,name,email'])
            ->where('project_id', $projectId)
            ->findOrFail($reportId);

        // Get task details
        $mainTasks = $report->getMainTasksDetails();
        $supportTasks = $report->getSupportTasksDetails();

        return response()->json([
            'report' => $report,
            'main_tasks' => $mainTasks,
            'support_tasks' => $supportTasks,
        ]);
    }

    /**
     * Update progress report
     */
    public function update(Request $request, $projectId, $reportId)
    {
        $user = Auth::user();
        $report = ProgressReport::where('project_id', $projectId)->findOrFail($reportId);

        // Check permissions - only creator or project owner can update
        if ($report->created_by !== $user->id && $report->project->owner_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền chỉnh sửa'], 403);
        }

        $request->validate([
            'period' => 'nullable|in:weekly,monthly,custom',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'main_tasks' => 'nullable|array',
            'main_tasks.*' => 'exists:tasks,id',
            'support_tasks' => 'nullable|array',
            'support_tasks.*' => 'exists:tasks,id',
            'completion_percentage' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
            'achievements' => 'nullable|string',
            'status' => 'nullable|in:draft,submitted,approved',
        ]);

        $report->update($request->only([
            'period', 'start_date', 'end_date', 'main_tasks', 'support_tasks',
            'completion_percentage', 'notes', 'achievements', 'status'
        ]));

        return response()->json($report->load(['user:id,name,email', 'creator:id,name,email']));
    }

    /**
     * Delete progress report
     */
    public function destroy($projectId, $reportId)
    {
        $user = Auth::user();
        $report = ProgressReport::where('project_id', $projectId)->findOrFail($reportId);

        // Check permissions
        if ($report->created_by !== $user->id && $report->project->owner_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền xóa'], 403);
        }

        $report->delete();

        return response()->json(['message' => 'Đã xóa báo cáo tiến độ']);
    }

    /**
     * Generate chart data for progress reports
     */
    public function chartData(Request $request, $projectId)
    {
        $user = Auth::user();
        $project = Project::with('users')->findOrFail($projectId);

        // Check project access
        if ($project->owner_id !== $user->id && !$project->users->contains($user)) {
            return response()->json(['message' => 'Bạn không thuộc dự án này'], 403);
        }

        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'period' => 'nullable|in:weekly,monthly,custom',
        ]);

        $query = ProgressReport::forProject($projectId)
            ->with(['user:id,name,email'])
            ->where('status', 'approved');

        if ($request->start_date && $request->end_date) {
            $query->inPeriod($request->start_date, $request->end_date);
        }

        if ($request->period) {
            $query->where('period', $request->period);
        }

        $reports = $query->get();

        // Prepare chart data
        $chartData = [
            'bar_chart' => $this->prepareBarChartData($reports),
            'pie_chart' => $this->preparePieChartData($reports),
            'line_chart' => $this->prepareLineChartData($reports),
            'summary' => $this->prepareSummaryData($reports),
        ];

        return response()->json($chartData);
    }

    /**
     * Auto-generate progress report based on task completion
     */
    public function autoGenerate(Request $request, $projectId)
    {
        $user = Auth::user();
        $project = Project::with('users')->findOrFail($projectId);

        // Check project access and permissions
        if ($project->owner_id !== $user->id) {
            return response()->json(['message' => 'Chỉ chủ dự án mới có thể tự động tạo báo cáo'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'period' => 'required|in:weekly,monthly,custom',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Get user's tasks in the period
        $userTasks = Task::where('project_id', $projectId)
            ->whereHas('assignedUsers', function ($query) use ($request) {
                $query->where('user_id', $request->user_id);
            })
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->get();

        // Calculate completion percentage
        $totalTasks = $userTasks->count();
        $completedTasks = $userTasks->where('status', 'done')->count();
        $completionPercentage = $totalTasks > 0 ? ($completedTasks / $totalTasks) * 100 : 0;

        // Separate main and support tasks (based on assignment order or priority)
        $mainTasks = $userTasks->where('status', '!=', 'done')->pluck('id')->toArray();
        $supportTasks = $userTasks->where('status', 'done')->pluck('id')->toArray();

        $report = ProgressReport::create([
            'project_id' => $projectId,
            'user_id' => $request->user_id,
            'created_by' => $user->id,
            'period' => $request->period,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'main_tasks' => $mainTasks,
            'support_tasks' => $supportTasks,
            'completion_percentage' => round($completionPercentage, 2),
            'notes' => 'Báo cáo được tạo tự động dựa trên tiến độ task',
            'status' => 'draft',
        ]);

        return response()->json($report->load(['user:id,name,email', 'creator:id,name,email']), 201);
    }

    // Helper methods for chart data preparation
    private function prepareBarChartData($reports)
    {
        return $reports->groupBy('user.name')->map(function ($userReports, $userName) {
            return [
                'name' => $userName,
                'completion_percentage' => $userReports->avg('completion_percentage'),
                'total_reports' => $userReports->count(),
            ];
        })->values();
    }

    private function preparePieChartData($reports)
    {
        $statusCounts = $reports->groupBy('status')->map(function ($group) {
            return $group->count();
        });

        return [
            'labels' => $statusCounts->keys(),
            'data' => $statusCounts->values(),
        ];
    }

    private function prepareLineChartData($reports)
    {
        return $reports->groupBy(function ($report) {
            return $report->created_at->format('Y-m-d');
        })->map(function ($dayReports, $date) {
            return [
                'date' => $date,
                'avg_completion' => $dayReports->avg('completion_percentage'),
                'report_count' => $dayReports->count(),
            ];
        })->values();
    }

    private function prepareSummaryData($reports)
    {
        return [
            'total_reports' => $reports->count(),
            'avg_completion' => $reports->avg('completion_percentage'),
            'max_completion' => $reports->max('completion_percentage'),
            'min_completion' => $reports->min('completion_percentage'),
            'approved_reports' => $reports->where('status', 'approved')->count(),
            'pending_reports' => $reports->where('status', 'submitted')->count(),
        ];
    }

    /**
     * Export chart as PNG
     */
    public function exportChart(Request $request, $projectId)
    {
        $validated = $request->validate([
            'chart_type' => 'required|in:bar,pie',
            'period' => 'nullable|string|in:week,month,quarter',
        ]);

        // Get chart data
        $chartDataRequest = new Request(['period' => $validated['period']]);
        $chartDataResponse = $this->getChartData($chartDataRequest, $projectId);
        $chartData = json_decode($chartDataResponse->getContent(), true);

        if (empty($chartData['data'])) {
            return response()->json(['message' => 'No data to export'], 400);
        }

        try {
            $imagePath = $this->chartExportService->generateChart(
                $chartData['data'],
                $validated['chart_type'],
                "Progress Report - " . $chartData['project']['name']
            );

            return response()->download($imagePath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to generate chart: ' . $e->getMessage()], 500);
        }
    }
}
