import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../models/user.dart';
import '../services/api_service.dart';

// States
abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {}

class AuthLoading extends AuthState {}

class AuthEmailStep extends AuthState {
  final String email;

  const AuthEmailStep(this.email);

  @override
  List<Object?> get props => [email];
}

class AuthPasswordStep extends AuthState {
  final String email;

  const AuthPasswordStep(this.email);

  @override
  List<Object?> get props => [email];
}

class AuthSuccess extends AuthState {
  final User user;
  final String token;

  const AuthSuccess({required this.user, required this.token});

  @override
  List<Object?> get props => [user, token];
}

class AuthError extends AuthState {
  final String message;
  final Map<String, List<String>>? fieldErrors;

  const AuthError({
    required this.message,
    this.fieldErrors,
  });

  @override
  List<Object?> get props => [message, fieldErrors];
}

// Events
abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthEmailSubmitted extends AuthEvent {
  final String email;

  const AuthEmailSubmitted(this.email);

  @override
  List<Object?> get props => [email];
}

class AuthPasswordSubmitted extends AuthEvent {
  final String email;
  final String password;

  const AuthPasswordSubmitted({
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [email, password];
}

class AuthBackToEmail extends AuthEvent {}

class AuthLogout extends AuthEvent {}

class AuthCheckStatus extends AuthEvent {}

// Bloc
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final ApiService _apiService;

  AuthBloc({required ApiService apiService})
      : _apiService = apiService,
        super(AuthInitial()) {
    on<AuthEmailSubmitted>(_onEmailSubmitted);
    on<AuthPasswordSubmitted>(_onPasswordSubmitted);
    on<AuthBackToEmail>(_onBackToEmail);
    on<AuthLogout>(_onLogout);
    on<AuthCheckStatus>(_onCheckStatus);
  }

  void _onEmailSubmitted(
    AuthEmailSubmitted event,
    Emitter<AuthState> emit,
  ) {
    emit(AuthPasswordStep(event.email));
  }

  Future<void> _onPasswordSubmitted(
    AuthPasswordSubmitted event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());

    try {
      final loginResponse = await _apiService.login(
        email: event.email,
        password: event.password,
      );

      emit(AuthSuccess(
        user: loginResponse.user,
        token: loginResponse.token,
      ));
    } on ApiError catch (e) {
      emit(AuthError(
        message: e.message,
        fieldErrors: e.errors,
      ));
    } catch (e) {
      emit(AuthError(message: 'Đã xảy ra lỗi: $e'));
    }
  }

  void _onBackToEmail(
    AuthBackToEmail event,
    Emitter<AuthState> emit,
  ) {
    emit(AuthInitial());
  }

  Future<void> _onLogout(
    AuthLogout event,
    Emitter<AuthState> emit,
  ) async {
    try {
      await _apiService.logout();
    } catch (e) {
      // Log error but continue with logout
      print('Logout error: $e');
    }
    emit(AuthInitial());
  }

  Future<void> _onCheckStatus(
    AuthCheckStatus event,
    Emitter<AuthState> emit,
  ) async {
    // Tạm thời mock user để test UI
    final mockUser = User(
      id: 1,
      name: 'Nguyen Van A',
      email: 'test@example.com',
      position: 'Junior Full Stack Developer',
      avatar: null,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    
    emit(AuthSuccess(user: mockUser, token: 'mock_token'));
    return;
    
    // Code login thực (comment tạm thời)
    /*
    final token = await _apiService.getToken();
    if (token != null) {
      try {
        final user = await _apiService.getMe();
        emit(AuthSuccess(user: user, token: token));
      } catch (e) {
        await _apiService.clearToken();
        emit(AuthInitial());
      }
    } else {
      emit(AuthInitial());
    }
    */
  }
}
