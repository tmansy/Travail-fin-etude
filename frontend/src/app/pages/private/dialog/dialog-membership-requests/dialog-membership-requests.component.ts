import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-dialog-membership-requests',
  templateUrl: './dialog-membership-requests.component.html',
  styleUrls: ['./dialog-membership-requests.component.css']
})
export class DialogMembershipRequestsComponent implements OnInit {
  public formGroup = new FormGroup({
    title: new FormControl(),
    lastname: new FormControl(),
    firstname: new FormControl(),
    username: new FormControl(),
    birthdate: new FormControl(),
    phone: new FormControl(),
    street: new FormControl(),
    house_number: new FormControl(),
    zip_code: new FormControl(),
    city: new FormControl(),
    country: new FormControl(),
    message: new FormControl(),
  })
  
  constructor(private config: DynamicDialogConfig) {
    this.formGroup.patchValue(this.config.data);
  }

  ngOnInit(): void {
  }

  public save() {
    console.log(this.formGroup.value);
  }
}
