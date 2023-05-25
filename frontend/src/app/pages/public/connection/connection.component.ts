import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';

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

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  public login() {
    this.loading = true;
    if(this.formGroup.valid) {
      this.api.postLogin(this.formGroup.value).then((res: any) => {
        this.loading = false;
        this.formGroup.reset();
        if(res === "false") {
          this.api.error('Le login ou le mot de passe n\'est pas correct');
        }
        else {
          this.api.success('Félications vous êtes connecté');
        }

      }).catch((err) => {
        this.loading = false;
        this.api.error(err);
      })
    }
    else {
      this.loading = false;
      this.api.error('Veuillez complétez le formulaire')
    }
  }
}
