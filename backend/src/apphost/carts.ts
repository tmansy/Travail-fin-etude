import { Methods, Params } from '../constants/api';

export default [
    {
        name: 'create_cart',
        description: 'Create a cart',
        method: Methods.POST,
        route : '/carts',
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'update_cart',
        description: 'Update a cart',
        method: Methods.PUT,
        route : `/carts/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_one_cart',
        description: 'Get one cart',
        method: Methods.GET,
        route : `/carts/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_all_carts',
        description: 'Get all carts',
        method: Methods.GET,
        route : '/carts',
        hasToken: true,
        methods: [
        ]
    }
]