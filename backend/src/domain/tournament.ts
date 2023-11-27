import { ApiError, ErrorCodeAPi } from "../modules/errors/errors";

export enum SizeEnum {
    COMPETITION_OF_2,
    COMPETITION_OF_4,
    COMPETITION_OF_8,
    COMPETITION_OF_16,
}

export enum TypeEnum {
    SINGLE_ELIMINATION,
    DOUBLE_ELIMINATION,
    ROUND_ROBIN,
}

type EnumType = typeof SizeEnum | typeof TypeEnum;

export type TournamentDAO = {
    id: number;
    title: string;
    description: string;
    type: TypeEnum;
    size: SizeEnum;
    start_date: Date;
    end_date: Date;
    prize: string;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}

export class Tournament {
    public id: number;
    public title: string;
    public description: string;
    public type: TypeEnum;
    public size: SizeEnum;
    public start_date: Date;
    public end_date: Date;
    public prize: string;
    public createdAt: Date;
    public updatedAt: Date;
    public userId: number;

    private static getEnumFromValue<T extends EnumType>(value: number, _enum: T): T[keyof T] {
        const keys = Object.keys(_enum).filter((key) => isNaN(Number(key)));
        for (const key of keys) {
            const enumValue = _enum[key];
            if (enumValue === value) {
                return enumValue;
            }
        }
        throw new ApiError(ErrorCodeAPi.BAD_REQUEST, "Aucune valeur correspondante dans l'énumération");
    }

    public static createfromDB(body: TournamentDAO): Tournament {
        const tournament = new Tournament();

        tournament.id = body.id;
        tournament.title = body.title;
        tournament.description = body.description;
        tournament.type = Tournament.getEnumFromValue(body.type, TypeEnum);
        tournament.size = Tournament.getEnumFromValue(body.size, SizeEnum);
        tournament.start_date = body.start_date;
        tournament.end_date = body.end_date;
        tournament.prize = body.prize;
        tournament.createdAt = body.createdAt;
        tournament.updatedAt = body.updatedAt;
        tournament.userId = body.userId;

        return tournament;
    }

    public static createfromBody(body: TournamentDAO): Tournament {
        const tournament = new Tournament();

        tournament.id = body.id;
        tournament.title = body.title;
        tournament.description = body.description;
        tournament.type = Tournament.getEnumFromValue(body.type, TypeEnum);
        tournament.size = Tournament.getEnumFromValue(body.size, SizeEnum);
        tournament.start_date = body.start_date;
        tournament.end_date = body.end_date;
        tournament.prize = body.prize;
        tournament.createdAt = body.createdAt;
        tournament.updatedAt = body.updatedAt;
        tournament.userId = body.userId;

        return tournament;
    }
}
