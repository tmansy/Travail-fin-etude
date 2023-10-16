import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-settings-tournament',
  templateUrl: './settings-tournament.component.html',
  styleUrls: ['./settings-tournament.component.css']
})
export class SettingsTournamentComponent implements OnInit {
  public tournament: any;
  public tournamentId: any;
  public loaded = false;
  public formGroup = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
    prize: new FormControl(),
  });
  public roleId: any;

  public typeLabel = ['Simple élimination', 'Double élimination', 'Round-robin'];

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const roleIdString = localStorage.getItem('roleId');
    if (roleIdString !== null) {
      const roleId = JSON.parse(roleIdString);
      this.roleId = roleId;
    }

    this.activatedRoute.parent?.params.subscribe((params) => {
      this.tournamentId = +params['tournamentId'];
    })

    this.api.getTournament(this.tournamentId).then((res: any) => {
      if(res.type == 'single_elimination')  res.type = "Simple élimination";
      if(res.type == 'double_elimination') res.type = "Double élimination";
      if(res.type == 'round_robin') res.type = "Round-robin";
      this.formGroup.patchValue(res);
    })

    this.loaded = true;
  }

  public save() {
    if(this.formGroup.valid) {
      this.api.putTournament(this.tournamentId, this.formGroup.value).then((res: any) => {
        this.ngOnInit();
        this.api.success('Les informations du tournoi ont été mises à jours');
      })
    }
    else {
      this.api.error('Formulaire invalide');
    }
  }

}
