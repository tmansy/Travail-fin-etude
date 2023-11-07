import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-dialog-training',
  templateUrl: './dialog-training.component.html',
  styleUrls: ['./dialog-training.component.css']
})
export class DialogTrainingComponent implements OnInit {
  public roleId: any;
  public user: any;
  public formGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    from: new FormControl(),
    to: new FormControl(),
  });
  public trainings: any;

  constructor(private api: ApiService, private ref: DynamicDialogRef, private config: DynamicDialogConfig) {
    this.trainings = this.config.data;  
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      this.user = user;
    }

    const roleIdString = localStorage.getItem('roleId');
    if (roleIdString !== null) {
      const roleId = JSON.parse(roleIdString);
      this.roleId = roleId;
    }

    this.formGroup.patchValue({
      title: this.trainings.title,
      description: this.trainings.description,
      from: new Date(this.trainings.from),
      to: new Date(this.trainings.to),
    });
  }

  public save() {
    if(this.formGroup.valid) {
      const currentDate = new Date();
      if(new Date(this.trainings.from) < currentDate) {
        this.api.error('Impossible de modifier un entraînement déjà passé.');
      }
      else if (new Date(this.trainings.from) < currentDate && new Date(this.trainings.to) > currentDate) {
        this.api.error('Impossible de modifier un entraînement en cours.');
      }
      else {
        const formValue = this.formGroup.value;
        this.api.putTraining(this.trainings.id, formValue).then((res: any) => {
          this.ref.close();
          this.api.success('Les informations de l\'entraînement ont bien été mises à jour.');
        });
      }
    } else {
      this.api.error('Formulaire invalide.');
    }
  }

  public delete() {
    const currentDate = new Date();
    if(new Date(this.trainings.from) < currentDate) {
      this.api.error('Impossible de supprimer un entraînement déjà passé.');
    }
    else if (new Date(this.trainings.from) < currentDate && new Date(this.trainings.to) > currentDate) {
      this.api.error('Impossible de supprimer un entraînement en cours.');
    }
    else {
      this.api.deleteTraining(this.trainings.id).then(() => {
        this.ref.close();
        this.api.success('L\'entraînement a bien été supprimé.');
      }); 
    }
  }
}
