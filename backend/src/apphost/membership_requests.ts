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
            MembershipRequestsControllers.postMembershipRequest,
        ]
    },
    {
        name: 'get_all_MembershipRequests',
        description: 'Get all membershipRequests',
        method: Methods.GET,
        route: `/membershiprequests`,
        hasToken: true,
        methods: [
            MembershipRequestsControllers.getAllMembershipRequests,
        ]
    },
    {
        name: 'delete_request',
        description: 'Delete request',
        method: Methods.DELETE,
        route: `/membershiprequests/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            MembershipRequestsControllers.deleteRequest,
        ]
    }
]