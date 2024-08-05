import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadsService } from 'src/app/services/leads/leads.service';
import { LoginService } from 'src/app/services/login/login.service';

@Component({
  selector: 'app-add-member-form',
  templateUrl: './add-member-form.component.html',
  styleUrls: ['./add-member-form.component.css']
})
export class AddMemberFormComponent implements OnInit {
  leadForm!: FormGroup;
  isEditing: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<AddMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditing = !!data;

    this.leadForm = this._formBuilder.group({
      username: [data?.username || '', Validators.required],
      role: [data?.role || '', Validators.required],
      password: ['', this.isEditing ? Validators.nullValidator : Validators.required]
      // confirmPassword: ['', this.isEditing ? Validators.nullValidator : Validators.required]
    });
  }


  ngOnInit(): void {
    if (this.isEditing) {
      this.leadForm.patchValue(this.data);
    }
  }

  submitLead() {
    if (this.leadForm.valid) {
      console.log(this.leadForm.value); // Log form values to check data
      if (this.isEditing) {
        const updateData = { ...this.leadForm.value };
  
        // If password is empty, remove it from updateData
        if (!updateData.password) {
          delete updateData.password;
        }
  
        console.log('Update Data:', updateData); // Log data being sent to backend
  
        this.loginService.editUser(this.data._id, updateData).subscribe({
          next: () => {
            this._snackBar.open('User updated successfully', 'Close', { duration: 3000 });
            this._dialogRef.close(true);
          },
          error: (err) => {
            console.error(err);
            this._snackBar.open('Failed to update User', 'Close', { duration: 3000 });
          }
        });
      } else {
        this.loginService.registerUser(this.leadForm.value).subscribe({
          next: () => {
            this._snackBar.open('User Registered Successfully', 'Close', { duration: 3000 });
            this._dialogRef.close(true);
          },
          error: (err) => {
            console.error('Failed to submit the form:', err);
            this._snackBar.open('Failed to submit form: ' + err.message, 'Close', { duration: 3000 });
          }
        });
      }
    } else {
      this._snackBar.open('Please fill the form', 'Close', { duration: 3000 });
    }
  }
  
}






// import { Component, Inject, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { LeadsService } from 'src/app/services/leads/leads.service';
// import { MasterSheetFormComponent } from '../../master/master-sheet-form/master-sheet-form.component';
// import { LoginService } from 'src/app/services/login/login.service';

// @Component({
//   selector: 'app-add-member-form',
//   templateUrl: './add-member-form.component.html',
//   styleUrls: ['./add-member-form.component.css']
// })
// export class AddMemberFormComponent implements OnInit {

//   // Creating lead form
//   leadForm!: FormGroup;

//   constructor(
//     private _formBuilder: FormBuilder,
//     private loginService: LoginService,
//     private _snackBar: MatSnackBar,
//     private _dialogRef: MatDialogRef<MasterSheetFormComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any
//   ) {

//     this.leadForm = this._formBuilder.group({
//       username: [data?.username || '', Validators.required],
//       role: [data?.role || '', Validators.required],
//       password: [data?.password || '', Validators.required],
//     });
//   }

//   ngOnInit(): void {
//     this.leadForm.patchValue(this.data);
//   }


//   // Add and update function
//   submitLead() {
//     console.log(this.leadForm.value);
//     // Check if the form is valid
//     if (this.leadForm.valid) {
//       // Update existing lead
//       if (this.data?._id) {
//         this.loginService
//           .editUser(this.data._id, this.leadForm.value)
//           .subscribe({
//             next: (val) => {
//               this._snackBar.open('User updated successfully', 'Close', {
//                 duration: 3000,
//               });
//               this._dialogRef.close(true);
//             },
//             error: (err) => {
//               console.error(err);
//               this._snackBar.open('Failed to update User', 'Close', {
//                 duration: 3000,
//               });
//             },
//           });
//       } else {
//         // Create new lead
//         this.loginService.registerUser(this.leadForm.value).subscribe({
//           next: (val: any) => {
//             this._snackBar.open('User Registered Successfully', 'Close', {
//               duration: 3000,
//             });
//             this._dialogRef.close(true);
//           },
//           error: (err: any) => {
//             console.error('Failed to submit the form:', err);
//             this._snackBar.open(
//               'Failed to submit form: ' + err.message,
//               'Close',
//               {
//                 duration: 3000,
//               }
//             );
//           },
//         });
//       }
//     } else {
//       this._snackBar.open('Please fill the form', 'Close', {
//         duration: 3000,
//       });
//     }
//   }

// }
