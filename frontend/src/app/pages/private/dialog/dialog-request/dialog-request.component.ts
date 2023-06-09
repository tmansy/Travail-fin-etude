import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-request',
  templateUrl: './dialog-request.component.html',
  styleUrls: ['./dialog-request.component.css']
})
export class DialogRequestComponent implements OnInit {
  public data: any;
  public user: any;
  public loaded = false;
  public request: any;
  public formGroup = new FormGroup({
    title: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    birthdate: new FormControl(),
    phone: new FormControl(),
    street: new FormControl(),
    houseNumber: new FormControl(),
    zip_code: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
    message: new FormControl(),
  })

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.request = this.config.data;
   }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if(userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    this.formGroup.patchValue({
      title: this.request.title,
      lastname: this.request.lastname,
      firstname: this.request.firstname,
      username: this.request.username,
      birthdate: this.request.birthdate,
      phone: this.request.phone,
      street: this.request.street,
      houseNumber: this.request.houseNumber,
      zip_code: this.request.zip_code,
      city: this.request.city,
      country: this.request.country,
      message: this.request.message,
    });

    this.loaded = true;
  }

  public requestManagement(status: string) {
    if(status === "Validée") {
      this.data = {
        'modified_by': this.user.username,
        'status': 'Acceptée',
      }

      this.api.putRequestManagement(this.request.id, this.data).then((res: any) => {
        this.ref.close();
        this.api.success('La demande d\'affiliation a bien été acceptée');
      })
    }
    else if(status === "Refusée") {
      this.data = {
        'modified_by': this.user.username,
        'status': 'Refusée',
      }

      this.api.putRequestManagement(this.request.id, this.data).then((res: any) => {
        this.ref.close();
        this.api.success('La demande d\'affiliation a été refusée');
      })
    }
    else {
      this.api.error('Il y a une erreur dans l\'envoi du formulaire');
    }
  }

}
