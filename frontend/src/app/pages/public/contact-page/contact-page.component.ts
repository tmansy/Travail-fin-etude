import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent implements OnInit {
  public faDiscord = faDiscord;
  public faPhone = faPhone;
  public faEnvelope = faEnvelope;
  public loading: boolean = false;
  public formGroup = new FormGroup({
    lastname: new FormControl(),
    firstname: new FormControl(),
    email: new FormControl(),
    phoneNumber: new FormControl(),
    message: new FormControl(),
  })

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  public sendMail(){
    this.loading = true;
    this.api.postSendMail(this.formGroup.value).then(() => {
      this.formGroup.reset();
      this.loading = false;
      this.api.success('Le mail a bien été envoyé.');
    }).catch(() => {
      this.api.error('Le mail n\'a pas pu être envoyé.');
    })
  }

}