import { Methods, Params } from '../constants/api';
import { CartsProductsControllers } from '../middlewares/carts_products';

export default [
    {
        name: 'create_cart_products',
        description: 'Create a cart_products',
        method: Methods.POST,
        route : '/carts_products',
        hasToken: true,
        methods: [
            CartsProductsControllers.createCartProduct,
        ]
    },
    {
        name: 'update_cart_product',
        description: 'Update a cart_products',
        method: Methods.PUT,
        route : `/carts_products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            CartsProductsControllers.updateCartProduct,
        ]
    },
    {
        name: 'get_one_carts_products',
        description: 'Get one carts_products',
        method: Methods.GET,
        route : `/carts_products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            CartsProductsControllers.getCartProduct,
        ]
    },
    {
        name: 'get_all_carts_products',
        description: 'Get all carts_products',
        method: Methods.GET,
        route : '/carts_products',
        hasToken: true,
        methods: [
            CartsProductsControllers.getAllCartsProducts,
        ]
    }
]