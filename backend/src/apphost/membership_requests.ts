import { Methods, Params } from '../constants/api';
import { MembershipRequestsControllers } from '../middlewares/membership_requests';

export default [
    {
        name: 'getMembershipRequest',
        description: 'get membership request by userId',
        method: Methods.GET,
        route: `/membership_request/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            MembershipRequestsControllers.getMembershipRequestByUserId,
        ]
    }

]