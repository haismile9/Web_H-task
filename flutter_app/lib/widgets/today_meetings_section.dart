 import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/meeting.dart';

class TodayMeetingsSection extends StatelessWidget {
  final List<Meeting> meetings;
  final bool isLoading;
  final Function(int meetingId, String status)? onStatusUpdate;

  const TodayMeetingsSection({
    super.key,
    required this.meetings,
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
                      'Today Meeting',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF101828),
                        height: 1.4,
                      ),
                    ),
                    
                    const SizedBox(width: 4),
                    
                    // Meeting Count Badge
                    Container(
                      width: 20,
                      height: 20,
                      decoration: BoxDecoration(
                        color: const Color(0xFFEBE9FE),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Center(
                        child: Text(
                          '${meetings.length}',
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
                    'Your schedule for the day',
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
              : meetings.isEmpty 
                ? _buildEmptyState()
                : _buildMeetingsList(),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return Container(
      height: 86,
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
            height: 60,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Calendar Icon with gradient background
                Container(
                  width: 126,
                  height: 60,
                  decoration: BoxDecoration(
                    color: const Color(0xFFF4F3FF),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Center(
                    child: Icon(
                      Icons.calendar_today_outlined,
                      size: 32,
                      color: const Color(0xFF7A5AF8).withOpacity(0.6),
                    ),
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
                'No Meeting Available',
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
                'It looks like you don\'t have any meetings scheduled at the moment. This space will be updated as new meetings are added!',
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

  Widget _buildMeetingsList() {
    return Column(
      children: meetings.map((meeting) => _buildMeetingItem(meeting)).toList(),
    );
  }

  Widget _buildMeetingItem(Meeting meeting) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF9FAFB),
        border: Border.all(color: const Color(0xFFEAECF0)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          // Time
          SizedBox(
            width: 60,
            child: Text(
              meeting.formattedTime,
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF101828),
              ),
            ),
          ),
          
          const SizedBox(width: 12),
          
          // Meeting Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  meeting.title,
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF101828),
                  ),
                ),
                
                if (meeting.location.isNotEmpty) ...[
                  const SizedBox(height: 2),
                  Text(
                    meeting.location,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w400,
                      color: const Color(0xFF667085),
                    ),
                  ),
                ],
              ],
            ),
          ),
          
          // Status Indicator
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: meeting.isOngoing 
                ? Colors.green 
                : meeting.isUpcoming 
                  ? const Color(0xFF7A5AF8)
                  : Colors.grey,
              shape: BoxShape.circle,
            ),
          ),
        ],
      ),
    );
  }
}
