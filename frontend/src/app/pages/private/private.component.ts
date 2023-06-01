import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  public user: any;

  constructor(private accountService: AccountService, private router: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.user = this.accountService.user;
  }

  public signout() {
    localStorage.clear();
    this.api.success('Vous vous êtes déconnecté.')
    this.router.navigateByUrl('/');
  }
}
