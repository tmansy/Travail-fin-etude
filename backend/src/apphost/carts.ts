import { Methods, Params } from '../constants/api';
import { CartsControllers } from '../middlewares/carts';

export default [
    {
        name: 'create_cart',
        description: 'Create a cart',
        method: Methods.POST,
        route : '/carts',
        hasToken: true,
        methods: [
            CartsControllers.createCart,
        ]
    },
    {
        name: 'update_cart',
        description: 'Update a cart',
        method: Methods.PUT,
        route : `/carts/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            CartsControllers.updateCart,
        ]
    },
    {
        name: 'get_one_cart',
        description: 'Get one cart',
        method: Methods.GET,
        route : `/carts/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            CartsControllers.getCart,
        ]
    },
    {
        name: 'get_all_carts',
        description: 'Get all carts',
        method: Methods.GET,
        route : '/carts',
        hasToken: true,
        methods: [
            CartsControllers.getAllCarts,
        ]
    }
]