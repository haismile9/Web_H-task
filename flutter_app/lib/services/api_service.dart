import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';
import '../models/user.dart';

class ApiService {
  // Web sử dụng localhost, mobile sử dụng IP khác
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:8000/api';
    } else {
      return 'http://10.0.2.2:8000/api'; // Android emulator
      // return 'http://127.0.0.1:8000/api'; // iOS simulator
    }
  }
  
  late final Dio _dio;
  static const _storage = FlutterSecureStorage();

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Request interceptor to add token
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          if (error.response?.statusCode == 401) {
            // Token expired, clear storage
            clearToken();
          }
          handler.next(error);
        },
      ),
    );
  }

  // 🔐 Auth Methods
  Future<String?> getToken() async {
    return await _storage.read(key: 'token');
  }

  Future<void> saveToken(String token) async {
    await _storage.write(key: 'token', value: token);
  }

  Future<void> clearToken() async {
    await _storage.delete(key: 'token');
  }

  // 📧 Get CSRF Token
  Future<void> getCsrfToken() async {
    try {
      await _dio.get('http://127.0.0.1:8000/sanctum/csrf-cookie');
    } catch (e) {
      print('CSRF Error: $e');
      // Continue anyway for development
    }
  }

  // 🚪 Login
  Future<LoginResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      // Skip CSRF for mobile/web token-based auth
      // await getCsrfToken();

      final response = await _dio.post('/login', data: {
        'email': email,
        'password': password,
      });

      final loginResponse = LoginResponse.fromJson(response.data);
      await saveToken(loginResponse.token);
      
      return loginResponse;
    } on DioException catch (e) {
      if (e.response != null) {
        final errorData = e.response!.data;
        throw ApiError.fromJson(errorData);
      }
      throw ApiError(message: 'Lỗi kết nối: ${e.message}');
    }
  }

  // 📝 Register
  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
  }) async {
    try {
      await getCsrfToken();

      final response = await _dio.post('/register', data: {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': passwordConfirmation,
      });

      return response.data;
    } on DioException catch (e) {
      if (e.response != null) {
        final errorData = e.response!.data;
        throw ApiError.fromJson(errorData);
      }
      throw ApiError(message: 'Lỗi kết nối: ${e.message}');
    }
  }

  // ✅ Verify Email
  Future<LoginResponse> verifyEmail({
    required String email,
    required String code,
  }) async {
    try {
      final response = await _dio.post('/verify-email', data: {
        'email': email,
        'code': code,
      });

      final loginResponse = LoginResponse.fromJson(response.data);
      await saveToken(loginResponse.token);
      
      return loginResponse;
    } on DioException catch (e) {
      if (e.response != null) {
        final errorData = e.response!.data;
        throw ApiError.fromJson(errorData);
      }
      throw ApiError(message: 'Lỗi kết nối: ${e.message}');
    }
  }

  // 👤 Get User Profile
  Future<User> getMe() async {
    try {
      final response = await _dio.get('/me');
      return User.fromJson(response.data);
    } on DioException catch (e) {
      if (e.response != null) {
        final errorData = e.response!.data;
        throw ApiError.fromJson(errorData);
      }
      throw ApiError(message: 'Lỗi kết nối: ${e.message}');
    }
  }

  // 🚪 Logout
  Future<void> logout() async {
    try {
      await _dio.post('/logout');
    } finally {
      await clearToken();
    }
  }
}
