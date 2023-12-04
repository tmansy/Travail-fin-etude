import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-update-match',
  templateUrl: './dialog-update-match.component.html',
  styleUrls: ['./dialog-update-match.component.css']
})
export class DialogUpdateMatchComponent {
  public matchData: any;
  public formGroup = new FormGroup({
    winner: new FormControl(),
    winnerScore: new FormControl(),
    loser: new FormControl(),
    loserScore: new FormControl(),
  });
  public opponents: any[] = [];

  constructor(private api: ApiService, private config: DynamicDialogConfig, private ref: DynamicDialogRef) {
    this.matchData = this.config.data;
  }

  ngOnInit(): void {
    let teams_tournament = {
      teams_tournamentId: [this.matchData.opponent1.id, this.matchData.opponent2.id],
    }
    
    this.api.postTeamsTournament(this.matchData.tournamentId, teams_tournament).then((res: any) => {
      for(const team of res) {
        this.opponents.push(team.team.name);
      }
    })
  }

  public save() {
    if(this.matchData.status == 2) {

    } else {
      this.api.error('Le match est fini et ne peut pas être modifié');
    }
  }
}
