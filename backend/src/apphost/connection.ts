import { Methods } from '../constants/api';
import { ConnectionControllers } from '../middlewares/connection';

export default [
    {
        name: 'login',
        description: 'Account login with username/mail and password',
        method: Methods.POST,
        route : '/login',
        hasToken: false,
        methods: [
            ConnectionControllers.login,
        ]
    }
]