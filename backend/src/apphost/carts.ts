import { Methods, Params } from '../constants/api';
import { CartsControllers } from '../middlewares/carts';

export default [
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
]