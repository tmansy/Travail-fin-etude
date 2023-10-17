import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import * as moment from "moment";
import { DialogService } from 'primeng/dynamicdialog';
import { DialogMembershipRequestsComponent } from '../dialog/dialog-membership-requests/dialog-membership-requests.component';

@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.css']
})
export class MyspaceComponent implements OnInit {
  public user: any;
  public membership_request: any;
  public loaded = false;
  public titleLabel = ['Monsieur', 'Madame'];
  public roleGameLabel = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
  public rankLabel = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grand master', 'Challenger'];
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
  public countryLabel = ['Belgique', 'France', 'Suisse', 'Canada'];
  public formGroup = new FormGroup({
    title: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    roleGame: new FormControl(),
    rank: new FormControl(),
    birthdate: new FormControl(),
    phone: new FormControl(),
    status: new FormControl(),
    street: new FormControl(),
    houseNumber: new FormControl(),
    zip_code: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
  });

  constructor(private api: ApiService, private dialog: DialogService) { }

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
      roleGame: this.user.roleGame,
      rank: this.user.rank,
      phone: this.user.phone,
      street: this.user.street,
      houseNumber: this.user.house_number,
      zip_code: this.user.zip_code,
      city: this.user.city,
      country: this.user.country,
    }

    if(this.user.birthdate !== null) {
      formValues.birthdate = moment(this.user.birthdate).toDate()
    }

    formValues.rank = this.mapRankToEnumName(formValues.rank);
    formValues.roleGame = this.mapRoleGameToEnumName(formValues.roleGame);

    this.api.getRequest(this.user.id).then((res) => {
      this.membership_request = res;
      console.log(res)
      if (this.membership_request.status == 0) {
        formValues.status = "Affilié";
      }
      else if (this.membership_request.status == 1) {
        formValues.status = "Refusé";
      }
      else if (this.membership_request.status == 2) {
        formValues.status = "En attente de validation";
      }
      else {
        formValues.status = "Non-affilié";
      }

      this.formGroup.patchValue(formValues);
    }).catch(() => {
      formValues.status = "Non-affilié";
      this.formGroup.patchValue(formValues);
    })
  }

  public save() {
    if(this.formGroup.valid) {
      const formValue = this.formGroup.value;
      formValue.rank = this.mapRankToEnum(formValue.rank);
      formValue.roleGame = this.mapRoleGameToEnum(formValue.roleGame);

      this.api.putUserInfos(this.user.id, this.formGroup.value).then((res: any) => {
        localStorage.setItem('user', JSON.stringify(res));
        this.api.success('Vos informations ont bien été modifiées.');
      })
    }
    else {
      this.api.error('Formulaire invalide.');
    }
  }

  public openDialog() {
    if(this.formGroup.get('title')?.value && this.formGroup.get('lastname')?.value 
      && this.formGroup.get('firstname')?.value && this.formGroup.get('username')?.value 
      && this.formGroup.get('phone')?.value && this.formGroup.get('birthdate')?.value 
      && this.formGroup.get('street')?.value && this.formGroup.get('houseNumber')?.value 
      && this.formGroup.get('zip_code')?.value && this.formGroup.get('city')?.value
      && this.formGroup.get('country')?.value) {
      this.dialog.open(DialogMembershipRequestsComponent, {
        header: 'Résumé de la demande d\'affiliation',
        styleClass: 'custom-dialog',
        data: this.formGroup.value,
      }).onClose.subscribe(() => {
        this.ngOnInit();
      })
    }
    else {
      this.api.error('Veuillez remplir vos informations.');
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
