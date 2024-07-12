import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CilentService } from 'src/app/services/cilent/cilent.service';

interface Person {
    clientPocName: string;
    clientPocDesg: string;
    clientPocNumber: Number;
    clientPocEmail: string;
    clientPocLinkedin: string;
}
@Component({
    selector: 'app-cilent-poc',
    templateUrl: './cilent-poc.component.html',
    styleUrls: ['./cilent-poc.component.scss']
})
export class CilentPocComponent {
    clientId: any;
    persons: Person[] = [];

    constructor(private clientService: CilentService, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.clientId = data.clientId
    }

    ngOnInit(): void {
        this.fetchPersons();
    }

    fetchPersons() {
        this.clientService.getClientById(this.clientId).subscribe({
            next: (res: any) => {
                this.persons = res.clientPoc
            }
        })
    }

}
