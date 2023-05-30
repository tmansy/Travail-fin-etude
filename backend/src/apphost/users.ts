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
]