import { Methods } from '../constants/api';
import { TournamentsControllers } from '../middlewares/tournaments';

export default [
    {
        name: 'generateTournament',
        description: 'generate tournament',
        method: Methods.POST,
        route : '/generate_tournament',
        hasToken: true,
        methods: [
            TournamentsControllers.generateTournament,
        ]
    }
]