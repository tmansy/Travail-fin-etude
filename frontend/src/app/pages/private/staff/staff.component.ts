import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  public users: any;
  public user: any;
  public loaded = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    this.api.getUsers().then((res) => {
      this.users = res;
    })

    this.loaded = true;
  }

  public staffDialog() {

  }

}
