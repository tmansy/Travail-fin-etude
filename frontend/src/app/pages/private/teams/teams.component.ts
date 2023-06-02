import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeamsComponent implements OnInit {
  public user: any;
  public teams: any;
  public loaded = false;

  constructor(private accountService: AccountService, private api: ApiService) { }

  ngOnInit(): void {
    this.user = this.accountService.user;
    this.loaded = true;


    this.api.getTeamsByPlayer(this.user.id).then((res: any) => {
      this.teams = res;
    })

  }

}
