import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-player',
  templateUrl: './dialog-player.component.html',
  styleUrls: ['./dialog-player.component.css']
})
export class DialogPlayerComponent implements OnInit {
  public players: any;
  public formGroup = new FormGroup({
    username: new FormControl(),
    rank: new FormControl(),
    roleGame: new FormControl(),
    roleTeam: new FormControl(),
  })
  public rankLabel = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grand master', 'Challenger'];
  public roleGameLabel = ['Top', 'Jungle', 'Mid', 'Adc', 'Support'];
  public roleTeamLabel = ['Joueur', 'Coach', 'Capitaine', 'Analyste'];

  constructor(private config: DynamicDialogConfig, private api: ApiService) {
    this.players = this.config.data;
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      username: this.players.user.username,
      rank: this.players.user.rank,
      roleGame: this.players.user.roleGame,
      roleTeam: this.players.roleTeam,
    });
  }

  public save() {
    if(this.formGroup.valid) {
      this.api.putPlayerInfos(this.players.userId, this.formGroup.value).then((res: any) => {
        this.api.success('Les informations ont bien été mises à jours.')
      })
    }
    else {
      this.api.error('Formulaire invalide.');
    }
  }

}
