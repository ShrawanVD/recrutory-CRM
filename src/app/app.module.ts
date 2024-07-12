import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BodyComponent } from './components/body/body.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SettingsComponent } from './pages/settings/settings.component';

import {
  FormControlName,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { LoginComponent } from './pages/login/login.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AfterLoginComponent } from './components/after-login/after-login.component';
import { SelectedSheetComponent } from './pages/selected/selected-sheet/selected-sheet.component';
import { ClientSheetComponent } from './pages/client/client-sheet/client-sheet.component';
import { ClientSheetFormComponent } from './pages/client/client-sheet-form/client-sheet-form.component';
import { MasterSheetComponent } from './pages/master/master-sheet/master-sheet.component';
import { MasterSheetFormComponent } from './pages/master/master-sheet-form/master-sheet-form.component';
import { ProcessSheetComponent } from './pages/client/process-sheet/process-sheet.component';
import { ProcessSheetFormComponent } from './pages/client/process-sheet-form/process-sheet-form.component';
import { InterestedSheetComponent } from './pages/client/interested-sheet/interested-sheet.component';
import { InterestedSheetFormComponent } from './pages/client/interested-sheet-form/interested-sheet-form.component';
import { CilentPocComponent } from './pages/client/client-sheet/cilent-poc/cilent-poc.component';
import { ProcessPocComponent } from './pages/client/process-sheet/process-poc/process-poc.component';
import { SelectedProcessSheetComponent } from './pages/selected/selected-process-sheet/selected-process-sheet.component';
import { FinalSelectedSheetComponent } from './pages/selected/final-selected-sheet/final-selected-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyComponent,
    SidenavComponent,
    SettingsComponent,
    LoginComponent,
    AfterLoginComponent,
    MasterSheetComponent,
    MasterSheetFormComponent,
    SelectedSheetComponent,
    ClientSheetComponent,
    ClientSheetFormComponent,
    MasterSheetComponent,
    MasterSheetFormComponent,
    ProcessSheetComponent,
    ProcessSheetFormComponent,
    InterestedSheetComponent,
    InterestedSheetFormComponent,
    CilentPocComponent,
    ProcessPocComponent,
    SelectedProcessSheetComponent,
    FinalSelectedSheetComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule,
    HttpClientModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    AngularEditorModule,
    HttpClientModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
