import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-delete-staff',
  templateUrl: './dialog-delete-staff.component.html',
  styleUrls: ['./dialog-delete-staff.component.css']
})
export class DialogDeleteStaffComponent implements OnInit {

  constructor(private api: ApiService, private config: DynamicDialogConfig) {
    console.log(this.config.data);
  }

  ngOnInit(): void {

  }

  public save() {

  }

}
