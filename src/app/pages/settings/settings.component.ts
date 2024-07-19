import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }



  employeeName: string = 'John Doe';
  employeeEmail: string = 'john.doe@example.com';
  employeeRole: string = 'Admin';

  logout(){
    localStorage.removeItem("token");
    this.router.navigate(['/login'])
  }

}
