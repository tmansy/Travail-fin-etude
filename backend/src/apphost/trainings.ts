import { Methods, Params } from '../constants/api';
import { TrainingsControllers } from '../middlewares/trainings';

export default [
    {
        name: 'get_one_training',
        description: 'Get one training',
        method: Methods.GET,
        route : `/trainings/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TrainingsControllers.getOneTraining,
        ]
    },
    {
        name: 'get_all_trainings',
        description: 'Get all trainings',
        method: Methods.GET,
        route : `/trainings`,
        hasToken: true,
        methods: [
            TrainingsControllers.getAllTrainings,
        ]
    },
    {
        name: 'post_training',
        description: 'Post training',
        method: Methods.POST,
        route : `/trainings`,
        hasToken: true,
        methods: [
            TrainingsControllers.postTraining,
        ]
    },
    {
        name: 'update_training',
        description: 'Update training',
        method: Methods.PUT,
        route : `/trainings/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TrainingsControllers.putTraining,
        ]
    },
    {
        name: 'delete_one_training',
        description: 'Delete one training',
        method: Methods.DELETE,
        route : `/trainings/${Params.FOCUS}`,
        hasToken: true,
        methods: [
            TrainingsControllers.deleteTraining,
        ]
    },
]