import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { AfterLoginComponent } from './components/after-login/after-login.component';
import { AuthGuard } from './guards/auth.guard';
import { MasterSheetComponent } from './pages/master/master-sheet/master-sheet.component';
import { ClientSheetComponent } from './pages/client/client-sheet/client-sheet.component';
import { ProcessSheetComponent } from './pages/client/process-sheet/process-sheet.component';
import { FilteredSheetComponent } from './pages/client/filtered-sheet/filtered-sheet.component';
import { FinalSelectedSheetComponent } from './pages/selected/final-selected-sheet/final-selected-sheet.component';
import { InterestedSheetComponent } from './pages/client/interested-sheet/interested-sheet.component';
import { TodaysTaskComponent } from './pages/recruiter/todays-task/todays-task.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'dashboard', component: AfterLoginComponent, children: [
      { path: 'master', component: MasterSheetComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'client', component: ClientSheetComponent },
      { path: 'client/:id', component: ProcessSheetComponent },
      { path: 'client/:id/process/:processId', component: FilteredSheetComponent },
      { path: 'client/:id/process/:processId/interested', component: InterestedSheetComponent },
      { path: 'selected', component: FinalSelectedSheetComponent },
      { path: 'todays-task', component: TodaysTaskComponent },

    ],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
