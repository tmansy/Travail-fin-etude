import { Methods, Params } from '../constants/api';
import { ProductsControllers } from '../middlewares/products';

export default [
    {
        name: 'create_product',
        description: 'Create a product',
        method: Methods.POST,
        route : '/products',
        hasToken: true,
        methods: [
            ProductsControllers.createProduct,
        ]
    },
    {
        name: 'update_product',
        description: 'Update a product',
        method: Methods.PUT,
        route : `/products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            ProductsControllers.updateProduct,
        ]
    },
    {
        name: 'get_all_products',
        description: 'Get all products',
        method: Methods.GET,
        route : '/products',
        hasToken: false,
        methods: [
            ProductsControllers.getAllProducts,
        ]
    },
    {
        name: 'delete_product',
        description: 'Delete one product',
        method: Methods.DELETE,
        route : `/products/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            ProductsControllers.deleteProduct,
        ]
    }
]