import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  public user: any;

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }
  }

  public signout() {
    localStorage.clear();
    this.api.success('Vous vous êtes déconnecté.')
    this.router.navigateByUrl('/');
  }
}
