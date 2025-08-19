import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../store/home_cubit.dart';
import '../services/api_service.dart';

class DebugApiScreen extends StatefulWidget {
  const DebugApiScreen({super.key});

  @override
  State<DebugApiScreen> createState() => _DebugApiScreenState();
}

class _DebugApiScreenState extends State<DebugApiScreen> {
  final _apiService = ApiService();
  String _result = '';
  bool _isLoading = false;

  Future<void> _testLogin() async {
    setState(() {
      _isLoading = true;
      _result = 'Testing login...';
    });

    try {
      final response = await _apiService.login(
        email: 'test@example.com',
        password: 'password',
      );
      setState(() {
        _result = 'Login successful!\nToken: ${response['access_token']?.toString().substring(0, 50)}...\nUser: ${response['user']}';
      });
    } catch (e) {
      setState(() {
        _result = 'Login failed: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _testTodayTasks() async {
    setState(() {
      _isLoading = true;
      _result = 'Testing today tasks...';
    });

    try {
      final response = await _apiService.getTodayTasks();
      setState(() {
        _result = 'Today Tasks API successful!\nResponse: $response';
      });
    } catch (e) {
      setState(() {
        _result = 'Today Tasks API failed: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _testTodayMeetings() async {
    setState(() {
      _isLoading = true;
      _result = 'Testing today meetings...';
    });

    try {
      final response = await _apiService.getTodayMeetings();
      setState(() {
        _result = 'Today Meetings API successful!\nResponse: $response';
      });
    } catch (e) {
      setState(() {
        _result = 'Today Meetings API failed: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Debug API'),
        backgroundColor: Colors.purple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Test Buttons
            ElevatedButton(
              onPressed: _isLoading ? null : _testLogin,
              child: const Text('Test Login'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : _testTodayTasks,
              child: const Text('Test Today Tasks'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : _testTodayMeetings,
              child: const Text('Test Today Meetings'),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _isLoading ? null : () {
                context.read<HomeCubit>().loadHomeData();
              },
              child: const Text('Test HomeCubit Load'),
            ),
            
            const SizedBox(height: 16),
            
            // Loading indicator
            if (_isLoading)
              const Center(child: CircularProgressIndicator()),
            
            // Result
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: SingleChildScrollView(
                  child: Text(
                    _result.isEmpty ? 'No tests run yet...' : _result,
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
