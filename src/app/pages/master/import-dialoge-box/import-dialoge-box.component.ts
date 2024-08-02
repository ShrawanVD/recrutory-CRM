import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-dialoge-box',
  templateUrl: './import-dialoge-box.component.html',
  styleUrls: ['./import-dialoge-box.component.css']
})
export class ImportDialogeBoxComponent {

  data: any;

  constructor(
    public dialogRef: MatDialogRef<ImportDialogeBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  onFileChangess(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    };
    reader.readAsBinaryString(target.files[0]);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpload(): void {
    this.dialogRef.close(this.data);
  }
}


