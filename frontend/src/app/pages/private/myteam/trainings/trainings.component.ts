import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ApiService } from 'src/app/_services/api.service';
import { DialogNewTrainingComponent } from '../../dialog/dialog-new-training/dialog-new-training.component';
import { DialogTrainingComponent } from '../../dialog/dialog-training/dialog-training.component';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent implements OnInit {
  public trainings = [];
  public upcomingTrainings = [];
  public pastTrainings = [];
  public currentTrainings = [];
  public selectedTraining: any;

  constructor(private api: ApiService, private dialog: DialogService) { }

  ngOnInit(): void {
    this.api.getTrainings().then((res: any) => {
      const currentDate = new Date();

      this.trainings = res;
      this.upcomingTrainings = res.filter((training: any) => new Date(training.from) > currentDate);
      this.pastTrainings = res.filter((training: any) => new Date(training.to) < currentDate);
      this.currentTrainings = res.filter((training: any) => new Date(training.from) < currentDate && new Date(training.to) > currentDate);
    });
  }

  public openDialog() {
    this.dialog.open(DialogNewTrainingComponent, {
      header: 'Ajouter un entraînement',
      styleClass: 'custom-dialog',
      data: this.trainings,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

  public onRowSelect(event: any) {
    this.dialog.open(DialogTrainingComponent, {
      header: "Informations sur l'entraînement",
      styleClass: 'custom-dialog',
      data: event.data,
    }).onClose.subscribe(() => {
      this.ngOnInit();
    });
  }
}
