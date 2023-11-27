import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-myteam',
  templateUrl: './myteam.component.html',
  styleUrls: ['./myteam.component.css'],
})
export class MyteamComponent implements OnInit {
  public team: any;
  public user: any;
  public teamId: number | undefined;

  constructor(private router: Router, private api: ApiService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    this.activatedRoute.params.subscribe((params) => {
      console.log(params)
      // this.teamId = +params['teamId'];
    })

    this.api.getTeam(this.teamId).then((res: any) => {
      this.team = res;
    })
  }

  public signout() {
    localStorage.clear();
    this.api.success('Vous vous êtes déconnecté.')
    this.router.navigateByUrl('/');
  }

}
