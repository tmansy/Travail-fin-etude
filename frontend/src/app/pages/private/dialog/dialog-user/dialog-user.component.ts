import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css']
})
export class DialogUserComponent implements OnInit {
  public roleId: any;
  public user: any;
  public users: any;
  public formGroup = new FormGroup({
    username: new FormControl(),
    status: new FormControl(),
    usernameInGame: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    email: new FormControl(),
    createdAt: new FormControl(),
  });

  public statusEnum: { [key: string]: number } = {
    'Affilié': 0,
    'Refusé': 1,
    'En attente': 2,
    'Non-affilié': 3,
  }

  constructor(private config: DynamicDialogConfig) {
    this.users = this.config.data;
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    const roleIdString = localStorage.getItem('roleId');
    if (roleIdString !== null) {
      const roleId = JSON.parse(roleIdString);
      this.roleId = roleId;
    }

    const formattedCreatedAt = moment(this.users.createdAt).format("DD-MM-YYYY");

    this.formGroup.patchValue({
      username: this.users.username,
      lastname: this.users.lastname,
      firstname: this.users.firstname,
      email: this.users.email,
      usernameInGame: this.users.usernameInGame ? this.users.usernameInGame : 'Non renseigné',
      createdAt: formattedCreatedAt,
      status: this.users.membershipRequests[0] ? this.mapStatusToEnumName(this.users.membershipRequests[0].status) : 'Non-affilié',
    });
  }

  public ban() {

  }

  mapStatusToEnum(statusValue: string) {
    return this.statusEnum[statusValue];
  }

  mapStatusToEnumName(statusValue: number) {
    for(const key in this.statusEnum) {
      if(this.statusEnum[key] === statusValue) {
        return key;
      }
    }
    return '';
  }
}
