import { Methods, Params } from '../constants/api';
import { StagesControllers } from '../middlewares/stages';

export default [
    {
        name: 'get_stage_data',
        description: 'Get stage data of a tournament',
        method: Methods.GET,
        route : `/stages/${Params.FOCUS}`,
        hasToken: false,
        methods: [
            StagesControllers.getStage,
            StagesControllers.getMatches,
            StagesControllers.getOpponents,
            StagesControllers.getParticipants,
            StagesControllers.mapInformations,
        ]
    },
]