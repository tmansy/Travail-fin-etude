export type TrainingDAO = {
    id: number;
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