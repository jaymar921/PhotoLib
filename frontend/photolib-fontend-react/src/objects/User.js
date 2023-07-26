export class User{
    constructor(fullname = '', bio = '', username = '', pronouns = '', country = '', views = 0, socials = []){
        this.fullname = fullname;
        this.pronouns = pronouns;
        this.country = country;
        this.views = views;
        this.socials = socials;
        this.username = username;
        this.bio = bio;
    }
}