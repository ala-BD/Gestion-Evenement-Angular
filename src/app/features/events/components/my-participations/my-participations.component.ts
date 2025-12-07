import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { Participation } from '../../../../models/participation';
import { Event } from '../../../../models/event';
import { ParticipationService } from '../../services/participation.service';
import { EventService } from '../../services/event.service';

interface ParticipationWithEvent extends Participation {
  event?: Event;
}

@Component({
  selector: 'app-my-participations',
  templateUrl: './my-participations.component.html',
  styleUrl: './my-participations.component.css'
})
export class MyParticipationsComponent implements OnInit, OnDestroy {
  participations: ParticipationWithEvent[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  private subscriptions: Subscription[] = [];
  private readonly USER_ID = 1; // Workshop: userId = 1

  constructor(
    private readonly participationService: ParticipationService,
    private readonly eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadMyParticipations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadMyParticipations(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    const sub = this.participationService.getParticipationsByUserId(this.USER_ID).subscribe({
      next: (participations) => {
        // Charger les détails de chaque événement
        if (participations.length === 0) {
          this.participations = [];
          this.isLoading = false;
          return;
        }

        // Créer un tableau d'observables pour récupérer tous les événements
        const eventObservables = participations.map(p => 
          this.eventService.getEventById(p.eventId)
        );

        forkJoin(eventObservables).subscribe({
          next: (events) => {
            this.participations = participations.map((p, index) => ({
              ...p,
              event: events[index]
            }));
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des événements:', error);
            // Afficher les participations même si les événements ne peuvent pas être chargés
            this.participations = participations;
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de mes participations:', error);
        this.errorMessage = 'Impossible de charger vos participations. Vérifiez que le backend est démarré sur http://localhost:3000';
        this.participations = [];
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  // Workshop: Annuler une participation
  cancelParticipation(participation: ParticipationWithEvent): void {
    if (!participation.id) {
      // Workshop: Gestion d'erreur avec alert
      alert('Impossible d\'annuler cette participation (ID manquant)');
      return;
    }

    if (confirm(`Êtes-vous sûr de vouloir annuler votre participation à "${participation.event?.titre || 'cet événement'}" ?`)) {
      const sub = this.participationService.deleteParticipation(participation.id).subscribe({
        next: () => {
          console.log('Participation annulée avec succès');
          // Workshop: Gestion d'erreur avec alert
          alert('Participation annulée avec succès !');
          // Recharger la liste des participations
          this.loadMyParticipations();
        },
        error: (error) => {
          console.error('Erreur lors de l\'annulation:', error);
          // Workshop: Gestion d'erreur avec alert
          const errorMessage = typeof error === 'string' ? error : 'Erreur lors de l\'annulation de la participation. Veuillez réessayer.';
          alert(errorMessage);
        }
      });

      this.subscriptions.push(sub);
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-success';
      case 'pending':
        return 'bg-warning';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  }
}
