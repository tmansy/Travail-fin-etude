type ProductDAO = {
    id: number;
    label: string;
    description: string;
    price: number;
    stock: number;
    category: number;
    image_url: string; 
    createdAt: Date;
    updatedAt: Date;
    product_orderId: number;
}

export class Product {
    public id: number;
    public label: string;
    public description: string;
    public price: number;
    public stock: number;
    public category: number;
    public image_url: string;
    public createdAt: Date;
    public updatedAt: Date;
    public product_orderId: number;

    public static createFromDB(body: ProductDAO): Product {
        const product = new Product();

        product.id = body.id;
        product.label = body.label;
        product.description = body.description;
        product.price = body.price;
        product.stock = body.stock;
        product.category = body.category;
        product.image_url = body.image_url;
        product.createdAt = body.createdAt;
        product.updatedAt = body.updatedAt;
        product.product_orderId = body.product_orderId;

        return product;
    }

    public static createFromBody(body: ProductDAO): Product {
        const product = new Product();

        product.id = body.id;
        product.label = body.label;
        product.description = body.description;
        product.price = body.price;
        product.stock = body.stock;
        product.category = body.category;
        product.image_url = body.image_url;
        product.createdAt = body.createdAt;
        product.updatedAt = body.updatedAt;
        product.product_orderId = body.product_orderId;

        return product;
    }
}