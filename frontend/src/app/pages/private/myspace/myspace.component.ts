import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.css']
})
export class MyspaceComponent implements OnInit {
  public user: any;
  public loaded = false;
  public titleLabel = [
    {
      id: 1,
      label: 'Monsieur',
    },
    {
      id: 2,
      label: 'Madame',
    }
  ];
  public formGroup = new FormGroup({
    title: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    birthdate: new FormControl(),
    phoneNumber: new FormControl(),
  });

  constructor(private api: ApiService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.user = this.accountService.user;
    this.loaded = true;
    this.formGroup.patchValue({
      title: this.user.title,
      lastname: this.user.lastname,
      firstname: this.user.firstname,
      username: this.user.username,
      birthdate: this.user.birthdate,
      phoneNumber: this.user.phoneNumber,
    })
  }

  public save() {

  }
}
