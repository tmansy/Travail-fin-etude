import { Methods } from '../constants/api';
import { PaymentsControllers } from '../middlewares/payments';

export default [
    {
        name: 'create_payment_intent',
        description: 'Create payment intent',
        method: Methods.POST,
        route : `/paymentIntent`,
        hasToken: true,
        methods: [
            PaymentsControllers.createPaymentIntent,
        ]
    },
    {
        name: 'validate_payment',
        description: 'Validate payment',
        method: Methods.POST,
        route: `/validatePayment`,
        hasToken: true,
        methods: [
            PaymentsControllers.validatePayment,
        ]
    }
]