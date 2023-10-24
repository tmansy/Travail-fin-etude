import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { DialogPlayerComponent } from '../../dialog/dialog-player/dialog-player.component';
import { DialogNewPlayerComponent } from '../../dialog/dialog-new-player/dialog-new-player.component';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  public user: any;
  public loaded = false;
  public players: any;
  public teamId: number | undefined;
  public selectedPlayer: any;
  public roleId: any;
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

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private dialog: DialogService) { }

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

    this.activatedRoute.parent?.params.subscribe((params) => {
      this.teamId = +params['teamId'];
    })

    this.api.getPlayersByTeam(this.teamId).then((res: any) => {
      this.players = res.map((player: any) => ({
        ...player,
        roleTeam: this.mapRoleTeamToEnumName(player.roleTeam),
        user: {
          ...player.user,
          rank: this.mapRankToEnumName(player.user.rank),
          roleGame: this.mapRoleGameToEnumName(player.user.roleGame)
        }
      }));
    });

    this.loaded = true;
  }

  public playerDialog() {
    this.dialog.open(DialogNewPlayerComponent, {
      header: "Ajouter un joueur dans l'équipe",
      styleClass: 'custom-dialog',
      data: this.teamId,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

  public onRowSelect(event: any) {
    this.dialog.open(DialogPlayerComponent, {
      header: "Modifier les informations sur le joueur",
      styleClass: 'custom-dialog',
      data: event.data,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
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
