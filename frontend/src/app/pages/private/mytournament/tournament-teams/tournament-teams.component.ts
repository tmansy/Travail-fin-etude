import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { DialogAddTeamComponent } from '../../dialog/dialog-add-team/dialog-add-team.component';
import { DialogDeleteTeamTournamentComponent } from '../../dialog/dialog-delete-team-tournament/dialog-delete-team-tournament.component';

@Component({
  selector: 'app-tournament-teams',
  templateUrl: './tournament-teams.component.html',
  styleUrls: ['./tournament-teams.component.css']
})
export class TournamentTeamsComponent {
  public roleId: any;
  public user: any;
  public tournamentId: number | undefined;
  public loaded = false;
  public teams: any;
  public selectedTeam: any;

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
      this.tournamentId = +params['tournamentId'];
    });

    this.api.getTournamentWithTeam(this.tournamentId).then((res: any) => {
      this.teams = res.teams_tournaments;
      this.loaded = true;
    })
  }

  public tournamentDialog() {
    this.dialog.open(DialogAddTeamComponent, {
      header: "Ajouter une équipe au tournoi",
      styleClass: "custom-dialog",
      data: this.tournamentId,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    });
  }

  public onRowSelect(event: any) {
    this.dialog.open(DialogDeleteTeamTournamentComponent, {
      header: 'Supprimer une équipe du tournoi',
      styleClass: 'custom-dialog',
      data: event.data,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }
}
