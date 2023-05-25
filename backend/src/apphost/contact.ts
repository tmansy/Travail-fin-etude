import { Methods } from '../constants/api';
import { ContactControllers } from '../middlewares/contact';

export default [
    {
        name: 'sendContactMail',
        description: 'send contact mail',
        method: Methods.POST,
        route : '/sendMail',
        token: false,
        basic: true,
        methods: [
            ContactControllers.sendMail,
        ]
    }
]