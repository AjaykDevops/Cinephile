import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      await this.authService.refreshUser(); // ✅ Ensures photoURL is fetched
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      this.router.navigate(['/']); // Redirect after register
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
  // login.component.ts
  googleLogin() {
    this.authService
      .googleLogin()
      .then(async (result) => {
        console.log('Google login successful:', result.user);
        await this.authService.refreshUser(); // 🔄 Ensure user info is up-to-date
        this.router.navigate(['/home']); // ✅ Navigate after refreshing
      })
      .catch((error) => {
        console.error('Google login error:', error);
      });
  }
}
