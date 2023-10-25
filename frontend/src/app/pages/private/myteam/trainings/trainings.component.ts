import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent implements OnInit {
  public upcomingTrainings = [];
  public pastTrainings = [];
  public currentTrainings = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.api.getTrainings().then((res: any) => {
      const currentDate = new Date();

      this.upcomingTrainings = res.filter((training: any) => new Date(training.from) > currentDate);
      this.pastTrainings = res.filter((training: any) => new Date(training.from) < currentDate);
      this.currentTrainings = res.filter((training: any) => new Date(training.from) > currentDate && new Date(training.to) < currentDate);
    });

  }
}
