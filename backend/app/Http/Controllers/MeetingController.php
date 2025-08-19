<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MeetingController extends Controller
{
    /**
     * Get all meetings for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $meetings = Meeting::whereHas('participants', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with('participants:id,name,email')
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $meetings,
            'message' => 'Meetings retrieved successfully'
        ]);
    }

    /**
     * Get today's meetings for mobile app
     */
    public function todayMeetings(Request $request)
    {
        $user = $request->user();
        $today = now()->startOfDay();
        $tomorrow = now()->addDay()->startOfDay();
        
        $meetings = Meeting::whereHas('participants', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereBetween('start_time', [$today, $tomorrow])
            ->with('participants:id,name,email')
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function($meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->title,
                    'description' => $meeting->description,
                    'start_time' => $meeting->start_time,
                    'end_time' => $meeting->end_time,
                    'location' => $meeting->location ?? '',
                    'type' => $meeting->type ?? 'offline',
                    'status' => $meeting->status ?? 'scheduled',
                    'created_at' => $meeting->created_at,
                    'updated_at' => $meeting->updated_at,
                    'participant_ids' => $meeting->participants->pluck('id')->toArray(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $meetings,
            'count' => $meetings->count(),
            'message' => 'Today\'s meetings retrieved successfully'
        ]);
    }

    /**
     * Create a new meeting
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'type' => 'nullable|in:online,offline,hybrid',
            'participant_ids' => 'nullable|array',
            'participant_ids.*' => 'exists:users,id'
        ]);

        $validated['status'] = 'scheduled';
        $validated['created_by'] = $user->id;

        $meeting = Meeting::create($validated);

        // Add participants
        $participantIds = $validated['participant_ids'] ?? [];
        if (!in_array($user->id, $participantIds)) {
            $participantIds[] = $user->id; // Add creator as participant
        }
        
        $meeting->participants()->sync($participantIds);

        return response()->json([
            'success' => true,
            'data' => $meeting->load('participants:id,name,email'),
            'message' => 'Meeting created successfully'
        ], 201);
    }

    /**
     * Update meeting status
     */
    public function updateStatus(Request $request, $meetingId)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'status' => 'required|in:scheduled,in_progress,completed,cancelled'
        ]);

        $meeting = Meeting::whereHas('participants', function($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->findOrFail($meetingId);

        $meeting->update($validated);

        return response()->json([
            'success' => true,
            'data' => $meeting,
            'message' => 'Meeting status updated successfully'
        ]);
    }

    /**
     * Get meeting statistics
     */
    public function statistics(Request $request)
    {
        $user = $request->user();
        $today = now()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $thisMonth = now()->startOfMonth();
        
        $allMeetings = Meeting::whereHas('participants', function($query) use ($user) {
            $query->where('user_id', $user->id);
        });
        
        $stats = [
            'total_meetings' => $allMeetings->count(),
            'today_meetings' => $allMeetings->whereDate('start_time', $today)->count(),
            'this_week_meetings' => $allMeetings->where('start_time', '>=', $thisWeek)->count(),
            'this_month_meetings' => $allMeetings->where('start_time', '>=', $thisMonth)->count(),
            'upcoming_meetings' => $allMeetings->where('start_time', '>', now())
                                            ->where('status', 'scheduled')->count(),
            'completed_meetings' => $allMeetings->where('status', 'completed')->count()
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Meeting statistics retrieved successfully'
        ]);
    }
}
