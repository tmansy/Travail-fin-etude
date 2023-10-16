import { Component, OnInit } from '@angular/core';
import { DialogNewTournamentComponent } from '../dialog/dialog-new-tournament/dialog-new-tournament.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  public loaded = false;
  public user: any;
  public roleId: any;
  public tournaments: any;

  constructor(public api: ApiService, public dialog: DialogService, public router: Router) { }

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

    this.api.getTournaments().then((res: any) =>{
      this.tournaments = res;
    })

    this.loaded = true;
  }

  public tournamentDialog() {
    this.dialog.open(DialogNewTournamentComponent, {
      header: "Création d'un nouveau tournoi",
      styleClass: 'custom-dialog',
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

  public goTo(tournament: any) {
    this.router.navigateByUrl(`/mytournament/${tournament.id}/settings`);
  }

}
