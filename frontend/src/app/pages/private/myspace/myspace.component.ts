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
  public gameLabel = ['League of Legends', 'Teamfight Tactics'];
  public roleGameLabel = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
  public rankLabel = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grand master', 'Challenger'];
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
  });

  constructor(private api: ApiService) { }

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
    this.formGroup.patchValue(formValues);
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
}
