import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, NavigationEnd } from '@angular/router'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Listen to router events to stop/start the token check based on the current route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/login') {
          this.authService.stopTokenExpiryCheck(); // Stop checking on login page
        } else {
          this.authService.startTokenExpiryCheck(); // Start checking on other pages
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Stop the interval when the component is destroyed to avoid memory leaks
    this.authService.stopTokenExpiryCheck();
  }
}
