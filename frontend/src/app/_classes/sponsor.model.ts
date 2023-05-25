export class Sponsor {
    public name: string;
    public logo: string;
    public banner: string;
    public description: string;
    public website: string;
    public email: string;
    public phone: string;

    constructor(name: string, logo: string, banner: string, description: string, website: string, email: string, phone: string) {
        this.name = name;
        this.logo = logo;
        this.banner = banner;
        this.description = description;
        this.website = website;
        this.email = email;
        this.phone = phone;
    }
}