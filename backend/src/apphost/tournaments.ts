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
    }
]