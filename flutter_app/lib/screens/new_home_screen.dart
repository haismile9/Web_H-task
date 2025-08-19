import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../blocs/auth_bloc.dart';
import '../models/user.dart';
import '../models/task.dart';
import '../models/meeting.dart';
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
  List<Task> todayTasks = [];
  List<Meeting> todayMeetings = [];
  bool isLoadingTasks = true;
  bool isLoadingMeetings = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  void _loadData() {
    // Simulate loading data
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        // For demo - empty state
        todayTasks = [];
        todayMeetings = [];
        isLoadingTasks = false;
        isLoadingMeetings = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F3F8),
      body: BlocBuilder<AuthBloc, AuthState>(
        builder: (context, state) {
          if (state is AuthSuccess) {
            return _buildHomeContent(state.user);
          }
          return const Center(
            child: CircularProgressIndicator(),
          );
        },
      ),
    );
  }

  Widget _buildHomeContent(User user) {
    return Column(
      children: [
        // Navigation Header
        const AppNavigationBar(),
        
        // Scrollable Content
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(12, 0, 12, 20),
            child: Column(
              children: [
                const SizedBox(height: 16),
                
                // Work Summary Banner
                HomeBanner(user: user),
                
                const SizedBox(height: 16),
                
                // Today Meetings Section
                TodayMeetingsSection(
                  meetings: todayMeetings,
                  isLoading: isLoadingMeetings,
                ),
                
                const SizedBox(height: 16),
                
                // Today Tasks Section
                TodayTasksSection(
                  tasks: todayTasks,
                  isLoading: isLoadingTasks,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
