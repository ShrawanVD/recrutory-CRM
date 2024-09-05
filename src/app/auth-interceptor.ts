import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private snackBar: MatSnackBar) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check for 403 Forbidden error
        if (error.status === 403) {
          // Show snackbar message
          this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 3000 });

          localStorage.clear();
          
          // Redirect to login page
          this.router.navigate(['/login']);
        }
        // Pass any other errors to the caller
        return throwError(error);
      })
    );
  }
}
