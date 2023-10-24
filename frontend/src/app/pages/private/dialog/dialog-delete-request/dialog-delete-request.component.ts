import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-delete-request',
  templateUrl: './dialog-delete-request.component.html',
  styleUrls: ['./dialog-delete-request.component.css']
})
export class DialogDeleteRequestComponent {
  public userId!: number;

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }
  
  ngOnInit(): void {
    const userIdString = localStorage.getItem('userId');
    if (userIdString !== null) {
      this.userId = parseInt(userIdString, 10);
    } 
  }

  public save(){
    this.api.deleteRequest(this.userId).then(() => {
      this.ref.close();
      this.api.success('Votre affiliation a été supprimée avec succès');
    }).catch((err) => {
      this.api.error(err);
    });
  }
}
