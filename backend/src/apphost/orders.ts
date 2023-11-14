import { Methods } from '../constants/api';
import { OrdersControllers } from '../middlewares/orders';

export default [
    {
        name: 'create_order',
        description: 'Create an order',
        method: Methods.POST,
        route : '/orders',
        hasToken: true,
        methods: [
            OrdersControllers.createOrder,
            OrdersControllers.updatePayment,
            OrdersControllers.flagCart,
        ]
    },
]