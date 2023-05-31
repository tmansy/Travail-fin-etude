import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { AuthService } from '../../../_services/auth.service';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
  public loading: boolean = false;
  public formGroup = new FormGroup({
    username: new FormControl(),
    password: new FormControl(),
  })

  constructor(private router: Router, private api: ApiService, private authService: AuthService, private accountService: AccountService) { }

  ngOnInit(): void {
  }

  public login() {
    this.loading = true;
    if(this.formGroup.valid) {
      this.api.postLogin(this.formGroup.value).then((res: any) => {
        this.loading = false;
        if(res === "false") {
          this.api.error('Le login ou le mot de passe n\'est pas correct.');
        }
        else {
          this.authService.setToken(res.token);
          this.accountService.user = res.user;
          localStorage.setItem('userId', res.user.id);
          this.api.success('Félications vous êtes connecté.');
          this.router.navigateByUrl('/private/myspace');
        }
      }).catch((err) => {
        this.loading = false;
        this.api.error(err);
      })
    }
    else {
      this.loading = false;
      this.api.error('Veuillez complétez le formulaire.')
    }
  }
}
