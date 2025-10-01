import { Component } from '@angular/core';
import { Event } from '../../models/event';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrl: './list-event.component.css'
})
export class ListEventComponent {


  EVENTS: Event[] = [
  {
    id: 1,
    titre: "Concert Jazz",
    description: "Un concert exceptionnel avec des artistes internationaux.",
    date: new Date("2025-10-15T20:00:00"),
    Lieu: "Théâtre Municipal",
    prix: 50,
    origanisateurId: 101,
    imageUrl: "images/event.png",
    nbreplaces: 200,
    nbrLikes: 35
  },
  {
    id: 2,
    titre: "Conférence Tech IA",
    description: "Discussion autour des dernières tendances en intelligence artificielle.",
    date: new Date("2025-11-02T09:00:00"),
    Lieu: "Centre de Congrès",
    prix: 0, // gratuit
    origanisateurId: 102,
    imageUrl: "images/event.png",
    nbreplaces: 500,
    nbrLikes: 120
  },
  {
    id: 3,
    titre: "Atelier Cuisine",
    description: "Apprenez à préparer des plats traditionnels tunisiens.",
    date: new Date("2025-12-05T14:30:00"),
    Lieu: "Espace Culturel",
    prix: 25,
    origanisateurId: 103,
    imageUrl: "images/event.png",
    nbreplaces: 30,
    nbrLikes: 48
  },
  {
    id: 4,
    titre: "Marathon Carthage",
    description: "Une course sportive à travers les sites historiques.",
    date: new Date("2026-01-20T07:00:00"),
    Lieu: "Carthage",
    prix: 10,
    origanisateurId: 104,
    imageUrl: "images/event.png",
    nbreplaces: 1000,
    nbrLikes: 300
  }
];

}
