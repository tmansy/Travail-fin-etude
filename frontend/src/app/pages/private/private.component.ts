import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  public user: any;

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.user = this.accountService.user;
  }
}
