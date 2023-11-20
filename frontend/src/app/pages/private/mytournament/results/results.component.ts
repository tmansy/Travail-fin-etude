import { Component } from '@angular/core';
import { InMemoryDatabase } from 'brackets-memory-db';
import { BracketsManager } from 'brackets-manager';
import { ApiService } from 'src/app/_services/api.service';

function getNearestPowerOfTwo(input: number): number {
  return Math.pow(2, Math.ceil(Math.log2(input)));
}

async function process(dataset: Dataset, tournamentId: number) {
  const storage = new InMemoryDatabase();
  const manager = new BracketsManager(storage);

  storage.setData({
    participant: dataset.roster.map((team: any) => ({
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
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  public loaded = false;
  public user: any;
  public roleId: any;
  public tournaments: any;
  public tournament: any;
  public tournamentId: any;

  constructor(private api: ApiService) { }

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
    });
    
    this.loaded = true;
  }
}
