import { Methods } from '../constants/api';
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
]