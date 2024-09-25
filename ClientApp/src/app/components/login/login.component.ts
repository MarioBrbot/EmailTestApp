import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  submitted: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.submitted = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['compose']);
        }
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      },
    });
  }
}

