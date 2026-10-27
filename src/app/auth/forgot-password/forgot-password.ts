import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface ForgotPasswordForm {
  email: string;
}

@Component({
  selector: 'app-forgot-password',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: ForgotPasswordForm = {
    email: ''
  };

  submitted = false;

  isLoading = false;

  serverError = '';

  successMessage = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(
    private router: Router
  ) {}


  // ==========================================
  // SEND RESET LINK
  // ==========================================

  sendResetLink(): void {

    this.submitted = true;

    this.serverError = '';

    this.successMessage = '';


    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!this.forgotPasswordForm.email) {
      return;
    }


    // ------------------------------------------
    // LOADING
    // ------------------------------------------

    this.isLoading = true;


    // ------------------------------------------
    // TEMPORARY API SIMULATION
    // ------------------------------------------

    setTimeout(() => {

      this.isLoading = false;

      this.successMessage =
        'If an account exists with this email, a password reset link has been sent.';

      console.log(
        'Forgot password request:',
        {
          email:
            this.forgotPasswordForm.email
        }
      );

    }, 1000);
  }


  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  goToLogin(): void {

    this.router.navigate([
      '/auth/login'
    ]);
  }

}