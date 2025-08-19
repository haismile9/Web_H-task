part of 'home_cubit.dart';

enum HomeStatus { initial, loading, success, failure }

class HomeState {
  const HomeState({
    this.status = HomeStatus.initial,
    this.todayTasks = const [],
    this.todayMeetings = const [],
    this.taskStatistics,
    this.meetingStatistics,
    this.errorMessage,
  });

  final HomeStatus status;
  final List<Task> todayTasks;
  final List<Meeting> todayMeetings;
  final TaskStatistics? taskStatistics;
  final MeetingStatistics? meetingStatistics;
  final String? errorMessage;

  // Helper getters
  bool get isLoading => status == HomeStatus.loading;
  bool get hasData => todayTasks.isNotEmpty || todayMeetings.isNotEmpty;
  bool get isEmpty => todayTasks.isEmpty && todayMeetings.isEmpty && status != HomeStatus.loading;

  HomeState copyWith({
    HomeStatus? status,
    List<Task>? todayTasks,
    List<Meeting>? todayMeetings,
    TaskStatistics? taskStatistics,
    MeetingStatistics? meetingStatistics,
    String? errorMessage,
  }) {
    return HomeState(
      status: status ?? this.status,
      todayTasks: todayTasks ?? this.todayTasks,
      todayMeetings: todayMeetings ?? this.todayMeetings,
      taskStatistics: taskStatistics ?? this.taskStatistics,
      meetingStatistics: meetingStatistics ?? this.meetingStatistics,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

// Statistics models
class TaskStatistics {
  const TaskStatistics({
    required this.total,
    required this.completed,
    required this.inProgress,
    required this.pending,
    required this.overdue,
  });

  final int total;
  final int completed;
  final int inProgress;
  final int pending;
  final int overdue;

  factory TaskStatistics.fromJson(Map<String, dynamic> json) {
    return TaskStatistics(
      total: json['total'] ?? 0,
      completed: json['completed'] ?? 0,
      inProgress: json['in_progress'] ?? 0,
      pending: json['pending'] ?? 0,
      overdue: json['overdue'] ?? 0,
    );
  }
}

class MeetingStatistics {
  const MeetingStatistics({
    required this.total,
    required this.upcoming,
    required this.completed,
    required this.cancelled,
  });

  final int total;
  final int upcoming;
  final int completed;
  final int cancelled;

  factory MeetingStatistics.fromJson(Map<String, dynamic> json) {
    return MeetingStatistics(
      total: json['total'] ?? 0,
      upcoming: json['upcoming'] ?? 0,
      completed: json['completed'] ?? 0,
      cancelled: json['cancelled'] ?? 0,
    );
  }
}
