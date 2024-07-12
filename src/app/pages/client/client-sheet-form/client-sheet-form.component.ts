import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from '../../../services/leads/leads.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { CilentService } from 'src/app/services/cilent/cilent.service';

@Component({
  selector: 'app-client-sheet-form',
  templateUrl: './client-sheet-form.component.html',
  styleUrls: ['./client-sheet-form.component.scss']
})
export class ClientSheetFormComponent implements OnInit {
  clientForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<ClientSheetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientForm = this._formBuilder.group({
      clientName: [data?.clientName || '', Validators.required],
      clientVertical: [data?.clientVertical || '', Validators.required],
      clientPoc: this._formBuilder.array(this.initClientPoc(data?.clientPoc || [])),
    });
  }

  ngOnInit(): void {
    // You can use patchValue if you need to set values after initialization
    // this.clientForm.patchValue(this.data);
  }

  // Initialize client POC FormArray with existing data or an empty array
  initClientPoc(pocArray: any[]): FormGroup[] {
    return pocArray.length ? pocArray.map(poc => this.createPoc(poc)) : [this.createPoc()];
  }

  // Create POC form group
  createPoc(poc: any = {}): FormGroup {
    return this._formBuilder.group({
      clientPocName: [poc.clientPocName || ''],
      clientPocDesg: [poc.clientPocDesg || ''],
      clientPocNumber: [poc.clientPocNumber || ''],
      clientPocEmail: [poc.clientPocEmail || ''],
      clientPocLinkedin: [poc.clientPocLinkedin || '']
    });
  }

  // Getter for clientPoc FormArray
  get clientPoc(): FormArray {
    return this.clientForm.get('clientPoc') as FormArray;
  }

  // Add a new POC to the FormArray
  addPoc(): void {
    this.clientPoc.push(this.createPoc());
  }

  // Remove a POC from the FormArray
  removePoc(index: number): void {
    this.clientPoc.removeAt(index);
  }

  // Add and update function
  submitLead() {
    // Check if the form is valid
    if (this.clientForm.valid) {
      // Update existing lead
      if (this.data?._id) {
        this.clientService.updateClientById(this.data._id, this.clientForm.value).subscribe({
          next: (val) => {
            this._snackBar.open('Lead updated successfully', 'Close', {
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
        this.clientService.addClient(this.clientForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('Form Submitted Successfully', 'Close', {
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
