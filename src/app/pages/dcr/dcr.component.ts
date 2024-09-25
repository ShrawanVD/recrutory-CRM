
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeadsService } from 'src/app/services/leads/leads.service';
import { LoginService } from 'src/app/services/login/login.service';
import * as XLSX from 'xlsx';

interface Candidate {
  assignProcess: string;
  name: string;
  language: string;
  phone: string;
  cLocation: string;
  feedback: string;
  regStatus: string;
  regId: string;
  iaScore: string;
  resumeLink: string;
}

// Type for feedbackMapping
const feedbackMapping: { [key: string]: string | string[] } = {
  CNR: 'Call Not Recieved',
  Interested: 'Interested',
  Connected: [
    'NI - CTC Not Matching',
    'NI - Relocation Issue',
    'NI - Notice Period',
    'NI - Cooling Down Period',
    'NI - Under Qualified',
    'NI - already associated with an org',
    'Currently not looking for a job',
    'Rejected',
  ],
};

@Component({
  selector: 'app-dcr',
  templateUrl: './dcr.component.html',
  styleUrls: ['./dcr.component.css'],
})
export class DcrComponent implements OnInit {
  openFilters: boolean = false;

  displayedColumns: string[] = [
    'assignProcess',
    'name',
    'language',
    'phone',
    'cLocation',
    'feedback',
    'regStatus',
    'regId',
    'iaScore',
    'resumeLink',
  ];

  id: any;

  dataSource!: MatTableDataSource<Candidate>;
  filterValues: any = {};
  selectedConnection: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  connection = ['Connected', 'Interested', 'CNR'];

  constructor(
    private leadService: LeadsService,
    private loginService: LoginService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = this.loginService.getRecruiterId();
    this.getReport(this.id);
  }

  getReport(id: string): void {
    this.leadService.getReporting(id).subscribe({
      next: (res: any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.filterPredicate = this.createFilter();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: console.log,
    });
  }

  // Get total connected calls excluding "Call Not Recieved"
  getTotalConnectedCalls(): number {
    return this.dataSource.filteredData.filter(
      (candidate) => candidate.feedback.toLowerCase() !== 'call not recieved'
    ).length;
  }

  // Get total number of rows (total calls)
  getTotalCalls(): number {
    return this.dataSource.filteredData.length;
  }

  // Get total "Interested" candidates
  getTotalInterested(): number {
    return this.dataSource.filteredData.filter(
      (candidate) => candidate.feedback.toLowerCase() === 'interested'
    ).length;
  }

  // Get total "Pending" candidates based on registration status
  getTotalPending(): number {
    return this.dataSource.filteredData.filter(
      (candidate) =>
        candidate.feedback.toLowerCase() === 'interested' &&
        (!candidate.regStatus ||
          candidate.regStatus.toLowerCase() === 'pending')
    ).length;
  }

  // ------------------------------- Filters Section

  // Apply feedback-based filter from dropdown
  applyDropdownFilter(value: string, column: string) {
    console.log('Selected filter value is: ' + value);

    // Set the filter value for the column (feedback)
    this.filterValues[column] = value;

    // Apply the filter
    this.dataSource.filter = JSON.stringify(this.filterValues);

    // Reset the paginator to the first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Clear all filters and reset the table
  clearFilters() {
    this.selectedConnection = null; // Reset dropdown selection
    this.filterValues = {}; // Clear all filter values
    this.dataSource.filter = ''; // Clear the datasource filter

    // Reset paginator to the first page
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Create custom filter for feedback values, including multiple options for "Connected"
  createFilter(): (data: Candidate, filter: string) => boolean {
    return (data: Candidate, filter: string): boolean => {
      const filterValues = JSON.parse(filter);
      const matchFilter: boolean[] = [];

      for (const key in filterValues) {
        if (filterValues[key]) {
          if (key === 'feedback') {
            const filterValue = filterValues[key];

            // Handle specific feedback mapping comparisons
            if (filterValue === 'CNR') {
              matchFilter.push(data.feedback === feedbackMapping['CNR']);
            } else if (filterValue === 'Interested') {
              matchFilter.push(data.feedback === feedbackMapping['Interested']);
            } else if (filterValue === 'Connected') {
              matchFilter.push(
                (feedbackMapping['Connected'] as string[]).includes(
                  data.feedback
                )
              );
            }
          }
        }
      }

      // Return true only if all filters match
      return matchFilter.every(Boolean);
    };
  }

  // ---------------------------------- Export to CSV -----------------------------------

  export(): void {
    const data = this.dataSource.filteredData;
  
    // Add call statistics
    const statistics = [
      { label: 'Dialed Calls', value: this.getTotalCalls() },
      { label: 'Connected Calls', value: this.getTotalConnectedCalls() },
      { label: 'Interested', value: this.getTotalInterested() },
      { label: 'Registrations Pending', value: this.getTotalPending() },
    ];
  
    // CSV Header
    const csvHeaders = [
      'Process',
      'Name',
      'Language',
      'Phone',
      'Location',
      'Feedback',
      'Registration Status',
      'Registration ID',
      'IA Score',
      'Resume Link',
    ];
  
    let csvContent = 'data:text/csv;charset=utf-8,';
  
    // Add the statistics at the top of the CSV
    statistics.forEach((stat) => {
      csvContent += `"${stat.label}","${stat.value}"\n`;
    });
  
    csvContent += '\n'; // Add a blank line after statistics
  
    // Add the column headers
    csvContent += csvHeaders.map(header => `"${header}"`).join(',') + '\n';
  
    // Add the data rows
    data.forEach((candidate) => {
      // Check if language is an array and format it accordingly
      const formattedLanguage = Array.isArray(candidate.language)
        ? candidate.language.map((lang: any) => `${lang.lType} - ${lang.lang} - ${lang.proficiencyLevel}`).join(', ')
        : candidate.language || '';  // Handle the case when it's a string or empty
  
      const row = [
        candidate.assignProcess,
        candidate.name,
        formattedLanguage, // Use the formatted language string here
        candidate.phone,
        candidate.cLocation,
        candidate.feedback,
        candidate.regStatus,
        candidate.regId,
        candidate.iaScore,
        candidate.resumeLink
      ].map(field => `"${field || ''}"`).join(',');
  
      csvContent += row + '\n';
    });
  
    // Create a downloadable CSV file with IST timestamp in the file name
    const now = new Date();
    now.setHours(now.getHours() + 5, now.getMinutes() + 30); // Adjust for IST (UTC +5:30)
    const istTimestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, '-'); // Format as 'YYYY-MM-DD-HH-MM-SS'
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `report_${istTimestamp}_IST.csv`);
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  }
  
  
  
  

  // export(): void {
  //   const data = this.dataSource.filteredData;
  
  //   // Add call statistics
  //   const statistics = [
  //     { label: 'Dialed Calls', value: this.getTotalCalls() },
  //     { label: 'Connected Calls', value: this.getTotalConnectedCalls() },
  //     { label: 'Interested', value: this.getTotalInterested() },
  //     { label: 'Registrations Pending', value: this.getTotalPending() },
  //   ];
  
  //   // CSV Header
  //   const headers = [
  //     'Process',
  //     'Name',
  //     'Language',
  //     'Phone',
  //     'Location',
  //     'Feedback',
  //     'Registration Status',
  //     'Registration ID',
  //     'IA Score',
  //     'Resume Link',
  //   ];
  
  //   const formattedData = data.map((candidate) => {
  //     // Check if language is an array and format it accordingly
  //     const formattedLanguage = Array.isArray(candidate.language)
  //       ? candidate.language.map((lang: any) => `${lang.lType} - ${lang.lang} - ${lang.proficiencyLevel}`).join(', ')
  //       : candidate.language || ''; // Handle the case when it's a string or empty
  
  //     return {
  //       'Process': candidate.assignProcess,
  //       'Name': candidate.name,
  //       'Language': formattedLanguage, // Use the formatted language string here
  //       'Phone': candidate.phone,
  //       'Location': candidate.cLocation,
  //       'Feedback': candidate.feedback,
  //       'Registration Status': candidate.regStatus,
  //       'Registration ID': candidate.regId,
  //       'IA Score': candidate.iaScore,
  //       'Resume Link': candidate.resumeLink,
  //     };
  //   });
  
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
  
  //   // Add headers
  //   XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 'A1' });
  
  //   // Center align all cells and make headers bold
  //   const range = XLSX.utils.decode_range(ws['!ref']!);
  //   for (let row = range.s.r; row <= range.e.r; row++) {
  //     for (let col = range.s.c; col <= range.e.c; col++) {
  //       const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
  //       if (ws[cellAddress]) {
  //         ws[cellAddress].s = {
  //           alignment: { horizontal: 'center' },  // Center align
  //           font: row === 0 ? { bold: true } : {}, // Make headers bold
  //         };
  //       }
  //     }
  //   }
  
  //   // Add statistics at the top
  //   const stats = statistics.map(stat => [`${stat.label}:`, `${stat.value}`]);
  //   XLSX.utils.sheet_add_aoa(ws, stats, { origin: -1 });
  
  //   // Generate the file name in IST
  //   const now = new Date();
  //   now.setHours(now.getHours() + 5, now.getMinutes() + 30); // Adjust for IST (UTC +5:30)
  //   const istTimestamp = now.toISOString().slice(0, 19).replace(/[:T]/g, '-'); // Format as 'YYYY-MM-DD-HH-MM-SS'
  
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
  
  //   const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  //   this.saveAsExcelFile(wbout, `report_${istTimestamp}_IST.xlsx`);
  // }
  
  // saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  //   const link = document.createElement('a');
  //   const url = window.URL.createObjectURL(data);
  //   link.href = url;
  //   link.download = fileName;
  //   link.click();
  //   window.URL.revokeObjectURL(url);
  // }
}


// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';