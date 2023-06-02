import { Methods, Params } from '../constants/api';
import { PlayersControllers } from '../middlewares/players';

export default [
    {
        name: 'getTFTPlayers',
        description: 'Get all TFT players',
        method: Methods.GET,
        route : '/tftplayers',
        hasToken: false,
        methods: [
            PlayersControllers.getTFTPlayers,
        ]
    },

    {
        name: 'getTeamsByPlayerId',
        description: 'Get all teams by player id',
        method: Methods.GET,
        route: `/teams_by_player/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            PlayersControllers.getTeamsByPlayerId,
        ]
    }
]