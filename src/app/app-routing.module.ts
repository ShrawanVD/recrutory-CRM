import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { AfterLoginComponent } from './components/after-login/after-login.component';
import { AuthGuard } from './guards/auth.guard';
import { MasterSheetComponent } from './pages/master/master-sheet/master-sheet.component';
import { ClientSheetComponent } from './pages/client/client-sheet/client-sheet.component';
import { ProcessSheetComponent } from './pages/client/process-sheet/process-sheet.component';
import { InterestedSheetComponent } from './pages/client/interested-sheet/interested-sheet.component';
import { SelectedSheetComponent } from './pages/selected/selected-sheet/selected-sheet.component';
import { SelectedProcessSheetComponent } from './pages/selected/selected-process-sheet/selected-process-sheet.component';
import { FinalSelectedSheetComponent } from './pages/selected/final-selected-sheet/final-selected-sheet.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard', component: AfterLoginComponent, children: [
      { path: 'master', component: MasterSheetComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'client', component: ClientSheetComponent },
      { path: 'client/:id', component: ProcessSheetComponent },
      { path: 'client/:id/process/:processId', component: InterestedSheetComponent },
      { path: 'selected', component: SelectedSheetComponent },
      { path: 'selected/:id', component: SelectedProcessSheetComponent },
      { path: 'selected/:id/process/:processId', component: FinalSelectedSheetComponent },
      
    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
