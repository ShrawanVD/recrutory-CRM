import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from '../../../services/leads/leads.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { CilentService } from 'src/app/services/cilent/cilent.service';
@Component({
  selector: 'app-filtered-sheet-form',
  templateUrl: './filtered-sheet-form.component.html',
  styleUrls: ['./filtered-sheet-form.component.scss']
})
export class FilteredSheetFormComponent {
  clientId: any;
  processId: any;

  // Arrays for languages
  foreignLanguages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Bahasa', 'Vietnamese', 'Chinese'];
  regionalLanguages = ['Nepalese', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi'];
  filteredLanguages: string[] = [];

  // Creating lead form
  leadForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private leadService: LeadsService,
    private clientService: CilentService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<FilteredSheetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leadForm = this._formBuilder.group({
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phone: [data?.phone || '', Validators.required],
      lType: [data?.lType || '', Validators.required],
      language: [data?.language || [], Validators.required],
      proficiencyLevel: [data?.proficiencyLevel || '', Validators.required],
      jbStatus: [data?.jbStatus || '', Validators.required],
      qualification: [data?.qualification || '', Validators.required],
      industry: [data?.industry || '', Validators.required],
      domain: [data?.domain || '', Validators.required],
      exp: [data?.exp || '', Validators.required],
      cLocation: [data?.cLocation || '', Validators.required],
      pLocation: [data?.pLocation || '', Validators.required],
      currentCTC: [data?.currentCTC || '', Validators.required],
      expectedCTC: [data?.expectedCTC || '', Validators.required],
      noticePeriod: [data?.noticePeriod || '', Validators.required],
      wfh: [data?.wfh || '', Validators.required],
      resumeLink: [data?.resumeLink || '', Validators.required],
      linkedinLink: [data?.linkedinLink || '', Validators.required],
      feedback: [data?.feedback || ''],
      remark: [data?.remark || ''],
      company: [data?.company || '', Validators.required],
      voiceNonVoice: [data?.voiceNonVoice || '', Validators.required],
      source: [data?.source || '', Validators.required],
    });

    this.clientId = data.clientId;
    this.processId = data.processId;
  }

  ngOnInit(): void {
    this.leadForm.patchValue(this.data);

    // Set filteredLanguages based on the initial lType value
    if (this.leadForm.get('lType')?.value) {
      this.updateLanguages(this.leadForm.get('lType')?.value);
    }

    // Watch for changes in the lType field
    this.leadForm.get('lType')?.valueChanges.subscribe(value => {
      this.updateLanguages(value);
    });
  }

  updateLanguages(selectedType: string) {
    if (selectedType === 'Foreign') {
      this.filteredLanguages = this.foreignLanguages;
    } else if (selectedType === 'Regional') {
      this.filteredLanguages = this.regionalLanguages;
    } else {
      this.filteredLanguages = [];
    }
  }

  // Add and update function
  submitLead() {
    // Check if the form is valid
    if (this.leadForm.valid) {
      // Update existing lead
      if (this.data?._id) {
        this.clientService.updateFilteredCandidate(this.clientId, this.processId, this.data._id, this.leadForm.value)
          .subscribe({
            next: (val) => {
              this._snackBar.open('Candidate updated successfully', 'Close', {
                duration: 3000,
              });
              this._dialogRef.close(true);
            },
            error: (err) => {
              console.error(err);
              this._snackBar.open('Failed to update candidate data', 'Close', {
                duration: 3000,
              });
            },
          });
      } else {
        // Create new lead
        this.leadService.createLead(this.leadForm.value).subscribe({
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