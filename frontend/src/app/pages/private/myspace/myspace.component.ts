import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import * as moment from "moment";
import { DialogService } from 'primeng/dynamicdialog';
import { DialogMembershipRequestsComponent } from '../dialog/dialog-membership-requests/dialog-membership-requests.component';
import { DialogDeleteRequestComponent } from '../dialog/dialog-delete-request/dialog-delete-request.component';

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
    house_number: new FormControl(),
    zip_code: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
    createdAt: new FormControl(),
    updatedAt: new FormControl(),
    usernameInGame: new FormControl(),
    adminMessage: new FormControl(),
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
      house_number: this.user.house_number,
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

      formValues.createdAt = this.membership_request.createdAt;
      formValues.updatedAt = this.membership_request.updatedAt;
      formValues.adminMessage = this.membership_request.adminMessage;
      formValues.usernameInGame = this.membership_request.userDatas.usernameInGame;
      
      this.formGroup.patchValue(formValues);
    }).catch(() => {
      formValues.status = "Non-affilié";
      this.formGroup.patchValue(formValues);
    })
  }

  public save() {
    if(this.formGroup.valid) {
      if(this.formGroup.get('status')?.value == 'En attente de validation') {
        this.api.error('Vous ne pouvez pas modifier vos informations si une demande d\'affiliation a été introduite. Veuillez contacter le support.');
      }
      else if (this.formGroup.get('status')?.value == 'Affilié') {
        this.api.error('Vous ne pouvez pas modifier vos informations si vous êtes affilié. Veuillez contacter le support.');
      }
      else {
        const formValue = this.formGroup.value;
        formValue.rank = this.mapRankToEnum(formValue.rank);
        formValue.roleGame = this.mapRoleGameToEnum(formValue.roleGame);
        formValue.usernameInGame = this.formGroup.get('usernameInGame')?.value;

        this.api.putUserInfos(this.user.id, this.formGroup.value).then((res: any) => {
          localStorage.setItem('user', JSON.stringify(res));
          this.api.success('Vos informations ont bien été modifiées.');
        })
      };
    }
    else {
      this.api.error('Formulaire invalide.');
    }
  }

  public openDialog(action: number) {
    if(action == 0) {
      if(this.formGroup.get('title')?.value && this.formGroup.get('lastname')?.value 
        && this.formGroup.get('firstname')?.value && this.formGroup.get('username')?.value 
        && this.formGroup.get('phone')?.value && this.formGroup.get('birthdate')?.value 
        && this.formGroup.get('street')?.value && this.formGroup.get('house_number')?.value
        && this.formGroup.get('zip_code')?.value && this.formGroup.get('city')?.value
        && this.formGroup.get('country')?.value && this.formGroup.get('rank')?.value
        && this.formGroup.get('roleGame') && this.formGroup.get('usernameInGame')) {
        this.dialog.open(DialogMembershipRequestsComponent, {
          header: 'Récapatilatif de la demande',
          styleClass: 'custom-dialog',
          data: this.formGroup.value,
        }).onClose.subscribe(() => {
          this.ngOnInit();
        })
      }
      else {
        this.api.error('Veuillez remplir toutes vos informations.');
      }
    }
    else if (action == 1) {
      this.dialog.open(DialogDeleteRequestComponent, {
        header: 'Annuler ma demande d\'affiliation',
        styleClass: 'custom-dialog',
      }).onClose.subscribe(() => {
        this.ngOnInit();
      });
    }
    else if (action == 2) {
      this.dialog.open(DialogDeleteRequestComponent, {
        header: 'Supprimer mon affiliation',
        styleClass: 'custom-dialog',
      }).onClose.subscribe(() => {
        this.ngOnInit();
      });
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

  getStatusColor(status: string): string {
    if (status === 'En attente de validation') {
      return '#7ac6ed';
    } 
    else if (status === "Affilié") {
      return '#4e8857';
    } 
    else if (status === "Non-affilié") {
      return "#ecc73c";
    } 
    else if (status === "Refusé") {
      return "#bd3d4b";
    }
    else {
      return '';
    }
  }

  getChipIcon(status: string): string {
    switch (status) {
      case 'Affilié':
        return 'pi pi-check';
      case 'Non-affilié':
        return 'pi pi-search';
      case 'Refusé':
        return 'pi pi-times';
      case "En attente de validation":
        return 'pi pi-question';
      default:
        return '';
    }
  }
  
}
