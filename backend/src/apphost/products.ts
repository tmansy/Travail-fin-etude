import { Methods, Params } from '../constants/api';

export default [
    {
        name: 'create_product',
        description: 'Create a product',
        method: Methods.POST,
        route : '/products',
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'update_product',
        description: 'Update a product',
        method: Methods.PUT,
        route : `/products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_one_product',
        description: 'Get one product',
        method: Methods.GET,
        route : `/products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
        ]
    },
    {
        name: 'get_all_products',
        description: 'Get all products',
        method: Methods.GET,
        route : '/products',
        hasToken: true,
        methods: [
        ]
    }
]