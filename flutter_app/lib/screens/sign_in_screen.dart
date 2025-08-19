import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import '../blocs/auth_bloc.dart';

class SignInScreen extends StatefulWidget {
  const SignInScreen({super.key});

  @override
  State<SignInScreen> createState() => _SignInScreenState();
}

class _SignInScreenState extends State<SignInScreen> {
  final _formKey = GlobalKey<FormState>();
  final _employeeIdController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = true;

  @override
  void dispose() {
    _employeeIdController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submitSignIn() {
    if (_formKey.currentState!.validate()) {
      // Convert Employee ID to email format if needed
      String email = _employeeIdController.text.trim();
      if (!email.contains('@')) {
        email = '$email@company.com'; // Add default domain
      }
      
      context.read<AuthBloc>().add(
        AuthPasswordSubmitted(
          email: email,
          password: _passwordController.text,
        ),
      );
    }
  }

  String? _validateEmployeeId(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Vui lòng nhập Employee ID';
    }
    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Vui lòng nhập mật khẩu';
    }
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return null;
  }

  void _showErrorDialog(String message, Map<String, List<String>>? fieldErrors) {
    String errorText = message;
    
    if (fieldErrors != null) {
      final List<String> allErrors = [];
      fieldErrors.forEach((field, errors) {
        allErrors.addAll(errors);
      });
      if (allErrors.isNotEmpty) {
        errorText = allErrors.join('\n');
      }
    }

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Đăng nhập thất bại',
          style: GoogleFonts.roboto(
            fontWeight: FontWeight.w600,
          ),
        ),
        content: Text(
          errorText,
          style: GoogleFonts.roboto(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'OK',
              style: GoogleFonts.roboto(
                color: const Color(0xFF6938EF),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black.withOpacity(0.5), // Semi-transparent background
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Sign In Card
                Container(
                  width: double.infinity,
                  constraints: const BoxConstraints(maxWidth: 390),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFEFEFE),
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(24),
                      topRight: Radius.circular(24),
                    ),
                  ),
                  padding: const EdgeInsets.fromLTRB(32, 40, 32, 32),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Header Section
                        Column(
                          children: [
                            // Title and Subtitle
                            Column(
                              children: [
                                Text(
                                  'Sign In',
                                  style: GoogleFonts.roboto(
                                    fontSize: 24,
                                    fontWeight: FontWeight.w600,
                                    color: const Color(0xFF101828),
                                    height: 1.33,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Sign in to my account',
                                  style: GoogleFonts.roboto(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: const Color(0xFF475467),
                                    height: 1.43,
                                    letterSpacing: 0.1,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 24),
                            
                            // Form Fields
                            Column(
                              children: [
                                // Employee ID Field
                                _buildInputField(
                                  label: 'Employee ID',
                                  controller: _employeeIdController,
                                  validator: _validateEmployeeId,
                                  keyboardType: TextInputType.text,
                                ),
                                
                                const SizedBox(height: 24),
                                
                                // Password Field
                                _buildInputField(
                                  label: 'Password',
                                  controller: _passwordController,
                                  validator: _validatePassword,
                                  isPassword: true,
                                ),
                                
                                const SizedBox(height: 12),
                                
                                // Remember Me & Forgot Password
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    // Remember Me Checkbox
                                    InkWell(
                                      onTap: () {
                                        setState(() {
                                          _rememberMe = !_rememberMe;
                                        });
                                      },
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Container(
                                            width: 16,
                                            height: 16,
                                            decoration: BoxDecoration(
                                              color: _rememberMe 
                                                ? const Color(0xFF6938EF) 
                                                : Colors.transparent,
                                              border: Border.all(
                                                color: _rememberMe 
                                                  ? const Color(0xFF6938EF) 
                                                  : const Color(0xFFD0D5DD),
                                                width: 1,
                                              ),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: _rememberMe
                                              ? const Icon(
                                                  Icons.check,
                                                  size: 12,
                                                  color: Colors.white,
                                                )
                                              : null,
                                          ),
                                          const SizedBox(width: 8),
                                          Text(
                                            'Remember me',
                                            style: GoogleFonts.roboto(
                                              fontSize: 12,
                                              fontWeight: FontWeight.w400,
                                              color: const Color(0xFF344054),
                                              letterSpacing: -0.2,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    
                                    // Forgot Password
                                    GestureDetector(
                                      onTap: () {
                                        // Navigate to forgot password
                                      },
                                      child: Text(
                                        'Forgot Password',
                                        style: GoogleFonts.roboto(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w400,
                                          color: const Color(0xFF7A5AF8),
                                          letterSpacing: -0.2,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 32),
                        
                        // Sign In Button
                        BlocConsumer<AuthBloc, AuthState>(
                          listener: (context, state) {
                            if (state is AuthSuccess) {
                              Navigator.pushNamedAndRemoveUntil(
                                context,
                                '/home',
                                (route) => false,
                              );
                            } else if (state is AuthError) {
                              _showErrorDialog(state.message, state.fieldErrors);
                            }
                          },
                          builder: (context, state) {
                            return _buildGradientButton(
                              text: 'Sign In',
                              onPressed: _submitSignIn,
                              isLoading: state is AuthLoading,
                            );
                          },
                        ),
                        
                        const SizedBox(height: 32),
                        
                        // Social Login Section (placeholder)
                        Container(
                          height: 1,
                          color: const Color(0xFFE4E7EC),
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 22),
                
                // Sign Up Link
                Container(
                  width: double.infinity,
                  constraints: const BoxConstraints(maxWidth: 390),
                  height: 24,
                  child: Center(
                    child: GestureDetector(
                      onTap: () {
                        // Navigate to sign up
                      },
                      child: Text(
                        "Don't have an account? Sign Up Here",
                        style: GoogleFonts.roboto(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF6938EF),
                          height: 1.45,
                          letterSpacing: -0.15,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({
    required String label,
    required TextEditingController controller,
    required String? Function(String?) validator,
    TextInputType? keyboardType,
    bool isPassword = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.roboto(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF344054),
            height: 1.33,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          validator: validator,
          keyboardType: keyboardType,
          obscureText: isPassword,
          style: GoogleFonts.roboto(
            fontSize: 14,
            fontWeight: FontWeight.w400,
            color: const Color(0xFF101828),
          ),
          decoration: InputDecoration(
            hintText: 'Enter your $label',
            hintStyle: GoogleFonts.roboto(
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: const Color(0xFF667085),
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(
                color: Color(0xFFD0D5DD),
                width: 1,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(
                color: Color(0xFFD0D5DD),
                width: 1,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(
                color: Color(0xFF6938EF),
                width: 2,
              ),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(
                color: Color(0xFFF04438),
                width: 1,
              ),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(
                color: Color(0xFFF04438),
                width: 2,
              ),
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 12,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildGradientButton({
    required String text,
    required VoidCallback onPressed,
    bool isLoading = false,
  }) {
    return Container(
      width: double.infinity,
      height: 48,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF8862F2), // #8862F2
            Color(0xFF7544FC), // #7544FC at 29%
            Color(0xFF5B2ED4), // #5B2ED4
          ],
          stops: [0.0, 0.29, 1.0],
        ),
        borderRadius: BorderRadius.circular(100),
        border: Border.all(
          width: 1,
          color: Colors.transparent,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0xFF6938EF),
            blurRadius: 0,
            spreadRadius: 1,
            offset: Offset(0, 0),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: isLoading ? null : onPressed,
          borderRadius: BorderRadius.circular(100),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (isLoading) ...[
                  const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Text(
                  text,
                  style: GoogleFonts.roboto(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                    height: 1.43,
                    letterSpacing: 0.1,
                    shadows: const [
                      Shadow(
                        color: Color(0xFF2D1A62),
                        blurRadius: 16,
                        offset: Offset(0, 1),
                      ),
                    ],
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
