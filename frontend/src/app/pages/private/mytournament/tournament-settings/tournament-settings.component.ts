import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-tournament-settings',
  templateUrl: './tournament-settings.component.html',
  styleUrls: ['./tournament-settings.component.css']
})
export class TournamentSettingsComponent implements OnInit {
  public user: any;
  public roleId: any;
  public loaded = false;
  public formGroup = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    start_date: new FormControl(),
    end_date: new FormControl(),
    prize: new FormControl(),
    size: new FormControl(),
    type: new FormControl(),
  });
  public tournamentId: number | undefined;
  public sizeLabel = ["Compétition de 2", "Compétition de 4", "Compétition de 8", "Compétition de 16"];
  public typeLabel = ["Elimination simple", "Elimination double", "Round robin"];
  public sizeEnum: { [key: string]: number } = {
    'Compétition de 2': 0,
    'Compétition de 4': 1,
    'Compétition de 8': 2,
    'Compétition de 16': 3,
  }
  public typeEnum: { [key: string]: number } = {
    'Elimination simple': 0,
    'Elimination double': 1,
    'Round robin': 2,
  }

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) { }

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
    
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.tournamentId = +params['tournamentId'];
    });

    this.api.getTournament(this.tournamentId).then((res: any) => {
      this.formGroup.patchValue({
        title: res.title,
        description: res.description,
        start_date: new Date(res.start_date),
        end_date: new Date(res.end_date),
        prize: res.prize,
        size: this.mapSizeToEnumName(res.size),
        type: this.mapTypeToEnumName(res.type),
      })
      this.loaded = true;
    });
  }

  public save() {
    if(this.formGroup.valid) {
      const formGroup = {
        title: this.formGroup.get('title')?.value,
        description: this.formGroup.get('description')?.value,
        start_date: this.formGroup.get('start_date')?.value,
        end_date: this.formGroup.get('end_date')?.value,
        prize: this.formGroup.get('prize')?.value,
        type: this.mapTypeToEnum(this.formGroup.get('type')?.value),
        size: this.mapTypeToEnum(this.formGroup.get('size')?.value),
      }

      this.api.putTournament(this.tournamentId, formGroup).then(() => {
        this.api.success('Les paramètres du tournoi ont été modifiés');
      }).catch(() => {
        this.api.error('Erreur lors de la modification des paramètres du tournoi');
      })
    } else {
      this.api.error('Formulaire invalide');
    }
  }

  mapSizeToEnum(sizeValue: string) {
    return this.sizeEnum[sizeValue];
  }

  mapSizeToEnumName(sizeValue: number) {
    for(const key in this.sizeEnum) {
      if(this.sizeEnum[key] === sizeValue) {
        return key;
      }
    }
    return '';
  }

  mapTypeToEnum(typeValue: string) {
    return this.typeEnum[typeValue];
  }

  mapTypeToEnumName(typeValue: number) {
    for(const key in this.typeEnum) {
      if(this.typeEnum[key] === typeValue) {
        return key;
      }
    }
    return '';
  }
}
