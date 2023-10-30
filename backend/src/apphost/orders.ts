import { Methods, Params } from '../constants/api';

export default [
    {
        name: 'create_order',
        description: 'Create a order',
        method: Methods.POST,
        route : '/orders',
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'update_order',
        description: 'Update an order',
        method: Methods.PUT,
        route : `/orders/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_one_order',
        description: 'Get one order',
        method: Methods.GET,
        route : `/orders/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_all_orders',
        description: 'Get all orders',
        method: Methods.GET,
        route : '/orders',
        hasToken: true,
        methods: [
        ]
    }
]