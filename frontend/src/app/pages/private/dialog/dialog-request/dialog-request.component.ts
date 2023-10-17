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
  public roleId: any;
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

    const roleIdString = localStorage.getItem('roleId');
    if (roleIdString !== null) {
      const roleId = JSON.parse(roleIdString);
      this.roleId = roleId;
    }

    this.formGroup.patchValue({
      title: this.request.userDatas.title,
      lastname: this.request.userDatas.lastname,
      firstname: this.request.userDatas.firstname,
      username: this.request.userDatas.username,
      birthdate: this.request.userDatas.birthdate,
      phone: this.request.userDatas.phone,
      street: this.request.userDatas.street,
      houseNumber: this.request.userDatas.house_number,
      zip_code: this.request.userDatas.zip_code,
      city: this.request.userDatas.city,
      country: this.request.userDatas.country,
      message: this.request.message,
    });

    this.loaded = true;
  }

  public requestManagement(status: string) {
    if(status === "Validée") {
      this.data = {
        'modified_by': this.user.username,
        'status': 0,
      }

      this.api.putRequestManagement(this.request.id, this.data).then((res: any) => {
        this.ref.close();
        this.api.success('La demande d\'affiliation a bien été acceptée');
      })
    }
    else if(status === "Refusée") {
      this.data = {
        'modified_by': this.user.username,
        'status': 1,
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
