import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-delete-sponsor',
  templateUrl: './dialog-delete-sponsor.component.html',
  styleUrls: ['./dialog-delete-sponsor.component.css']
})
export class DialogDeleteSponsorComponent implements OnInit {
  public sponsor: any;

  constructor(private config: DynamicDialogConfig, private api: ApiService, private ref: DynamicDialogRef) {
    this.sponsor = this.config.data;
  }

  ngOnInit(): void {
  }

  public delete(res: string) {
    if(res === 'Oui') {
      this.api.deleteSponsor(this.sponsor.id).then(() => {
        this.ref.close();
        this.api.success('Le sponsor a bien été supprimé');
      })
    }
    if(res === 'Non') {
      this.ref.close();
    }
  }
}
