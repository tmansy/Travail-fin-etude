import { Methods } from '../constants/api';
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
    }
]