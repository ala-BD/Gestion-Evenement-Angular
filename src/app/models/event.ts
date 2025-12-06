export interface Event {

id : number;
titre : string;
description : string;
date : Date;
Lieu : string;
prix : number;
origanisateurId : number;
imageUrl : string;
nbreplaces : number;
nbrLikes : number;
 domains?: string[];
 detailedAddress?: { street: string; city: string; governorate: string; zipcode: string };

}
