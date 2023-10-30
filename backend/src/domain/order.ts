type OrderDAO = {
    id: number;
    total_price: number;
    delivery_address: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
}

export class Order {
    public id: number;
    public total_price: number;
    public delivery_address: string;
    public status: number;
    public createdAt: Date;
    public updatedAt: Date;
    public userId: number;

    public static createFromBody(body: OrderDAO): Order {
        const order = new Order();

        order.id = body.id;
        order.total_price = body.total_price;
        order.delivery_address = body.delivery_address;
        order.status = body.status;
        order.createdAt = body.createdAt;
        order.updatedAt = body.updatedAt;
        order.userId = body.userId;

        return order;
    }

    public static createFromDB(body: OrderDAO): Order {
        const order = new Order();

        order.id = body.id;
        order.total_price = body.total_price;
        order.delivery_address = body.delivery_address;
        order.status = body.status;
        order.createdAt = body.createdAt;
        order.updatedAt = body.updatedAt;
        order.userId = body.userId;

        return order;
    }
}