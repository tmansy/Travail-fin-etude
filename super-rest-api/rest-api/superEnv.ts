

class SuperConfig {
    
    public root = __dirname
    public log = false 
    public createDatabase = true 

    set(key:string, value:any) {
        this[key] = value
    }

}


export const SuperConfiguration = new SuperConfig() 