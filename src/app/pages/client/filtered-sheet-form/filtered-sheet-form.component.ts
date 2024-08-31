import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from '../../../services/leads/leads.service';
import { LoginService } from 'src/app/services/login/login.service';
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

  createdBy: string | null = null;
  lastUpdatedBy: string | null = null;

  // Arrays for languages
  foreignLanguages = [
    "Arabic", 
    "French", 
    "German", 
    "Spanish", 
    "English", 
    "Dutch", 
    "Portuguese", 
    "Italian", 
    "Japanese", 
    "Mandarin", 
    "Thai", 
    "Vietnamese", 
    "Bahasa Indonesia", 
    "Bahasa Malaysia", 
    "Malay", 
    "Tagalog", 
    "Tamil", 
    "Malayalam", 
    "Gujarati", 
    "Oriya", 
    "Punjabi", 
    "Assamese", 
    "Bengali", 
    "Hindi",
    "Kannada",
    "Telugu"
  ]; // replace with actual statuses
  proficiencyLevels = [
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'C2',
    'HSK1',
    'HSK2',
    'HSK3',
    'HSK4',
    'HSK5',
    'HSK6',
    'N1',
    'N2',
    'N3',
    'N4',
    'N5',
    'TOPIK I',
    'TOPIK II',
    'Native',
    'Non-Native',
  ];
  regionalLanguages = [
    "Tamil", 
    "Malayalam", 
    "Gujarati", 
    "Oriya", 
    "Punjabi", 
    "Assamese", 
    "Bengali", 
    "Hindi",
    "Kannada",
    "Telugu"
  ];
  filteredLanguages: string[] = [];

  // Creating lead form
  leadForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private leadService: LeadsService,
    private clientService: CilentService,
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<FilteredSheetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leadForm = this._formBuilder.group({
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phone: [data?.phone || '', Validators.required],
      language: this._formBuilder.array([this.createLanguageGroup()]),
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
      linkedinLink: [data?.linkedinLink || ''],
      feedback: [data?.feedback || '', Validators.required],
      remark: [data?.remark || ''],
      company: [data?.company || ''],
      voiceNonVoice: [data?.voiceNonVoice || '', Validators.required],
      source: [data?.source || '', Validators.required],
      createdBy: [null],
      lastUpdatedBy: [null],
    });

    this.clientId = data.clientId;
    this.processId = data.processId;
  }

  ngOnInit(): void {

    // Clear the languages array and initialize it with a blank form group
    this.languages.clear();

    // this.leadForm.patchValue(this.data);

    if (this.data && Array.isArray(this.data.language)) {
      this.data.language.forEach((lang: any, index: number) => {
        const languageGroup = this.createLanguageGroup();
        languageGroup.patchValue(lang);
        this.languages.push(languageGroup);
  
        // Initialize filteredLanguages based on lType
        this.updateLanguages(lang.lType, index);
  
        this.initLanguageTypeChange(index);
      });
    } else {
      // Initialize with a single blank form group
      this.languages.push(this.createLanguageGroup());
  
      // Ensure that we initialize language type change listeners
      this.initLanguageTypeChange(0);
    }
  
    console.log('Languages Form Array After Initialization:', this.languages.value);
  }

    // Function to initialize valueChanges for a specific language group index
    initLanguageTypeChange(index: number) {
      this.updateLanguages(this.languages.at(index).get('lType')?.value, index);
    
      this.languages.at(index).get('lType')?.valueChanges.subscribe((value) => {
        this.updateLanguages(value, index);
      });
    }
    
    updateLanguages(selectedType: string, index: number) {
      const languageGroup = this.languages.at(index);
    
      if (!languageGroup) {
        console.error(`Language group at index ${index} does not exist`);
        return;
      }
    
      const langControl = languageGroup.get('lang');
      const filteredLanguagesControl = languageGroup.get('filteredLanguages');
    
      if (selectedType === 'Foreign') {
        filteredLanguagesControl?.setValue(this.foreignLanguages);
      } else if (selectedType === 'Regional') {
        filteredLanguagesControl?.setValue(this.regionalLanguages);
      } else {
        filteredLanguagesControl?.setValue([]);
      }
    
      langControl?.updateValueAndValidity();
      console.log('Filtered Languages for index', index, ':', filteredLanguagesControl?.value);
    }
    
    
    
    
    // Function to create a new language form group
    createLanguageGroup(): FormGroup {
      return this._formBuilder.group({
        lType: ['', Validators.required],
        lang: ['', Validators.required],
        proficiencyLevel: [''],
        filteredLanguages: [[]],  // Add a control to store filtered languages
      });
    }
    
    
    
    
    get languages(): FormArray {
      return this.leadForm.get('language') as FormArray;
    }
    
    addLanguage() {
      console.log('Adding New Language Group');
      const languageGroup = this.createLanguageGroup();
    
      // Set default value to 'Foreign' and initialize filteredLanguages
      languageGroup.get('lType')?.setValue('Foreign');
      this.languages.push(languageGroup);
    
      // Now, update languages for the new group at the last index
      const newIndex = this.languages.length - 1;
      this.updateLanguages('Foreign', newIndex);
    
      console.log('Languages Form Array After Addition:', this.languages.value);
  
      this._snackBar.open('New language set added successfully!', 'Close', {
        duration: 1000, // duration in milliseconds
      });
    }
    
    
  
    
    // Function to remove a language form group by index
    removeLanguage(index: number) {
      if (this.languages.length > 1) {
        this.languages.removeAt(index);
      }
  
      this._snackBar.open('Language set removed successfully!', 'Close', {
        duration: 1000, // duration in milliseconds
      });
    }
  

    
    // -----------------------------------------

  // Add and update function
  submitLead() {
    // Check if the form is valid
    if (this.leadForm.valid) {
      // Update existing lead
      if (this.data?._id) {

        console.log("exp is: " + this.data.exp);


        // Store lastUpdatedBy field before submission
        this.lastUpdatedBy = this.loginService.getUsername();
        this.leadForm.patchValue({
          lastUpdatedBy: this.lastUpdatedBy,
        });

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

        // Store createdBy field before submission
        this.createdBy = this.loginService.getUsername();
        this.leadForm.patchValue({
          createdBy: this.createdBy,
        });

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
