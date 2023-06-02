import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';
import { ApiService } from 'src/app/_services/api.service';
import * as moment from "moment";

@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.css']
})
export class MyspaceComponent implements OnInit {
  public user: any;
  public loaded = false;
  public titleLabel = ['Monsieur', 'Madame'];
  public formGroup = new FormGroup({
    title: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    birthdate: new FormControl(),
    phone: new FormControl(),
  });

  constructor(private api: ApiService, private accountService: AccountService) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    this.loaded = true;
    const formValues: any = {
      title: this.user.title,
      lastname: this.user.lastname,
      firstname: this.user.firstname,
      username: this.user.username,
      phone: this.user.phone,
    }
    if(this.user.birthdate !== null) {
      formValues.birthdate = moment(this.user.birthdate).toDate()
    }
    this.formGroup.patchValue(formValues);
  }

  public save() {
    if(this.formGroup.valid) {
      this.api.putUser(this.user.id, this.formGroup.value).then((res: any) => {
        this.api.success('Vos informations ont bien été modifiées.');
      })
    }
    else {
      this.api.error('Veuillez remplir tous les champs.');
    }
  }
}
