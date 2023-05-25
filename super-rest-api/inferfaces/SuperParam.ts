import { Response } from "express";
export interface SuperParam {
    name:string;
    type:string;
    description?:string;
    middleware?:(res:Response) => void;
}