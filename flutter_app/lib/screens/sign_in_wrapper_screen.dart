import 'package:flutter/material.dart';
import 'sign_in_screen.dart';

class SignInWrapperScreen extends StatelessWidget {
  const SignInWrapperScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFF3B82F6), // Blue
              Color(0xFF1E40AF), // Blue-800
              Color(0xFF7C3AED), // Purple
            ],
          ),
        ),
        child: const SignInScreen(),
      ),
    );
  }
}
