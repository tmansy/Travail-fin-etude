import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-generate-tournament',
  templateUrl: './dialog-generate-tournament.component.html',
  styleUrls: ['./dialog-generate-tournament.component.css']
})
export class DialogGenerateTournamentComponent {

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }

  public generate() {

  }

  public back() {
    this.ref.close();
  }
}
