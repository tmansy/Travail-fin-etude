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
            CartsProductsControllers.updateTotalPriceCart,
        ]
    },
    {
        name: 'delete_cart_product',
        description: 'Delete a cart_products',
        method: Methods.DELETE,
        route : `/carts_products`,
        hasToken: true,
        methods: [
            CartsProductsControllers.deleteCartProduct,
        ]
    },
]