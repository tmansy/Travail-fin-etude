import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public loaded = false;
  public users: any;
  public selectedUser: any;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUsersStatus().then((res: any) => {
      this.users = res;
    })
    this.loaded = true;
  }

  public onRowSelect(event: any) {

  }

}
