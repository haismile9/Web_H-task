import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/auth_bloc.dart';
import '../store/home_cubit.dart';
import '../models/user.dart';
import '../widgets/home_banner.dart';
import '../widgets/today_tasks_section.dart';
import '../widgets/today_meetings_section.dart';
import '../widgets/app_navigation_bar.dart';

class NewHomeScreen extends StatefulWidget {
  const NewHomeScreen({super.key});

  @override
  State<NewHomeScreen> createState() => _NewHomeScreenState();
}

class _NewHomeScreenState extends State<NewHomeScreen> {
  @override
  void initState() {
    super.initState();
    // Tạm thời comment out để tránh lỗi API
    // context.read<HomeCubit>().loadHomeData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F3F8),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, authState) {
          if (authState is AuthSuccess) {
            return BlocConsumer<HomeCubit, HomeState>(
              listener: (context, homeState) {
                // Show error message if any
                if (homeState.status == HomeStatus.failure && homeState.errorMessage != null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(homeState.errorMessage!),
                      backgroundColor: Colors.red,
                      action: SnackBarAction(
                        label: 'Thử lại',
                        textColor: Colors.white,
                        onPressed: () {
                          context.read<HomeCubit>().loadHomeData();
                        },
                      ),
                    ),
                  );
                }
              },
              builder: (context, homeState) {
                return _buildHomeContent(authState.user, homeState);
              },
            );
          }
          return const Center(
            child: CircularProgressIndicator(),
          );
        },
      ),
    );
  }

  Widget _buildHomeContent(User user, HomeState homeState) {
    return RefreshIndicator(
      onRefresh: () => context.read<HomeCubit>().refreshTodayData(),
      child: Column(
        children: [
          // Navigation Header
          const AppNavigationBar(),
          
          // Scrollable Content
          Expanded(
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 20),
              child: Column(
                children: [
                  const SizedBox(height: 16),
                  
                  // Work Summary Banner
                  HomeBanner(
                    user: user,
                    taskStatistics: homeState.taskStatistics,
                    meetingStatistics: homeState.meetingStatistics,
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Today Meetings Section
                  TodayMeetingsSection(
                    meetings: homeState.todayMeetings,
                    isLoading: homeState.isLoading,
                    onStatusUpdate: (meetingId, status) {
                      context.read<HomeCubit>().updateMeetingStatus(meetingId, status);
                    },
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Today Tasks Section
                  TodayTasksSection(
                    tasks: homeState.todayTasks,
                    isLoading: homeState.isLoading,
                    onStatusUpdate: (taskId, status) {
                      context.read<HomeCubit>().updateTaskStatus(taskId, status);
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
