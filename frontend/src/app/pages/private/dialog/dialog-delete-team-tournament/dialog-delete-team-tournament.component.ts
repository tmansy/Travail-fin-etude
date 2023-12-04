import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-delete-team-tournament',
  templateUrl: './dialog-delete-team-tournament.component.html',
  styleUrls: ['./dialog-delete-team-tournament.component.css']
})
export class DialogDeleteTeamTournamentComponent {
  public team: any;

  constructor(private api: ApiService, private ref: DynamicDialogRef,  private config: DynamicDialogConfig) {
    this.team = this.config.data;
  }

  ngOnInit(): void {
    
  }

  public save() {
    this.api.deleteTeamTournament(this.team.id).then(() => {
      this.ref.close();
      this.api.success('L\'équipe a été supprimée du tournoi');
    }).catch(() => {
      this.api.error('Impossible de supprimer l\'équipe du tournoi');
    })
  }
}
