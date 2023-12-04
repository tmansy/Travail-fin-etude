import { Methods, Params } from '../constants/api';
import { TournamentsControllers } from '../middlewares/tournaments';

export default [
    {
        name: 'get_all_tournaments',
        description: 'get all tournaments',
        method: Methods.GET,
        route: `/tournaments`,
        hasToken: true,
        methods: [
            TournamentsControllers.getAllTournaments,
        ]
    },
    {
        name: 'get_tournament_with_teams',
        description: 'get all tournaments',
        method: Methods.GET,
        route: `/tournaments/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TournamentsControllers.getTournamentWithTeams,
        ]
    },
    {
        name: 'get_not_registred_teams_tournament',
        description: 'Get not registred teams tournament',
        method: Methods.GET,
        route: `/tournaments/${Params.FOCUS}/teams/not_registred`,
        hasToken: true,
        methods: [ 
            TournamentsControllers.getNotRegistredTeams,
        ]
    },
    {
        name: 'register_a_team_to_a_tournament',
        description: 'Register a team to a tournament',
        method: Methods.POST,
        route: `/tournaments/${Params.FOCUS}/register_team`,
        hasToken: true,
        methods: [
            TournamentsControllers.registerNewTeam,
        ]
    },
    {
        name: 'delete_a_team_to_a_tournament',
        description: 'Delete a team to a tournement',
        method: Methods.DELETE,
        route: `/tournaments/${Params.FOCUS}/delete`,
        hasToken: true,
        methods: [
            TournamentsControllers.deleteTeamTournament,
        ]
    },
    {
        name: 'post_team_with_team_tournamentId',
        description: 'Post team with team_tournamentId',
        method: Methods.POST,
        route: `/tournaments/${Params.FOCUS}/teams`,
        hasToken: true,
        methods: [
            TournamentsControllers.getTeamWithTeamTournamentId,
        ]
    }
]