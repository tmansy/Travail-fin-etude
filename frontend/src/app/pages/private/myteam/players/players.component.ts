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
      this.players = res;
    })

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

}
