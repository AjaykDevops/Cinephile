import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule], // ✅ Standalone component imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  mode: 'login' | 'signup' = 'login'; // Login or Signup toggle

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    try {
      if (this.mode === 'login') {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.register(this.email, this.password);
      }
      await this.authService.refreshUser();
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred';
    }
  }

  googleLogin() {
    this.authService
      .googleLogin()
      .then(async () => {
        await this.authService.refreshUser();
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.errorMessage = error.message || 'Google login failed';
        console.error('Google login error:', error);
      });
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'signup' : 'login';
    this.errorMessage = '';
    this.email = '';
    this.password = '';
  }
}
