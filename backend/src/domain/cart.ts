type CartDAO = {
   id: number;
   total_price: number;
   discount: number;
   createdAt: Date;
   updatedAt: Date;
   userId: number;
}

export class Cart {
    public id: number;
    public total_price: number;
    public discount: number;
    public createdAt: Date;
    public updatedAt: Date;
    public userId: number;

    public static createFromDB(body: CartDAO): Cart {
        const cart = new Cart();

        cart.id = body.id;
        cart.total_price = body.total_price;
        cart.discount = body.discount;
        cart.createdAt = body.createdAt;
        cart.updatedAt = body.updatedAt;
        cart.userId = body.userId;

        return cart;
    }

    public static createFromBody(body: CartDAO): Cart {
        const cart = new Cart();

        cart.id = body.id;
        cart.total_price = body.total_price;
        cart.discount = body.discount;
        cart.createdAt = body.createdAt;
        cart.updatedAt = body.updatedAt;
        cart.userId = body.userId;

        return cart;
    }
}