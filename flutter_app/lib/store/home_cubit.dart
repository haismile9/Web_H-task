import 'package:flutter_bloc/flutter_bloc.dart';
import '../services/api_service.dart';
import '../models/task.dart';
import '../models/meeting.dart';

part 'home_state.dart';

class HomeCubit extends Cubit<HomeState> {
  HomeCubit({required this.apiService}) : super(const HomeState());

  final ApiService apiService;

  // Load all home data
  Future<void> loadHomeData() async {
    emit(state.copyWith(status: HomeStatus.loading));

    try {
      // Load data in parallel for better performance
      final results = await Future.wait([
        apiService.getTodayTasks(),
        apiService.getTodayMeetings(),
        apiService.getTaskStatistics(),
        apiService.getMeetingStatistics(),
      ]);

      final tasksData = results[0] as Map<String, dynamic>;
      final meetingsData = results[1] as Map<String, dynamic>;
      final taskStatsData = results[2] as Map<String, dynamic>;
      final meetingStatsData = results[3] as Map<String, dynamic>;

      // Parse tasks
      final todayTasks = (tasksData['data'] as List<dynamic>? ?? [])
          .map((json) => Task.fromJson(json as Map<String, dynamic>))
          .toList();

      // Parse meetings
      final todayMeetings = (meetingsData['data'] as List<dynamic>? ?? [])
          .map((json) => Meeting.fromJson(json as Map<String, dynamic>))
          .toList();

      // Parse statistics
      final taskStats = TaskStatistics.fromJson(taskStatsData['data'] ?? {});
      final meetingStats = MeetingStatistics.fromJson(meetingStatsData['data'] ?? {});

      emit(state.copyWith(
        status: HomeStatus.success,
        todayTasks: todayTasks,
        todayMeetings: todayMeetings,
        taskStatistics: taskStats,
        meetingStatistics: meetingStats,
        errorMessage: null,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: HomeStatus.failure,
        errorMessage: e.toString(),
      ));
    }
  }

  // Update task status
  Future<void> updateTaskStatus(int taskId, String status) async {
    try {
      await apiService.updateTaskStatus(taskId, status);
      
      // Update local state
      final updatedTasks = state.todayTasks.map((task) {
        if (task.id == taskId) {
          return task.copyWith(status: status);
        }
        return task;
      }).toList();

      emit(state.copyWith(todayTasks: updatedTasks));
      
      // Reload statistics to get updated counts
      _refreshStatistics();
    } catch (e) {
      emit(state.copyWith(
        status: HomeStatus.failure,
        errorMessage: 'Không thể cập nhật trạng thái: $e',
      ));
    }
  }

  // Update meeting status
  Future<void> updateMeetingStatus(int meetingId, String status) async {
    try {
      await apiService.updateMeetingStatus(meetingId, status);
      
      // Update local state
      final updatedMeetings = state.todayMeetings.map((meeting) {
        if (meeting.id == meetingId) {
          return meeting.copyWith(status: status);
        }
        return meeting;
      }).toList();

      emit(state.copyWith(todayMeetings: updatedMeetings));
      
      // Reload statistics to get updated counts
      _refreshStatistics();
    } catch (e) {
      emit(state.copyWith(
        status: HomeStatus.failure,
        errorMessage: 'Không thể cập nhật trạng thái: $e',
      ));
    }
  }

  // Refresh only today's data (for pull-to-refresh)
  Future<void> refreshTodayData() async {
    try {
      final results = await Future.wait([
        apiService.getTodayTasks(),
        apiService.getTodayMeetings(),
      ]);

      final tasksData = results[0] as Map<String, dynamic>;
      final meetingsData = results[1] as Map<String, dynamic>;

      final todayTasks = (tasksData['data'] as List<dynamic>? ?? [])
          .map((json) => Task.fromJson(json as Map<String, dynamic>))
          .toList();

      final todayMeetings = (meetingsData['data'] as List<dynamic>? ?? [])
          .map((json) => Meeting.fromJson(json as Map<String, dynamic>))
          .toList();

      emit(state.copyWith(
        status: HomeStatus.success,
        todayTasks: todayTasks,
        todayMeetings: todayMeetings,
        errorMessage: null,
      ));
    } catch (e) {
      emit(state.copyWith(
        status: HomeStatus.failure,
        errorMessage: 'Không thể tải dữ liệu: $e',
      ));
    }
  }

  // Private method to refresh statistics
  Future<void> _refreshStatistics() async {
    try {
      final results = await Future.wait([
        apiService.getTaskStatistics(),
        apiService.getMeetingStatistics(),
      ]);

      final taskStatsData = results[0] as Map<String, dynamic>;
      final meetingStatsData = results[1] as Map<String, dynamic>;

      final taskStats = TaskStatistics.fromJson(taskStatsData['data'] ?? {});
      final meetingStats = MeetingStatistics.fromJson(meetingStatsData['data'] ?? {});

      emit(state.copyWith(
        taskStatistics: taskStats,
        meetingStatistics: meetingStats,
      ));
    } catch (e) {
      // Silently fail for statistics refresh
    }
  }

  // Clear error
  void clearError() {
    emit(state.copyWith(
      status: HomeStatus.success,
      errorMessage: null,
    ));
  }
}
