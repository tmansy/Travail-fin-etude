import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-new-training',
  templateUrl: './dialog-new-training.component.html',
  styleUrls: ['./dialog-new-training.component.css']
})
export class DialogNewTrainingComponent implements OnInit {
  public formGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    from: new FormControl(),
    to: new FormControl(),
    teamId: new FormControl(),
    userId: new FormControl(),
  });
  public dateFrom: Date | undefined;
  public dateTo: Date | undefined;

  constructor(private api: ApiService, private ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  public save() {
    if(this.formGroup.valid) {
      if(this.formGroup.get('from')?.value && this.formGroup.get('to')?.value 
      && this.formGroup.get('title')?.value && this.formGroup.get('description')?.value) {
        if(this.formGroup.get('from')?.value < this.formGroup.get('to')?.value) {
          this.formGroup.get('teamId')?.setValue(this.api.team.team.id);
          this.formGroup.get('userId')?.setValue(this.api.team.user.id);

          this.api.postTraining(this.formGroup.value).then((res: any) => {
            this.ref.close();
            this.api.success('L\'entraînement a été créé.');
          });
        }
        else {
          this.api.error('Le champ from doit être plus petit que le champ to.');
        }
      }
      else {
        this.api.error('Veuillez remplir tous les champs.');
      }
    }
    else {
      this.api.error('Formulaire invalide.');
    }
  }
}
