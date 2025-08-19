import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/user.dart';
import '../store/home_cubit.dart';

class HomeBanner extends StatelessWidget {
  final User user;
  final TaskStatistics? taskStatistics;
  final MeetingStatistics? meetingStatistics;

  const HomeBanner({
    super.key,
    required this.user,
    this.taskStatistics,
    this.meetingStatistics,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 96,
      decoration: BoxDecoration(
        color: const Color(0xFF795FFC),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Stack(
        children: [
          // Background Image
          Positioned(
            right: 16,
            top: 0,
            bottom: 0,
            child: Container(
              width: 101,
              height: 85,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
              ),
              child: Image.asset(
                'assets/images/work_summary_bg.png',
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: 101,
                    height: 85,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      Icons.work_outline,
                      color: Colors.white.withOpacity(0.5),
                      size: 32,
                    ),
                  );
                },
              ),
            ),
          ),
          
          // Content
          Positioned(
            left: 16,
            top: 28,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Title
                Text(
                  'My Work Summary',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                    letterSpacing: -0.03,
                    height: 1.21,
                  ),
                ),
                
                const SizedBox(height: 3),
                
                // Subtitle
                Text(
                  'Today task & presence activity',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFFEDEAFF),
                    letterSpacing: -0.038,
                    height: 1.21,
                  ),
                ),
              ],
            ),
          ),
          
          // Decorative Stars
          Positioned(
            right: 269 - 16, // Adjusting for right positioning
            top: 36,
            child: _buildStarIcon(29.26, const Color(0xFFD9D6FE)),
          ),
          
          Positioned(
            right: 294 - 16,
            top: 16,
            child: _buildStarIcon(21.61, const Color(0xFFD9D6FE)),
          ),
          
          Positioned(
            right: 298 - 16,
            top: 70,
            child: _buildStarIcon(10.55, const Color(0xFFD9D6FE)),
          ),
          
          Positioned(
            right: 324 - 16,
            top: 17,
            child: _buildStarIcon(9.52, const Color(0xFFD9D6FE)),
          ),
          
          Positioned(
            right: 295 - 16,
            top: 36,
            child: _buildStarIcon(5.33, const Color(0xFFD9D6FE)),
          ),
          
          Positioned(
            right: 322 - 16,
            top: 72,
            child: _buildStarIcon(5.33, const Color(0xFFD9D6FE)),
          ),
          
          Positioned(
            right: 317 - 16,
            top: 29,
            child: _buildStarIcon(5.33, const Color(0xFFD9D6FE)),
          ),
        ],
      ),
    );
  }

  Widget _buildStarIcon(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(size / 4),
      ),
      child: Icon(
        Icons.star,
        size: size * 0.7,
        color: color.withOpacity(0.8),
      ),
    );
  }
}
