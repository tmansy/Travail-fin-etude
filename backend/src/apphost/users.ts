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
        hasToken: true,
        methods: [
            UsersControllers.getAllPlayersInformationsByteam,
        ]
    },

    {
        name: 'putPlayerInfos',
        description: 'Put all player\'s infos',
        method: Methods.PUT,
        route: `/playerInfos/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            UsersControllers.putPlayerInfos,
        ]
    },

    {
        name: 'getUsers',
        description: 'Get all users',
        method: Methods.GET,
        route: `/users`,
        hasToken: true,
        methods: [
            UsersControllers.getUsers,
        ]
    },

    {
        name: 'AddPlayerTeam',
        description: 'Add a user in a team',
        method: Methods.POST,
        route: `/add_new_player`,
        hasToken: true,
        methods: [
            UsersControllers.postPlayer,
        ]
    },

    {
        name: 'AddNewStaffMember',
        description: 'Add new staff member',
        method: Methods.POST,
        route: `/add_staff_member`,
        hasToken: true,
        methods: [
            UsersControllers.postStaff,
        ]
    },

    {
        name: 'DeleteStaffMember',
        description: 'Delete staff member',
        method: Methods.PUT,
        route: `/delete_staff_member`,
        hasToken: true,
        methods: [
            UsersControllers.deleteStaff,
        ]
    }

]