import { Component, OnInit } from '@angular/core';
import { InMemoryDatabase } from 'brackets-memory-db';
import { BracketsManager } from 'brackets-manager';
import { ApiService } from 'src/app/_services/api.service';
import { ActivatedRoute } from '@angular/router';

function getNearestPowerOfTwo(input: number): number {
  return Math.pow(2, Math.ceil(Math.log2(input)));
}

async function process(dataset: Dataset, tournamentId: number, manager: BracketsManager, storage: InMemoryDatabase) {
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
      seedOrdering: dataset.type === 'round_robin' ? ['groups.seed_optimized'] : ['natural'],
      size: getNearestPowerOfTwo(dataset.roster.length),
    }
  });

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
export class ResultsComponent implements OnInit {
  public loaded = false;
  public user: any;
  public roleId: any;
  public tournaments: any;
  public tournament: any;
  public tournamentId: any;
  private manager: BracketsManager;
  private storage: InMemoryDatabase;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute) {
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

    this.api.getTournamentWithTeam(this.tournamentId).then((res: any) => {
      let type;
      
      if(res.type == 0) type = "single_elimination";
      else if(res.type == 1) type = "double_elimination";
      else if(res.type == 2) type = "round_robin";

      this.tournament = {
        title: res.title,
        type: type,
        roster: [],
      };

      res.teams_tournaments.forEach((teamTournament: any) => {
        this.tournament.roster.push({
          id: teamTournament.id,
          name: teamTournament.team.name,
        });
      });

      process(this.tournament, this.tournamentId, this.manager, this.storage).then((data) => {
        const config = {
          onMatchClick: (matchData: any) => {
            this.updateMatch(matchData);
          },
        };
  
        window.bracketsViewer.render(data, config);
      });
    });
    
    this.loaded = true;
  }
  
  async updateMatch(matchData: any) {
    await this.manager.update.match({
      id: matchData.id,
      opponent1: {
        score: 1,
        result: 'win',
      },
      opponent2: {
        score: 0,
        result: 'loss',
      }
    });

    const data = await this.manager.get.stageData(0);
    const _data = {
      stages: data.stage,
      matches: data.match,
      matchGames: data.match_game,
      participants: data.participant,
    }
    window.bracketsViewer.render(_data);
  }
}
