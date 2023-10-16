import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InMemoryDatabase } from 'src/app/_classes/inMemoryDatabase';
import { ApiService } from 'src/app/_services/api.service';
import { BracketsManager } from 'brackets-manager';
import { DialogService } from 'primeng/dynamicdialog';
import { DialogGenerateTournamentComponent } from '../../dialog/dialog-generate-tournament/dialog-generate-tournament.component';

function getNearestPowerOfTwo(input: number): number {
  return Math.pow(2, Math.ceil(Math.log2(input)));
}

async function process(dataset: Dataset, tournamentId: number) {
  const db = new InMemoryDatabase();
  const manager = new BracketsManager(db);

  db.setData({
    participant: dataset.roster.map((team) => ({
      ...team,
      tournament_id: tournamentId,
    })),
    stage: [],
    group: [],
    round: [],
    match: [],
    match_game: [],
  });

  await manager.create.stage({
    name: dataset.title,
    tournamentId: tournamentId,
    type: dataset.type,
    seeding: dataset.roster.map((team) => team.name),
    settings: {
      groupCount: 1,
      seedOrdering: dataset.type === 'round_robin' ? ['groups.seed_optimized'] : ['inner_outer'],
      size: getNearestPowerOfTwo(dataset.roster.length),
    }
  })

  const data = await manager.get.stageData(0);

  return {
    stages: data.stage,
    matches: data.match,
    matchGames: data.match_game,
    participants: data.participant,
  }
}

@Component({
  selector: 'app-tree-tournament',
  templateUrl: './tree-tournament.component.html',
  styleUrls: ['./tree-tournament.component.css']
})
export class TreeTournamentComponent implements OnInit {
  public tournament: any;
  public tournamentId: any;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private dialog: DialogService) { }

  ngOnInit(): void {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.tournamentId = +params['tournamentId'];
    })

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
      }
    });

    this.api.getTournamentWithTeam(this.tournamentId).then((res) => {
      this.tournament = res;

      process(this.tournament, this.tournamentId).then((data) => {
        window.bracketsViewer.render(data);
      })
    })
  }

  public treeTournamentDialog() {
    this.dialog.open(DialogGenerateTournamentComponent, {
      header: "Générer l'arbre du tournoi",
      styleClass: 'custom-dialog',
    }).onClose.subscribe(() => {
      this.ngOnInit();
    })
  }

}
