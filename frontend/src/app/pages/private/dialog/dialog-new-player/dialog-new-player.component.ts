import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-new-player',
  templateUrl: './dialog-new-player.component.html',
  styleUrls: ['./dialog-new-player.component.css']
})
export class DialogNewPlayerComponent implements OnInit {
  public users: any;
  public formGroup = new FormGroup({
    username: new FormControl(),
    roleTeam: new FormControl(),
    teamId: new FormControl(),
  });
  public roleTeamLabel = ['Joueur', 'Remplacant', 'Coach', 'Capitaine', 'Analyste'];

  constructor(private api: ApiService, private config: DynamicDialogConfig, private ref: DynamicDialogRef) {
    this.formGroup.get('teamId')?.setValue(this.config.data);
   }

  ngOnInit(): void {
    this.api.getUsers().then((res: any) => {
      this.users = res.map((user: any) => ({
        label: user.username,
        value: user.username,
      }))
    })
  }

  public save() {
    if(this.formGroup.valid) {
      this.api.postPlayer(this.formGroup.value).then((res: any) => {
        this.ref.close();
        this.api.success('Le joueur a bien été ajouté à l\'équipe');
      })
    }
    else {
      this.api.error('Formulaire invalide.');
    }
  }

}
