import 'package:flutter/material.dart';

class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    super.key,
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= 1200) {
          return desktop ?? tablet ?? mobile;
        } else if (constraints.maxWidth >= 768) {
          return tablet ?? mobile;
        } else {
          return mobile;
        }
      },
    );
  }
}

// Utility functions
bool isMobile(BuildContext context) => MediaQuery.of(context).size.width < 768;
bool isTablet(BuildContext context) => 
    MediaQuery.of(context).size.width >= 768 && 
    MediaQuery.of(context).size.width < 1200;
bool isDesktop(BuildContext context) => MediaQuery.of(context).size.width >= 1200;

// Responsive values
T responsive<T>(
  BuildContext context, {
  required T mobile,
  T? tablet,
  T? desktop,
}) {
  if (isDesktop(context) && desktop != null) return desktop;
  if (isTablet(context) && tablet != null) return tablet;
  return mobile;
}
