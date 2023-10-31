import { Methods, Params } from '../constants/api';
import { ProductsOrdersControllers } from '../middlewares/products_orders';

export default [
    {
        name: 'create_order',
        description: 'Create an order',
        method: Methods.POST,
        route : '/products_orders',
        hasToken: true,
        methods: [
            ProductsOrdersControllers.createProductOrder,
        ]
    },
    {
        name: 'update_order',
        description: 'Update an order',
        method: Methods.PUT,
        route : `/products_orders/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            ProductsOrdersControllers.updateProductOrder,
        ]
    },
    {
        name: 'get_one_order',
        description: 'Get one order',
        method: Methods.GET,
        route : `/products_orders/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            ProductsOrdersControllers.getProductOrder,
        ]
    },
    {
        name: 'get_all_products_orders',
        description: 'Get all products_orders',
        method: Methods.GET,
        route : '/products_orders',
        hasToken: true,
        methods: [
            ProductsOrdersControllers.getAllProductOrders,
        ]
    }
]