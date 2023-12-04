import { Component, OnInit } from '@angular/core';
import { InMemoryDatabase } from 'brackets-memory-db';
import { BracketsManager } from 'brackets-manager';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogGenerateTournamentComponent } from '../../dialog/dialog-generate-tournament/dialog-generate-tournament.component';
import { DialogUpdateMatchComponent } from '../../dialog/dialog-update-match/dialog-update-match.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  public loaded = false;
  public user: any;
  public roleId: any;
  public tournaments: any;
  public tournament: any;
  public tournamentId: any;
  private manager: BracketsManager;
  private storage: InMemoryDatabase;
  public isTournamentGenerated: boolean = false;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private dialog: DialogService) {
    this.storage = new InMemoryDatabase();
    this.manager = new BracketsManager(this.storage);
  }

  async ngOnInit() {
    const userString = localStorage.getItem('user');
    if(userString !== null) {
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

    this.api.getTournamentWithTeam(this.tournamentId).then((res: any) => {
      this.isTournamentGenerated = res.generated == 1 ? true : false;

      if(this.isTournamentGenerated) {
        this.renderTournament();
      }
    });
    
    this.loaded = true;
  }

  public generateDialog() {
    this.dialog.open(DialogGenerateTournamentComponent, {
      header: 'Générer l\'arbre de tournoi',
      styleClass: 'custom-dialog',
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

  public renderTournament() {
    window.bracketsViewer.addLocale('fr', {
      common: {
        'group-name-winner-bracket': '{{stage.name}}',
        'group-name-loser-bracket': '{{stage.name}} - Repêchage'
      },
      'origin-hint': {
        'winner-bracket': 'Round {{round}}.{{position}}',
        'winner-bracket-semi-final': 'Semi finale {{position}}',
        'winner-bracket-final': 'Finale',
        'consolation-final': 'Petite finale'
      },
      "match-status": {
        "locked": "Bloqué",
        "waiting": "En attente",
        "ready": "Prêt",
        "running": "En cours",
        "completed": "Fini",
        "archived": "Archivé",
      }
    });

    this.api.getStageData(this.tournamentId).then((res) => {
      const config = {
        onMatchClick: (matchData: any) => {
          const data = {
            ...matchData,
            tournamentId: this.tournamentId,
          };

          this.dialog.open(DialogUpdateMatchComponent, {
            header: "Résultat du match",
            styleClass: 'custom-dialog',
            data: data,
          }).onClose.subscribe(() => {
            this.ngOnInit();
          })
        },
        clear: true,
      };

      window.bracketsViewer.render(res, config);
    });
  }
}
