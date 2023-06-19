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
    },

    {
        name: 'postMembershipRequest',
        description: 'post membership request',
        method: Methods.POST,
        route: `/membership_request`,
        hasToken: true,
        methods: [
            MembershipRequestsControllers.postMemberShipRequest,
        ]
    }

]