export class Participation {
  id!: number | string; // Peut être un nombre ou une chaîne (comme Event.id)
  userId: number;
  eventId: number | string; // Peut être un nombre ou une chaîne (comme Event.id)
  emailParticipant: string;
  nbPlaces: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  registrationDate: Date;

  constructor(
    userId: number,
    eventId: number | string,
    emailParticipant: string,
    nbPlaces: number,
    status: 'confirmed' | 'pending' | 'cancelled',
  ) {
    this.userId = userId;
    this.eventId = eventId;
    this.emailParticipant = emailParticipant;
    this.nbPlaces = nbPlaces;
    this.status = status;
    this.registrationDate = new Date();
  }
}
