import { Methods, Params } from '../constants/api';
import { TeamsControllers } from '../middlewares/teams';

export default [
    {
        name: 'postNewTeam',
        description: 'post team',
        method: Methods.POST,
        route : `/create_team`,
        hasToken: true,
        methods: [
            TeamsControllers.postNewTeam,
        ]
    },

    {
        name: 'putTeamInfos',
        description: 'put team infos',
        method: Methods.PUT,
        route: `/teams/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TeamsControllers.putTeamInfos,
        ]
    }
]