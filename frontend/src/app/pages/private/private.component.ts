import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent implements OnInit {
  public user: any;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getUser(localStorage.getItem('userId')).then((res) => {
      this.user = res;
    }).catch((err) => {
      this.api.error(err);
    })
  }
}
