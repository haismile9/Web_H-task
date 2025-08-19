import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppNavigationBar extends StatelessWidget {
  const AppNavigationBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: Color(0xFFFEFEFE),
        border: Border(
          bottom: BorderSide(
            color: Color(0xFFEAECF0),
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          // Top Section with Time and Status
          Container(
            padding: const EdgeInsets.fromLTRB(32, 22, 32, 4),
            child: Column(
              children: [
                // Time and Battery/Signal
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Time
                    Text(
                      '08:15',
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF101828),
                        letterSpacing: -0.02,
                      ),
                    ),
                    
                    // Status Icons (Battery, Signal, WiFi)
                    Row(
                      children: [
                        // Signal bars
                        Container(
                          width: 17,
                          height: 10.67,
                          decoration: BoxDecoration(
                            color: const Color(0xFF101828),
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: 5),
                        // WiFi
                        Container(
                          width: 15.33,
                          height: 11,
                          decoration: BoxDecoration(
                            color: const Color(0xFF101828),
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                        const SizedBox(width: 5),
                        // Battery
                        Container(
                          width: 24.33,
                          height: 11.33,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            border: Border.all(
                              color: const Color(0xFF101828),
                              width: 1,
                            ),
                            borderRadius: BorderRadius.circular(2),
                          ),
                          child: Container(
                            margin: const EdgeInsets.all(1),
                            decoration: BoxDecoration(
                              color: const Color(0xFF101828),
                              borderRadius: BorderRadius.circular(1),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // User Profile Section
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // User Profile
                Row(
                  children: [
                    // Profile Image
                    Container(
                      width: 44,
                      height: 44,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFFE5E7EB),
                      ),
                      child: ClipOval(
                        child: Image.asset(
                          'assets/images/profile_placeholder.png',
                          width: 44,
                          height: 44,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              width: 44,
                              height: 44,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                color: Color(0xFFE5E7EB),
                              ),
                              child: const Icon(
                                Icons.person,
                                size: 24,
                                color: Color(0xFF6B7280),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                    
                    const SizedBox(width: 9),
                    
                    // User Info
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              'Nguyen Van A', // This will be dynamic
                              style: GoogleFonts.roboto(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: const Color(0xFF6E62FF),
                                letterSpacing: -0.04,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 1),
                        Text(
                          'Junior Full Stack Developer',
                          style: GoogleFonts.roboto(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: const Color(0xFF6E62FF),
                            letterSpacing: -0.04,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                
                // Notification & Options
                Row(
                  children: [
                    // Notification Bell
                    Container(
                      width: 40,
                      height: 40,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFFF4F5FF),
                      ),
                      child: const Icon(
                        Icons.notifications_outlined,
                        size: 20,
                        color: Colors.white,
                      ),
                    ),
                    
                    const SizedBox(width: 12),
                    
                    // More Options
                    Container(
                      width: 40,
                      height: 40,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(0xFFF4F5FF),
                      ),
                      child: const Icon(
                        Icons.more_vert,
                        size: 20,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}
