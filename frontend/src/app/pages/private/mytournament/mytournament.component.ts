import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-mytournament',
  templateUrl: './mytournament.component.html',
  styleUrls: ['./mytournament.component.css']
})
export class MytournamentComponent {
  public tournament: any;
  public user: any;
  public tournamentId: number | undefined;

  constructor(private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) { }
  
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
    localStorage.clear();
    this.api.success('Vous vous êtes déconnecté.')
    this.router.navigateByUrl('/');
  }
}
