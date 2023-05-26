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
    },
    { 
        name: 'signup',
        description: 'Sign up on the website',
        method: Methods.POST,
        route: '/signup',
        hasToken: false,
        methods: [
            ConnectionControllers.signup,
        ]
    }
]