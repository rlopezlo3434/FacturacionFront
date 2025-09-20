import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  loading: boolean = false;
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  login() {
    this.loading = true;
   
    this.authService.login({ username: this.usuario, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open('Login exitoso', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'] 
        });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Error al iniciar sesión', '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'] 
        });
      },
    });
  }
}
