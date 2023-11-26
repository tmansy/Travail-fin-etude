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
        name: 'create_public_cart_products',
        description: 'Create a public cart_products',
        method: Methods.POST,
        route : '/carts_products/public',
        hasToken: true,
        methods: [
            CartsProductsControllers.createPublicCartProduct,
            CartsProductsControllers.updateTotalPriceCart,
        ]
    },
    {
        name: 'delete_cart_product',
        description: 'Delete a cart_products',
        method: Methods.DELETE,
        route : `/carts_products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            CartsProductsControllers.deleteCartProduct,
            CartsProductsControllers.updateTotalPriceCart,
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
            CartsProductsControllers.updateTotalPriceCart,
        ]
    }
]