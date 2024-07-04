import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { AfterLoginComponent } from './components/after-login/after-login.component';
import { AuthGuard } from './guards/auth.guard';
import { MasterSheetComponent } from './pages/master/master-sheet/master-sheet.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard', component: AfterLoginComponent, children: [
      { path: 'master', component: MasterSheetComponent },
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
