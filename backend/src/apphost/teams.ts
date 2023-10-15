import { Methods, Params } from '../constants/api';
import { AuthControllers } from '../middlewares/auth';
import { TeamsControllers } from '../middlewares/teams';

export default [
    {
        name: 'create_new_team',
        description: 'create a new team',
        method: Methods.POST,
        route : `/create_team`,
        hasToken: true,
        methods: [
            AuthControllers.checkIfAdmin,
            TeamsControllers.postNewTeam,
        ]
    },

    {
        name: 'update_team_informations',
        description: 'Update team informations',
        method: Methods.PUT,
        route: `/teams/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TeamsControllers.putTeamInfos,
        ]
    }
]