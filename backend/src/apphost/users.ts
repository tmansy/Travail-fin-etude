import { Methods, Params } from '../constants/api';
import { UsersControllers } from '../middlewares/users';

export default [
    {
        name: 'getUserInfos',
        description: 'Get user infos with userId',
        method: Methods.GET,
        route : `/users/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            UsersControllers.getUserInfos,
        ]
    },

    {
        name: 'putUserInfos',
        description: 'Put user infos with userId',
        method: Methods.PUT,
        route: `/user_infos/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            UsersControllers.putUserInfos,
        ]
    },

    {
        name: 'getTFTPlayers',
        description: 'Get all TFT players',
        method: Methods.GET,
        route : '/tftplayers',
        hasToken: false,
        methods: [
            UsersControllers.getTFTPlayers,
        ]
    },

    {
        name: 'getTeamsByPlayerId',
        description: 'Get all teams by player id',
        method: Methods.GET,
        route: `/teams_by_player/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            UsersControllers.getTeamsByPlayerId,
        ]
    },

    {
        name: 'getAllPlayersInformationsByTeam',
        description: 'Get all players informations by team',
        method: Methods.GET,
        route: `/players_by_team/${Params.FOCUS}`,
        methods: [
            UsersControllers.getAllPlayersInformationsByteam,
        ]
    }
]