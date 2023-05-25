import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Team } from 'src/app/_classes/team.model';
import { Player } from 'src/app/_classes/player.model';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class HomePageComponent implements OnInit {
  public isLolTeamVisible = true;
  public lolLogoPath = "./../assets/img/lol_logo.png";
  public tftLogoPath = "./../assets/img/tft_logo.png";
  public teams: Team[] = [];
  public tftplayers: Player[] = [];

  constructor(private api: ApiService) { }
  
  ngOnInit(): void {
    this.api.getTeams().then((res: any) => {
      this.teams = res;
    });

    this.api.getTFTPlayers().then((res: any) => {
      this.tftplayers = res;
    });
  }
  
}