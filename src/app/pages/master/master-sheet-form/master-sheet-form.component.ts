import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadsService } from '../../../services/leads/leads.service';
import { LoginService } from 'src/app/services/login/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-master-sheet-form',
  templateUrl: './master-sheet-form.component.html',
  styleUrls: ['./master-sheet-form.component.css'],
})
export class MasterSheetFormComponent implements OnInit {


  createdBy : string | null = null;
  createdById: any;
  lastUpdatedBy : string | null = null;
  lastUpdatedById : any;


  // Arrays for languages
  // foreignLanguages = ['French', 'German', 'Spanish', 'English', 'Arabic', 'Japanese', 'Italian', 'Bahasa', 'Vietnamese', 'Chinese'];
  foreignLanguages = [
    "Arabic", 
    "French", 
    "German", 
    "Spanish", 
    "English", 
    "Dutch", 
    "Portuguese", 
    'Korean',
    'Nepali',
    "Italian", 
    "Japanese", 
    "Mandarin", 
    "Thai", 
    "Vietnamese", 
    "Bahasa Indonesia", 
    "Bahasa Malaysia", 
    "Malay", 
    "Tagalog", 
    // "Tamil", 
    // "Malayalam", 
    // "Gujarati", 
    // "Oriya", 
    // "Punjabi", 
    // "Assamese", 
    // "Bengali", 
    // "Hindi",
    // "Kannada",
    // "Telugu"
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
    'TOPIK-I L1',
    'TOPIK-I L2',
    'TOPIK-II L1',
    'TOPIK-II L2',
    'TOPIK-II L3',
    'TOPIK-II L4',
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
    private loginService : LoginService,
    private _snackBar: MatSnackBar,
    private _dialogRef: MatDialogRef<MasterSheetFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.leadForm = this._formBuilder.group({
      name: [data?.name || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phone: [data?.phone || '', Validators.required],
      // lType: [data?.lType || '', Validators.required],
      language: this._formBuilder.array([this.createLanguageGroup()]),
      // proficiencyLevel: [data?.proficiencyLevel || '', Validators.required],
      jbStatus: [data?.jbStatus || ''],
      qualification: [data?.qualification || '', Validators.required],
      industry: [data?.industry || ''],
      domain: [data?.domain || ''],
      exp: [data?.exp || ''],
      cLocation: [data?.cLocation || ''],
      pLocation: [data?.pLocation || ''],
      currentCTC: [data?.currentCTC || ''],
      expectedCTC: [data?.expectedCTC || ''],
      noticePeriod: [data?.noticePeriod || ''],
      wfh: [data?.wfh || ''],
      resumeLink: [data?.resumeLink || '', Validators.required],
      linkedinLink: [data?.linkedinLink || ''],
      feedback: [data?.feedback || '', Validators.required],
      remark: [data?.remark || ''],
      company: [data?.company || ''],
      voiceNonVoice: [data?.voiceNonVoice || ''],
      source: [data?.source || ''],
      createdBy: [null],
      lastUpdatedBy: [null],

      father: [data?.father || ''],
      // dob:[{ value: data?.dob, disabled: true }],
      dob: [data?.dob || ''],
      regId: [data?.regId || ''],
      empId: [data?.empId || ''],
      aadhar: [data?.aadhar || ''],
    });
  }

  ngOnInit(): void {
    // Clear the languages array and initialize it with a blank form group
    this.languages.clear();
  
    if (this.data && Array.isArray(this.data.language)) {
      this.data.language.forEach((lang: any, index: number) => {
        const languageGroup = this.createLanguageGroup();
        languageGroup.patchValue(lang);
        this.languages.push(languageGroup);
  
        // Initialize filteredLanguages based on lType
        this.updateLanguages(lang.lType, index);  // Correct initialization for the edit scenario
  
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
    // Add value change listener for lType
    this.languages.at(index).get('lType')?.valueChanges.subscribe((value) => {
      this.updateLanguages(value, index);
    });
  
    // Update filtered languages immediately upon initialization
    const selectedType = this.languages.at(index).get('lType')?.value;
    if (selectedType) {
      this.updateLanguages(selectedType, index);
    }
  }

  // Ensure this part is inside your component class
get languages(): FormArray {
  return this.leadForm.get('language') as FormArray;  // Ensure 'language' is the correct control name
}

  
  updateLanguages(selectedType: string, index: number) {
    const languageGroup = this.languages.at(index);
  
    if (!languageGroup) {
      console.error(`Language group at index ${index} does not exist`);
      return;
    }
  
    const langControl = languageGroup.get('lang');
    const filteredLanguagesControl = languageGroup.get('filteredLanguages');
  
    // Update filtered languages based on selectedType
    if (selectedType === 'Foreign') {
      filteredLanguagesControl?.setValue(this.foreignLanguages);
    } else if (selectedType === 'Regional') {
      filteredLanguagesControl?.setValue(this.regionalLanguages);
    } else {
      filteredLanguagesControl?.setValue([]);
    }
  
    // If the current lang value is not in the new filtered languages, reset it
    if (!filteredLanguagesControl?.value.includes(langControl?.value)) {
      langControl?.setValue('');
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
      filteredLanguages: [[]],  // Control to store filtered languages
    });
  }
  
  addLanguage() {
    console.log('Adding New Language Group');
    const languageGroup = this.createLanguageGroup();
  
    // No default lType value, waits for user selection
    this.languages.push(languageGroup);
  
    const newIndex = this.languages.length - 1;
    this.initLanguageTypeChange(newIndex);  // Proper initialization for new language set
  
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


  // ---------------------------------------------

  // Add and update function
  submitLead() {
    console.log(this.leadForm.value);
    // Check if the form is valid
    if (this.leadForm.valid) {

      // Update existing lead
      if (this.data?._id) {

        // Store lastUpdatedBy field before submission
        this.lastUpdatedBy = this.loginService.getUsername();
        this.lastUpdatedById = this.loginService.getRecruiterId();

        this.leadForm.patchValue({
          lastUpdatedBy: this.lastUpdatedBy,
          lastUpdatedById: this.lastUpdatedById,
        });


    // // Check if DOB exists and format it to DD/MM/YYYY
    // let formValue = this.leadForm.value;
    // if (formValue.dob) {
    //   formValue.dob = formatDate(formValue.dob, 'dd/MM/yyyy', 'en-US');
    // }

        this.leadService.updateLeadById(this.data._id, this.leadForm.value).subscribe({
          next: (val) => {
            this._snackBar.open('Lead updated successfully', 'Close', {
              duration: 3000,
            });
            this._dialogRef.close(true);
          },
          error: (err) => {
            console.error(err);
            const errorMessage = err?.error?.message;
            if (errorMessage === 'Candidate with this phone number already exists.') {
              this._snackBar.open('This candidate is already registered', 'Close', {
                duration: 3000,
              }); 
            } else {
              this._snackBar.open('Failed to update lead', 'Close', {
                duration: 3000,
              });
            }
          },
        });
      } else {

        // Create new lead


        // Store createdBy field before submission
        this.createdBy = this.loginService.getUsername();
        this.createdById = this.loginService.getRecruiterId();

        this.leadForm.patchValue({
          createdBy: this.createdBy,
          createdById: this.createdById
        });

      //   // Check if DOB exists and format it to DD/MM/YYYY
      // let formValue = this.leadForm.value;
      // if (formValue.dob) {
      //   formValue.dob = formatDate(formValue.dob, 'dd/MM/yyyy', 'en-US');
      // }


        this.leadService.createLead(this.leadForm.value).subscribe({
          next: (val: any) => {
            this._snackBar.open('Form Submitted Successfully', 'Close', {
              duration: 3000,
            });
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error('Failed to submit form:', err);
            const errorMessage = err?.error?.message;
            if (errorMessage === 'Candidate with this phone number already exists.') {
              this._snackBar.open('Candidate has been already registered', 'Close', {
                duration: 3000,
              });
            } else {
              this._snackBar.open('Failed to submit form', 'Close', {
                duration: 3000,
              });
            }
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
