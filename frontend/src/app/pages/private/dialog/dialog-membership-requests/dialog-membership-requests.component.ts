import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-membership-requests',
  templateUrl: './dialog-membership-requests.component.html',
  styleUrls: ['./dialog-membership-requests.component.css']
})
export class DialogMembershipRequestsComponent implements OnInit {
  public user: any;
  public formGroup = new FormGroup({
    userId: new FormControl(),
    title: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    birthdate: new FormControl(),
    phone: new FormControl(),
    street: new FormControl(),
    house_number: new FormControl(),
    zip_code: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
    message: new FormControl(),
    rank: new FormControl(),
    roleGame: new FormControl(),
    usernameInGame: new FormControl(),
  });
  
  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.config.data.birthdate = moment(this.config.data.birthdate).format("DD-MM-YYYY");
    this.formGroup.patchValue(this.config.data);
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if(userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
      this.formGroup.get('userId')?.setValue(this.user.id);
    }
  }

  public save() {
    if(this.formGroup.valid) {
      this.api.postMembershipRequest(this.formGroup.value).then((res: any) => {
        this.ref.close();
        this.api.success('La demande d\'affiliation a bien été effectuée.');
      })
    }
    else {
      this.api.error('Formulaire invalide.');
    }
  }
}
