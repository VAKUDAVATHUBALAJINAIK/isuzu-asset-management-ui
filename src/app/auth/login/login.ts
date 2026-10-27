import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface LoginForm {
  email: string;
  password: string;
  adminCode: string;
  role: 'employee' | 'admin';
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  loginForm: LoginForm = {
    email: '',
    password: '',
    adminCode: '',
    role: 'employee',
    rememberMe: false
  };

  submitted = false;
  showPassword = false;
  isLoading = false;

  serverError = '';
  successMessage = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // ==========================================
  // ROLE SELECTION
  // ==========================================

  selectRole(
    role: 'employee' | 'admin'
  ): void {

    this.loginForm.role = role;

    if (role === 'employee') {
      this.loginForm.adminCode = '';
    }

    this.serverError = '';
    this.successMessage = '';
    this.submitted = false;
  }

  // ==========================================
  // PASSWORD
  // ==========================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;
  }

  // ==========================================
  // LOGIN
  // ==========================================

  login(): void {

    this.submitted = true;

    this.serverError = '';
    this.successMessage = '';

    // Common validation
    if (
      !this.loginForm.email ||
      !this.loginForm.password
    ) {
      return;
    }

    // Password validation
    if (
      this.loginForm.password.length < 6
    ) {
      return;
    }

    // Admin-only validation
    if (
      this.loginForm.role === 'admin' &&
      !this.loginForm.adminCode
    ) {
      return;
    }

    // ==========================================
    // API REQUEST
    // ==========================================

    this.isLoading = true;

    const loginData = {
      email_Address: this.loginForm.email,
      password: this.loginForm.password
    };

    console.log(
      'Sending login request:',
      loginData
    );

    this.authService
      .login(loginData)
      .subscribe({

        // ======================================
        // SUCCESS RESPONSE
        // ======================================

        next: (response) => {

          this.isLoading = false;

          console.log(
            'Backend response:',
            response
          );

          if (response.status) {

            // Display backend message
            this.successMessage =
              response.message;

            // Navigate to dashboard
            setTimeout(() => {

              this.router.navigate([
                '/dashboard'
              ]);

            }, 1000);

          } else {

            this.serverError =
              response.message ||
              'Login failed.';
          }
        },

        // ======================================
        // ERROR RESPONSE
        // ======================================

        error: (error) => {

          this.isLoading = false;

          console.error(
            'Login API error:',
            error
          );

          this.serverError =
            error.error?.message ||
            'Unable to connect to the server.';
        }

      });
  }
}