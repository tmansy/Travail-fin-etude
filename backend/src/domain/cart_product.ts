type CartDAO = {
    id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    size: string;
    createdAt: Date;
    updatedAt: Date;
    cartId: number;
    productId: number;
}

export class Cart_Product {
    public id: number;
    public quantity: number;
    public unit_price: number;
    public total_price: number;
    public size: string;
    public createdAt: Date;
    public updatedAt: Date;
    public cartId: number;
    public productId: number;

    public static createFromDB(body: CartDAO): Cart_Product {
        const cart_product = new Cart_Product();

        cart_product.id = body.id;
        cart_product.quantity = body.quantity;
        cart_product.unit_price = body.unit_price;
        cart_product.total_price = body.total_price;
        cart_product.createdAt = body.createdAt;
        cart_product.updatedAt = body.updatedAt;
        cart_product.cartId = body.cartId;
        cart_product.productId = body.productId;

        return cart_product;
    }

    public static createFromBody(body: CartDAO): Cart_Product {
        const cart_product = new Cart_Product();

        cart_product.id = body.id;
        cart_product.quantity = body.quantity;
        cart_product.unit_price = body.unit_price;
        cart_product.total_price = cart_product.quantity * cart_product.unit_price;
        cart_product.size = body.size;
        cart_product.createdAt = body.createdAt;
        cart_product.updatedAt = body.updatedAt;
        cart_product.cartId = body.cartId;
        cart_product.productId = body.productId;

        return cart_product;
    }
}