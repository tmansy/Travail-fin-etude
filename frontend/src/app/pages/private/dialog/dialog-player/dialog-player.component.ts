import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-player',
  templateUrl: './dialog-player.component.html',
  styleUrls: ['./dialog-player.component.css']
})
export class DialogPlayerComponent implements OnInit {
  public roleId: any;
  public user: any;
  public players: any;
  public formGroup = new FormGroup({
    username: new FormControl(),
    rank: new FormControl(),
    roleGame: new FormControl(),
    roleTeam: new FormControl(),
  })
  public rankLabel = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grand master', 'Challenger'];
  public roleGameLabel = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
  public roleTeamLabel = ['Joueur', 'Remplacant', 'Coach', 'Capitaine', 'Analyste'];
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
  public roleTeamEnum: { [key: string]: number } = {
    'Administrateur': 0,
    'Joueur': 1,
    'Capitaine': 2,
    'Remplaçant': 3,
  }

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.players = this.config.data;
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

    this.formGroup.patchValue({
      username: this.players.user.username,
      rank: this.players.user.rank,
      roleGame: this.players.user.roleGame,
      roleTeam: this.players.roleTeam,
    });
  }

  public save() {
    if(this.formGroup.valid) {
      const formValue = this.formGroup.value;
      formValue.rank = this.mapRankToEnum(formValue.rank);
      formValue.roleGame = this.mapRoleGameToEnum(formValue.roleGame);
      formValue.roleTeam = this.mapRoleTeamToEnum(formValue.roleTeam);

      this.api.putPlayerInfos(this.players.userId, formValue).then((res: any) => {
        this.ref.close();
        this.api.success('Les informations ont bien été mises à jour.')
      })
    }
    else {
      this.api.error('Formulaire invalide.');
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

  mapRoleTeamToEnum(roleTeam: string) {
    return this.roleTeamEnum[roleTeam];
  }

  mapRoleTeamToEnumName(roleTeamValue: number) {
    for(const key in this.roleTeamEnum) {
      if(this.roleTeamEnum[key] === roleTeamValue) {
        return key;
      }
    }
    return '';
  }
}
