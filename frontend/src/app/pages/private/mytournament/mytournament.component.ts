import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-mytournament',
  templateUrl: './mytournament.component.html',
  styleUrls: ['./mytournament.component.css']
})
export class MytournamentComponent implements OnInit {
  public user: any;
  public tournament: any;
  public tournamentId: number | undefined;

  constructor(private api: ApiService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    this.activatedRoute.params.subscribe((params) => {
      this.tournamentId = +params['tournamentId'];
    })

    this.api.getTournament(this.tournamentId).then((res: any) => {
      this.tournament = res;
    })
  }

  public signout() {
    
  }

}
