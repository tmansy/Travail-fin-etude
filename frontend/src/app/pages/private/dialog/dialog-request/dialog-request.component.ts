import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
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
    house_number: new FormControl(),
    zip_code: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
    message: new FormControl(),
    rank: new FormControl(),
    roleGame: new FormControl(),
    usernameInGame: new FormControl(),
    adminMessage: new FormControl(),
  });
  public rankEnum: { [key: string]: number } = {
    'Iron': 0,
    'Bronze': 1,
    'Silver': 2,
    'Gold': 3,
    'Platinum': 4,
    'Emerald': 5,
    'Diamond': 6,
    'Master': 7,
    'Grand master': 8,
    'Challenger': 9
  }
  public roleGameEnum: { [key: string]: number } = {
    'Top': 0,
    'Jungle': 1,
    'Mid': 2,
    'Adc': 3,
    'Support': 4,
  }

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.config.data.userDatas.birthdate = moment(this.config.data.birthdate).format("DD-MM-YYYY");
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
      house_number: this.request.userDatas.house_number,
      zip_code: this.request.userDatas.zip_code,
      city: this.request.userDatas.city,
      country: this.request.userDatas.country,
      message: this.request.message,
      roleGame: this.mapRoleGameToEnumName(this.request.userDatas.roleGame),
      rank: this.mapRankToEnumName(this.request.userDatas.rank),
      usernameInGame: this.request.userDatas.usernameInGame,
    });

    this.loaded = true;
  }

  public requestManagement(status: string) {
    if(status === "Validée") {
      this.data = {
        'modified_by': this.user.id,
        'status': 0,
        'adminMessage': this.formGroup.get('adminMessage')?.value,
      }

      this.api.putRequestManagement(this.request.id, this.data).then((res: any) => {
        this.ref.close();
        this.api.success('La demande d\'affiliation a bien été acceptée');
      })
    }
    else if(status === "Refusée") {
      this.data = {
        'modified_by': this.user.id,
        'status': 1,
        'adminMessage': this.formGroup.get('adminMessage')?.value,
      }

      this.api.putRequestManagement(this.request.id, this.data).then((res: any) => {
        this.ref.close();
        this.api.success('La demande d\'affiliation a été refusée');
      })
    }
    else {
      this.api.error('Il y a une erreur dans le formulaire');
    }
  }

  mapRankToEnum(rankValue: string) {
    return this.rankEnum[rankValue];
  }

  mapRankToEnumName(rankValue: number) {
    for(const key in this.rankEnum) {
      if(this.rankEnum[key] === rankValue) {
        return key;
      }
    }
    return '';
  }

  mapRoleGameToEnum(roleGame: string) {
    return this.roleGameEnum[roleGame];
  }

  mapRoleGameToEnumName(roleGameValue: number) {
    for(const key in this.roleGameEnum) {
      if(this.roleGameEnum[key] === roleGameValue) {
        return key;
      }
    }
    return '';
  }

}
