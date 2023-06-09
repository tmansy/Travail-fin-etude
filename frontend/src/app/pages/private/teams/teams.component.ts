import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogTeamsComponent } from '../dialog/dialog-teams/dialog-teams.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeamsComponent implements OnInit {
  public user: any;
  public teams: any;
  public loaded = false;
  public roleId: any;

  constructor(public router: Router, private api: ApiService, private dialog: DialogService) { }

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

    this.loaded = true;
    this.api.getTeamsByPlayer(this.user.id).then((res: any) => {
      this.teams = res;
    })
  }

  public teamsDialog() {
    this.dialog.open(DialogTeamsComponent, {
      header: "Création d'une nouvelle équipe",
      styleClass: 'custom-dialog',
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

  public goTo(team: any) {
    this.router.navigateByUrl(`/myteam/${team.team.id}/settings`);
  }
  
}
