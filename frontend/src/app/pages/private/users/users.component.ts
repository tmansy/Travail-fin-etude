import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { DialogUserComponent } from '../dialog/dialog-user/dialog-user.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public loaded = false;
  public users: any;
  public selectedUser: any;

  constructor(private api: ApiService, private dialog: DialogService) { }

  ngOnInit(): void {
    this.api.getUsersStatus().then((res: any) => {
      this.users = res;
    })
    this.loaded = true;
  }

  public onRowSelect(event: any) {
    this.dialog.open(DialogUserComponent, {
      header: "Informations sur l'utilisateur",
      styleClass: "custom-dialog",
      data: event.data,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

}
