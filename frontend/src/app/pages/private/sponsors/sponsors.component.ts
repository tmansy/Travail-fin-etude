import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.css']
})
export class SponsorsComponent implements OnInit {
  public sponsors: any;
  public loaded = false;
  public user: any;
  public roleId: any;
  public sortField: string = "";
  public sortOrder: number = 0;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    const roleIdString = localStorage.getItem('roleId');
    if (roleIdString !== null) {
      const roleId = JSON.parse(roleIdString);
      this.roleId = roleId;
    }

    this.api.getSponsors().then((res: any) => {
      this.sponsors = res;
    })

    this.loaded = true;
  }

  public sponsorDialog() {

  }

  public sponsorManagement() {
    
  }

}
