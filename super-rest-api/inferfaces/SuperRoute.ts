export interface SuperRoute {
    schema?: any;
    contentType?: any;
    parameters?: never[];
    prefix?:string;
    entity?: boolean;
    basic?: boolean;
    name:string;
    description:string;
    method:'get'|'post'|'put'|'delete';
    route:string;
    cache?:boolean;
    token?:boolean;
    public?:boolean;
    module?:string;
    group?:string;
    methods:Array<any>;
    guards?:Array<string>;
}