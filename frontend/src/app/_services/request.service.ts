import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { MessageService } from "primeng/api";

@Injectable()
export class RequestService {
    private root: string;
    private http: HttpClient;
    private router: Router;
    private toastr: MessageService;

    constructor(http: HttpClient, router: Router, toastr: MessageService) {
        this.root = environment.root;
        this.http = http;
        this.router = router;
        this.toastr = toastr;
    }

    public success(text: string, duration: number = 3000) {
        this.toastr.add({
            key: "general",
            severity: "success",
            summary: "Félicitation !",
            detail: text
        })
    }

    public error(text: string, duration: number = 3000) {
        this.toastr.add({
            key: "general",
            severity: "error",
            summary: "Erreur !",
            detail: text,
            life: 7000,
        })
    }

    public warning(text: string, duration: number = 3000) {
        this.toastr.add({
            key: "general",
            severity: "warn",
            summary: "Attention !",
            detail: text,
            life: 7000,
        })
    }

    public info(text: string, duration: number = 3000) {
        this.toastr.add({
            key: "general",
            severity: "info",
            summary: "Information !",
            detail: text,
            life: 7000,
        })
    }

    private buildOptions(options: { [key: string]: any } = {}) {
        var the_options = [];
        for(var key in options) {
            if(options.hasOwnProperty(key) && key !== "log" && key !== "root") {
                if(options[key] !== false) {
                    let _options = options[key];
                    if (Object.prototype.toString.call(_options) === '[object Object]') {
                        _options = JSON.stringify(_options);
                    } 
                    the_options.push(key + "=" + _options);
                }
            }
        }
        var myOptions = "";
        if (the_options.length > 0) {
            myOptions += "?" + the_options.join("&");
        } 
        return myOptions;
    }

    // GET & DELETE
    private direct(method: "get" | "delete", url: string, options?: any, httpOptions?: any) {
        return new Promise((resolve, reject) => {
            var myOptions = this.buildOptions(options);
            const root = (options && options.root) || this.root;
            var new_url = root + url + myOptions;
            if (options && options.log) {
                console.log(new_url);
            }
            var checkSnackBar = !options || (options && !options.hideSnackBar);
            this.http[method](new_url, httpOptions).subscribe(
                // success
                (res: any) => {
                    if (options && options.log) {
                        console.log(res);
                    }
                    resolve(res);
                },
                // error 
                (res: any) => {
                    this.showError(res, options)
                    reject(res);
                }
            );
        })
    }

    // POST & PUT 
    private data(method: "post" | "put", url: string, data: any, options?: any, httpOptions?: any) {
        return new Promise((resolve, reject) => {
            var myOptions = this.buildOptions(options);
            const root = (options && options.root) || this.root;
            var new_url = root + url + myOptions;
            if (options && options.log) {
                console.log(new_url);
                console.log(data);
            }
            var checkSnackBar = !options || (options && !options.hideSnackBar);
            this.http[method](new_url, data, httpOptions).subscribe(
                (res: any) => {
                    if (options && options.log) {
                        console.log(res);
                    }
                    resolve(res);
                }, 
                (res: any) => {
                    this.showError(res, options);
                    reject(res);
                }
            );
        })
    }

    public get(url: string, options?: any, httpOptions?: any) {
        return this.direct("get", url, options, httpOptions);
    }

    public delete(url: string, options?: any, httpOptions?: any) {
        return this.direct("delete", url, options, httpOptions);
    }

    public put(url: string, options?: any, httpOptions?: any) {
        return this.data("put", url, options, httpOptions);
    }

    public post(url: string, options?: any, httpOptions?: any) {
        return this.data("post", url, options, httpOptions);
    }

    private showError(res: HttpResponse<any>, options: { [key: string]: any}) {
        var checkSnackBar = !options || (options && !options['hideSnackBar']);
        switch(res.status) {
            case 400:
                break; 
            case 401: 
                this.router.navigateByUrl('/public/401');
                break; 
            case 403:
                console.log(res)
                if (checkSnackBar) this.warning(res.body?.message);
                break; 
            case 404 : 
                if (checkSnackBar) this.error(`Not found`);
                break;
            case 500:
                console.log(res)
                let message = res.body?.message;
                if (checkSnackBar) this.error(message);
                break; 
        }
    }

}