import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/task.dart';

class TodayTasksSection extends StatelessWidget {
  final List<Task> tasks;
  final bool isLoading;
  final Function(int taskId, String status)? onStatusUpdate;

  const TodayTasksSection({
    super.key,
    required this.tasks,
    required this.isLoading,
    this.onStatusUpdate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFFFEFEFE),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 2),
            child: Column(
              children: [
                // Title Row
                Row(
                  children: [
                    Text(
                      'Today Task',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF101828),
                        height: 1.4,
                      ),
                    ),
                    
                    const SizedBox(width: 4),
                    
                    // Task Count Badge
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEBE9FE),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Center(
                        child: Text(
                          '${tasks.length}',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF7A5AF8),
                            letterSpacing: -0.04,
                            height: 1.21,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 2),
                
                // Subtitle
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'The tasks assigned to you for today',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF667085),
                      height: 1.4,
                    ),
                  ),
                ),
              ],
            ),
          ),
          
          // Content
          Container(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: isLoading 
              ? _buildLoadingState()
              : tasks.isEmpty 
                ? _buildEmptyState()
                : _buildTasksList(),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        border: Border.all(color: const Color(0xFFEAECF0)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Center(
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF7A5AF8)),
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        border: Border.all(color: const Color(0xFFEAECF0)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          // Empty State Illustration
          SizedBox(
            height: 88,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Task Illustration with shadows
                SizedBox(
                  width: 140,
                  height: 88,
                  child: Stack(
                    children: [
                      // Document 1
                      Positioned(
                        left: 3,
                        top: 30,
                        child: Container(
                          width: 53.16,
                          height: 72.29,
                          decoration: BoxDecoration(
                            color: const Color(0xFFBDB4FE).withOpacity(0.3),
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFBDB4FE).withOpacity(0.1),
                                blurRadius: 10,
                                spreadRadius: 2,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Icon(
                            Icons.description_outlined,
                            size: 24,
                            color: const Color(0xFF7A5AF8).withOpacity(0.6),
                          ),
                        ),
                      ),
                      
                      // Document 2
                      Positioned(
                        left: 80,
                        top: 26,
                        child: Container(
                          width: 56.83,
                          height: 74.61,
                          decoration: BoxDecoration(
                            color: const Color(0xFFBDB4FE).withOpacity(0.3),
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFFBDB4FE).withOpacity(0.1),
                                blurRadius: 10,
                                spreadRadius: 2,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Icon(
                            Icons.task_alt_outlined,
                            size: 24,
                            color: const Color(0xFF7A5AF8).withOpacity(0.6),
                          ),
                        ),
                      ),
                      
                      // Document 3 (Center, highlighted)
                      Positioned(
                        left: 42,
                        top: 8,
                        child: Container(
                          width: 56,
                          height: 80,
                          decoration: BoxDecoration(
                            color: const Color(0xFF9742FF).withOpacity(0.4),
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF9742FF).withOpacity(0.1),
                                blurRadius: 14,
                                spreadRadius: 3,
                                offset: const Offset(0, 6),
                              ),
                            ],
                          ),
                          child: Icon(
                            Icons.assignment_outlined,
                            size: 28,
                            color: const Color(0xFF7A5AF8).withOpacity(0.8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 12),
          
          // Empty State Text
          Column(
            children: [
              Text(
                'No Tasks Assigned',
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF161B23),
                  height: 1.71,
                ),
                textAlign: TextAlign.center,
              ),
              
              const SizedBox(height: 4),
              
              Text(
                'It looks like you don\'t have any tasks assigned to you right now. Don\'t worry, this space will be updated as new tasks become available.',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w400,
                  color: const Color(0xFF777F8C),
                  height: 1.3,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTasksList() {
    return Column(
      children: tasks.map((task) => _buildTaskItem(task)).toList(),
    );
  }

  Widget _buildTaskItem(Task task) {
    Color priorityColor = _getPriorityColor(task.priority);
    Color statusColor = _getStatusColor(task.status);
    
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        border: Border.all(color: const Color(0xFFEAECF0)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Task Title and Priority
          Row(
            children: [
              Expanded(
                child: Text(
                  task.title,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF101828),
                  ),
                ),
              ),
              
              // Priority Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: priorityColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  task.priority.toUpperCase(),
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: priorityColor,
                  ),
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 4),
          
          // Task Description
          if (task.description.isNotEmpty) ...[
            Text(
              task.description,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: const Color(0xFF667085),
                height: 1.4,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            
            const SizedBox(height: 8),
          ],
          
          // Due Date and Status
          Row(
            children: [
              if (task.dueDate != null) ...[
                Icon(
                  Icons.schedule,
                  size: 12,
                  color: task.isOverdue 
                    ? Colors.red 
                    : task.isDueToday 
                      ? Colors.orange 
                      : const Color(0xFF667085),
                ),
                const SizedBox(width: 4),
                Text(
                  _formatDueDate(task.dueDate!),
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w400,
                    color: task.isOverdue 
                      ? Colors.red 
                      : task.isDueToday 
                        ? Colors.orange 
                        : const Color(0xFF667085),
                  ),
                ),
                
                const Spacer(),
              ],
              
              // Status Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  task.status.toUpperCase(),
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: statusColor,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return const Color(0xFFEF4444);
      case 'medium':
        return const Color(0xFFF59E0B);
      case 'low':
        return const Color(0xFF10B981);
      default:
        return const Color(0xFF6B7280);
    }
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'completed':
        return const Color(0xFF10B981);
      case 'in_progress':
        return const Color(0xFF3B82F6);
      case 'pending':
        return const Color(0xFFF59E0B);
      case 'cancelled':
        return const Color(0xFFEF4444);
      default:
        return const Color(0xFF6B7280);
    }
  }

  String _formatDueDate(DateTime dueDate) {
    final now = DateTime.now();
    final difference = dueDate.difference(now).inDays;
    
    if (difference == 0) {
      return 'Due today';
    } else if (difference == 1) {
      return 'Due tomorrow';
    } else if (difference == -1) {
      return 'Due yesterday';
    } else if (difference > 1) {
      return 'Due in $difference days';
    } else {
      return 'Overdue by ${difference.abs()} days';
    }
  }
}
