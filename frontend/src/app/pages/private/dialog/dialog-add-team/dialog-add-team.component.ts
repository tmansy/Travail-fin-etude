import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-add-team',
  templateUrl: './dialog-add-team.component.html',
  styleUrls: ['./dialog-add-team.component.css']
})
export class DialogAddTeamComponent {
  public tournamentId: any;
  public formGroup = new FormGroup({
    teamName: new FormControl(),
  });
  public notRegistredTeams: any[] = [];

  constructor(private api: ApiService, private config: DynamicDialogConfig, private ref: DynamicDialogRef) {
    this.tournamentId = this.config.data;
  }

  ngOnInit(): void {
    this.api.getNotRegistredTeams(this.tournamentId).then((res: any) => {
      for(const team of res) {
        this.notRegistredTeams.push(team.name);
      }
    });
  }

  public addTeam() {
    if(this.formGroup.valid) {
      this.api.postTeamTournament(this.tournamentId, this.formGroup.value).then(() => {
        this.ref.close();
        this.api.success('L\'équipe a été ajoutée au tournoi');
      }).catch(() => {
        this.api.error('Erreur lors de l\'ajout de l\'équipe au tournoi');
      })
    } else {
      this.api.error('Erreur dans le formulaire');
    }
  }
}
