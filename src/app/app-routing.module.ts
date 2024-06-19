import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs/blogs.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MediaComponent } from './media/media.component';
import { PagesComponent } from './pages/pages.component';
import { TeachersComponent } from './teachers/teachers.component';
import { SettingsComponent } from './settings/settings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoginComponent } from './login/login.component';
import { AfterLoginComponent } from './after-login/after-login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard', component: AfterLoginComponent, children: [
      { path: 'dash', component: DashboardComponent },
      { path: 'teachers', component: TeachersComponent },
      { path: 'lms', component: StatisticsComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'course', component: PagesComponent },
      { path: 'media', component: MediaComponent },
      { path: 'settings', component: SettingsComponent },
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
