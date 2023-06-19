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
  public gameLabel = ['League of Legends', 'Teamfight Tactics'];
  public roleGameLabel = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
  public rankLabel = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grand master', 'Challenger'];
  public countryLabel = ['Belgique', 'France', 'Suisse', 'Canada'];
  public formGroup = new FormGroup({
    title: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    game: new FormControl(),
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
      game: this.user.game,
      roleGame: this.user.roleGame,
      rank: this.user.rank,
      phone: this.user.phone,
    }

    if(this.user.birthdate !== null) {
      formValues.birthdate = moment(this.user.birthdate).toDate()
    }

    this.api.getRequest(this.user.id).then((res) => {
      this.membership_request = res;
      if(this.membership_request.status == "Accepter") {
        formValues.status = "Affilié";
      }
      else if (this.membership_request.status == "Refuser") {
        formValues.status = "Refusé";
      }
      else {
        formValues.status = "En attente";
      }
      this.formGroup.patchValue(formValues);
    }).catch(() => {
      formValues.status = "Non-affilié";
      this.formGroup.patchValue(formValues);
    })
  }

  public save() {
    if(this.formGroup.valid) {
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
    this.dialog.open(DialogMembershipRequestsComponent, {
      header: 'Résumé de la demande de validation',
      styleClass: 'custom-dialog',
      data: this.formGroup.value,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }
}
