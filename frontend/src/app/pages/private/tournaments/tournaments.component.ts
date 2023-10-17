import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit {
  public loaded = false;
  public user: any;
  public roleId: any;
  public tournaments: any;

  constructor() { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if(userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    const roleIdString = localStorage.getItem('roleId');
    if (roleIdString !== null) {
      const roleId = JSON.parse(roleIdString);
      this.roleId = roleId;
    }

    this.loaded = true;
  }

  public tournamentDialog() {

  }

  public goTo(tournament: any) {

  }

}
