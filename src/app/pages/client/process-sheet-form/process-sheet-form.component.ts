import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CilentService } from 'src/app/services/cilent/cilent.service';

@Component({
  selector: 'app-process-sheet-form',
  templateUrl: './process-sheet-form.component.html',
  styleUrls: ['./process-sheet-form.component.scss']
})
export class ProcessSheetFormComponent {

  // Creating lead form
  processForm!: FormGroup;
  clientId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<ProcessSheetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.processForm = this._formBuilder.group({
      clientProcessName: [data?.clientProcessName || '', Validators.required],
      clientProcessLanguage: [data?.clientProcessLanguage || '', Validators.required],
      clientProcessCandReq: [data?.clientProcessCandReq || '', Validators.required],
      clientProcessDeadline: [data?.clientProcessDeadline || '', Validators.required],
      clientProcessPckg: [data?.clientProcessPckg || '', Validators.required],
      clientProcessLocation: [data?.clientProcessLocation || [], Validators.required],
      clientProcessJoining: [data?.clientProcessJoining || '', Validators.required],
      clientProcessPerks: [data?.clientProcessPerks || '', Validators.required],
      clientProcessJobDesc: [data?.clientProcessJobDesc || '', Validators.required],
      clientProcessPoc: this._formBuilder.array(this.initProcessPoc(data?.clientProcessPoc || [])),
    });

    this.clientId = data.clientId;
    // this.initProcessPoc(data?.clientProcessPoc || []);
  }

  ngOnInit(): void {
    //  this.leadForm.patchValue(this.data);
  }

   // Initialize process POC FormArray with existing data or an empty array
   initProcessPoc(pocArray: any[]): FormGroup[] {
    return pocArray.length ? pocArray.map(poc => this.createPoc(poc)) : [this.createPoc()];
  }

  createPoc(poc: any = {}): FormGroup {
    return this._formBuilder.group({
      clientProcessPocName: [poc.clientProcessPocName || '', Validators.required],
      clientProcessPocDesg: [poc.clientProcessPocDesg || '', Validators.required],
      clientProcessPocNumber: [poc.clientProcessPocNumber || '', Validators.required],
      clientProcessPocEmail: [poc.clientProcessPocEmail || '', [Validators.required, Validators.email]],
      clientProcessPocLinkedin: [poc.clientProcessPocLinkedin || '']
    });
  }

  // Getter for clientPoc FormArray
  get clientProcessPoc(): FormArray {
    return this.processForm.get('clientProcessPoc') as FormArray;
  }

  // Add a new POC to the FormArray
  addPoc(): void {
    this.clientProcessPoc.push(this.createPoc());
  }

  // Remove a POC from the FormArray
  removePoc(index: number): void {
    this.clientProcessPoc.removeAt(index);
  }


  // Add and update function
   submitLead() {
     // Check if the form is valid
     if (this.processForm.valid) {
       // Update existing lead
       if (this.data?._id) {
         this.clientService
           .updateProcess(this.clientId,this.data._id, this.processForm.value)
           .subscribe({
             next: (val) => {
               this._snackBar.open('Process updated successfully', 'Close', {
                 duration: 3000,
               });
               this._dialogRef.close(true);
             },
             error: (err) => {
               console.error(err);
               this._snackBar.open('Failed to update lead', 'Close', {
                 duration: 3000,
               });
             },
           });
       } else {
         // Create new lead
         this.clientService.addProcess(this.clientId, this.processForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('New Process Added Successfully', 'Close', {
              duration: 3000,
            });
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error('Failed to submit form:', err);
            this._snackBar.open(
              'Failed to submit form: ' + err.message,
              'Close',
              {
                duration: 3000,
              }
            );
          },
        });
       }
     } else {
       this._snackBar.open('Please fill the form', 'Close', {
         duration: 3000,
       });
     }
   }
}
