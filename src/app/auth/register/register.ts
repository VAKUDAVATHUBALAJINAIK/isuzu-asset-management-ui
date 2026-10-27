import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface RegisterForm {
  fullName: string;
  email: string;
  employeeId: string;
  adminCode: string;
  password: string;
  confirmPassword: string;
  role: 'employee' | 'admin';
  terms: boolean;
}

@Component({
  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {

  registerForm: RegisterForm = {
    fullName: '',
    email: '',
    employeeId: '',
    adminCode: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    terms: false
  };

  submitted = false;

  showPassword = false;

  showConfirmPassword = false;

  isLoading = false;

  serverError = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private router: Router
  ) {}


  // ==========================================
  // ROLE SELECTION
  // ==========================================

  selectRole(
    role: 'employee' | 'admin'
  ): void {

    this.registerForm.role = role;

    // Employee selected
    if (role === 'employee') {
      this.registerForm.adminCode = '';
    }

    // Admin selected
    if (role === 'admin') {
      this.registerForm.employeeId = '';
    }

    this.serverError = '';

    this.submitted = false;
  }


  // ==========================================
  // PASSWORD VISIBILITY
  // ==========================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;
  }


  // ==========================================
  // CONFIRM PASSWORD VISIBILITY
  // ==========================================

  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;
  }


  // ==========================================
  // PASSWORD MATCH VALIDATION
  // ==========================================

  get passwordMismatch(): boolean {

    return (
      !!this.registerForm.password &&
      !!this.registerForm.confirmPassword &&
      this.registerForm.password !==
        this.registerForm.confirmPassword
    );
  }


  // ==========================================
  // REGISTER
  // ==========================================

  register(): void {

    this.submitted = true;

    this.serverError = '';


    // ------------------------------------------
    // COMMON VALIDATION
    // ------------------------------------------

    if (
      !this.registerForm.fullName ||
      !this.registerForm.email ||
      !this.registerForm.password ||
      !this.registerForm.confirmPassword
    ) {

      return;
    }


    // ------------------------------------------
    // PASSWORD LENGTH
    // ------------------------------------------

    if (
      this.registerForm.password.length < 8
    ) {

      return;
    }


    // ------------------------------------------
    // PASSWORD MATCH
    // ------------------------------------------

    if (
      this.passwordMismatch
    ) {

      return;
    }


    // ------------------------------------------
    // EMPLOYEE VALIDATION
    // ------------------------------------------

    if (
      this.registerForm.role === 'employee' &&
      !this.registerForm.employeeId
    ) {

      return;
    }


    // ------------------------------------------
    // ADMIN VALIDATION
    // ------------------------------------------

    if (
      this.registerForm.role === 'admin' &&
      !this.registerForm.adminCode
    ) {

      return;
    }


    // ------------------------------------------
    // TERMS VALIDATION
    // ------------------------------------------

    if (
      !this.registerForm.terms
    ) {

      return;
    }


    // ------------------------------------------
    // LOADING
    // ------------------------------------------

    this.isLoading = true;


    // ------------------------------------------
    // TEMPORARY REGISTRATION
    // ------------------------------------------

    setTimeout(() => {

      this.isLoading = false;

      console.log(
        'Register request:',
        {

          fullName:
            this.registerForm.fullName,

          email:
            this.registerForm.email,

          role:
            this.registerForm.role,

          employeeId:
            this.registerForm.role === 'employee'
              ? this.registerForm.employeeId
              : null,

          adminCode:
            this.registerForm.role === 'admin'
              ? this.registerForm.adminCode
              : null,

          password:
            this.registerForm.password,

          terms:
            this.registerForm.terms

        }
      );


      // ----------------------------------------
      // NAVIGATE TO LOGIN
      // ----------------------------------------

      this.router.navigate([
        '/auth/login'
      ]);

    }, 1000);
  }
}