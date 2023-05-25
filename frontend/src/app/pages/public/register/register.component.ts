import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public loading: boolean = false;
  public formGroup = new FormGroup({
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
  })

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  public register() {

  }
}
