import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-new-tournament',
  templateUrl: './dialog-new-tournament.component.html',
  styleUrls: ['./dialog-new-tournament.component.css']
})
export class DialogNewTournamentComponent implements OnInit {
  public formGroup = new FormGroup({
    name: new FormControl(),
    type: new FormControl(),
    description: new FormControl(),
    prize: new FormControl(),
  });

  public typeLabel = ['Simple élimination', 'Double élimination', 'Round-robin'];

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  public save() {
    if(this.formGroup.valid) {
      this.api.postTournament(this.formGroup.value).then((res: any) => {
        this.ref.close();
        this.api.success('Le tournoi a bien été créé');
      })
    }
    else {
      this.api.error('Formulaire invalide');
    }

  }

}
