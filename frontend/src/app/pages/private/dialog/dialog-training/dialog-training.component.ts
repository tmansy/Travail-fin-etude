import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-training',
  templateUrl: './dialog-training.component.html',
  styleUrls: ['./dialog-training.component.css']
})
export class DialogTrainingComponent implements OnInit {
  public formGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    from: new FormControl(),
    to: new FormControl(),
  });

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  public createTraining(data: any) {
    if(this.formGroup.valid) {
      this.api.postTraining(this.formGroup.value).then((res) => {
        this.ref.close();
        this.api.success('L\'entraînement a bien été créé.');
      });
    } 
    else {
      this.api.error('Données du formulaire invalide.');
    }
  }

}
