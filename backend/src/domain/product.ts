import { ApiError, ErrorCodeAPi } from "../modules/errors/errors";

export enum Category {
    MAILLOTS,
    VESTES,
    PULLS,
    TSHIRTS,
    PANTALONS,
    JOGGINGS,
    CHAUSSURES,
    TAPISDESOURIS,
    CLAVIERS,
    CASQUES,
    CHAISES,
}

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

type EnumType = typeof Category;

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

    public static createFromDB(body: ProductDAO): Product {
        const product = new Product();

        product.id = body.id;
        product.label = body.label;
        product.description = body.description;
        product.price = body.price;
        product.stock = body.stock;
        product.category = Product.getEnumFromValue(body.category, Category);
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