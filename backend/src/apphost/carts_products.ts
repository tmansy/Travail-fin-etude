import { Methods, Params } from '../constants/api';

export default [
    {
        name: 'create_cart_products',
        description: 'Create a cart_products',
        method: Methods.POST,
        route : '/carts_products',
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'update_cart_product',
        description: 'Update a cart_products',
        method: Methods.PUT,
        route : `/carts_products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_one_carts_products',
        description: 'Get one carts_products',
        method: Methods.GET,
        route : `/carts_products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_all_carts_products',
        description: 'Get all carts_products',
        method: Methods.GET,
        route : '/carts_products',
        hasToken: true,
        methods: [
        ]
    }
]