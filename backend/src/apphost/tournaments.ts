import { Methods, Params } from '../constants/api';
import { TournamentsControllers } from '../middlewares/tournaments';

export default [
    {
        name: 'createTournament',
        description: 'create tournament',
        method: Methods.POST,
        route : '/create_tournament',
        hasToken: true,
        methods: [
            TournamentsControllers.createTournament,
        ]
    },

    {
        name: 'updateTournament',
        description: 'update tournament',
        method: Methods.PUT,
        route: `/update_tournament/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TournamentsControllers.updateTournament,
        ]
    },

    {
        name: 'getTournamentWithTeam',
        description: 'get tournament with team',
        method: Methods.GET,
        route: `/get_tournament/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TournamentsControllers.getTournament,
        ]
    },
]