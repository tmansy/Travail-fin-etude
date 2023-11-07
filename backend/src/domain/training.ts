export type TrainingDAO = {
    id: number;
    title: string;
    description: string;
    from: Date;
    to: Date;
    createdAt: Date;
    updatedAt: Date;
    teamId: Date;
    userId: Date;
}

export class Training {
    public id: number;
    public title: string;
    public description: string;
    public from: Date;
    public to: Date;
    public createdAt: Date;
    public updatedAt: Date;
    public teamId: Date;
    public userId: Date;

    public static createFromDB(body: TrainingDAO) {
        const training = new Training();

        training.id = body.id;
        training.title = body.title;
        training.description = body.description;
        training.from = body.from;
        training.to = body.to;
        training.createdAt = body.createdAt;
        training.updatedAt = body.updatedAt;
        training.teamId = body.teamId;
        training.userId = body.userId;

        return training;
    }

    public static createFromBody(body: TrainingDAO) {
        const training = new Training();

        training.id = body.id;
        training.title = body.title;
        training.description = body.description;
        training.from = body.from;
        training.to = body.to;
        training.createdAt = body.createdAt;
        training.updatedAt = body.updatedAt;
        training.teamId = body.teamId;
        training.userId = body.userId;

        return training;
    }
}