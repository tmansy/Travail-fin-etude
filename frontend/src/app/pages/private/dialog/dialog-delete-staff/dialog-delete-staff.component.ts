import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-delete-staff',
  templateUrl: './dialog-delete-staff.component.html',
  styleUrls: ['./dialog-delete-staff.component.css']
})
export class DialogDeleteStaffComponent implements OnInit {
  public loaded = false;

  constructor(private api: ApiService, private config: DynamicDialogConfig, private ref: DynamicDialogRef) {
  }

  ngOnInit(): void {

  }

  public save() {
    this.api.deleteStaff(this.config.data).then((res: any) => {
      this.ref.close();
      this.api.success('Le membre a été retiré du staff.');
    }).catch(() => {
      this.api.error('Erreur lors de la suppression');
    })
  }

}
