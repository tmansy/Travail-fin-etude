export type User_roleDAO = {
    id: number;
    roleId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export class User_role {
    public id: number;
    public roleId: number;
    public userId: number;
    public createdAt: Date;
    public updatedAt: Date;

    public static createFromDB(body: User_roleDAO) {
        const user_role = new User_role();

        user_role.id = body.id;
        user_role.roleId = body.roleId;
        user_role.userId = body.userId;
        user_role.createdAt = body.createdAt;
        user_role.updatedAt = body.updatedAt;

        return user_role;
    }
}