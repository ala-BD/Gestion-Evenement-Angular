import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { futureDateValidator } from '../../../shared/validators/date.validators';
import { EventService } from '../../services/event.service';
import { Event } from '../../../../models/event';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly eventService: EventService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.event = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^[A-Za-z].*/)]],
      description: ['', [Validators.required, Validators.minLength(30)]],
      date: ['', [Validators.required, futureDateValidator(7)]],
      prix: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      nbreplaces: [null, [Validators.required, Validators.pattern(/^(100|[1-9]?\d)$/)]],
      Lieu: ['', Validators.required],
      imageUrl: ['', Validators.required],
      origanisateurId: [1],
      nbrLikes: [0],
      domains: this.formBuilder.array([])
    });

    this.addDomain();
  }

  event!: FormGroup;
  isEditMode: boolean = false;
  eventId?: number | string;

  get domains(): FormArray {
    return this.event.get('domains') as FormArray;
  }

  getControl(name: string): FormControl {
    return this.event.get(name) as FormControl;
  }

  addDomain(): void {
    this.domains.push(new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]));
  }

  removeDomain(index: number): void {
    this.domains.removeAt(index);
  }

  cancel(): void {
    if (this.isEditMode) {
      this.router.navigate(['/events/my-events']);
    } else {
      this.router.navigate(['/list']);
    }
  }

  ngOnInit(): void {
    // Workshop: Vérifier si on est en mode édition (via queryParams)
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        // Convertir en nombre si possible, sinon garder la chaîne
        this.eventId = isNaN(Number(id)) ? id : Number(id);
        if (this.eventId) {
          this.loadEventForEdit(this.eventId);
        }
      }
    });
  }

  // Workshop: Charger l'événement pour édition
  loadEventForEdit(id: number | string): void {
    this.eventService.getEventById(id).subscribe({
      next: (event: Event) => {
        // Formater la date pour l'input date (format YYYY-MM-DD)
        const dateStr = event.date instanceof Date 
          ? event.date.toISOString().split('T')[0]
          : new Date(event.date).toISOString().split('T')[0];

        // Remplir le formulaire avec les données de l'événement
        this.event.patchValue({
          titre: event.titre,
          description: event.description,
          date: dateStr,
          prix: event.prix,
          nbreplaces: event.nbreplaces,
          Lieu: event.Lieu,
          imageUrl: event.imageUrl,
          origanisateurId: event.origanisateurId,
          nbrLikes: event.nbrLikes
        });

        // Remplir les domaines
        this.domains.clear();
        if (event.domains && event.domains.length > 0) {
          event.domains.forEach(domain => {
            this.domains.push(new FormControl(domain, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]));
          });
        } else {
          this.addDomain();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'événement:', error);
        alert('Erreur lors du chargement de l\'événement. Retour à la liste.');
        this.router.navigate(['/events/my-events']);
      }
    });
  }

  onSubmit(): void {
    if (this.event.invalid) {
      this.event.markAllAsTouched();
      return;
    }

    const formValue = this.event.value;
    const domainsArray = (formValue.domains || [])
      .map((domain: string) => (domain ?? '').trim())
      .filter((domain: string) => domain.length > 0);
    
    const eventData = {
      titre: formValue.titre,
      description: formValue.description,
      date: formValue.date, // Format ISO string pour le backend
      Lieu: formValue.Lieu,
      prix: parseFloat(formValue.prix),
      nbreplaces: parseInt(formValue.nbreplaces, 10),
      imageUrl: formValue.imageUrl,
      origanisateurId: formValue.origanisateurId || 1,
      nbrLikes: formValue.nbrLikes || 0,
      domains: domainsArray.length > 0 ? domainsArray : undefined
    };

    // Workshop: Si mode édition, utiliser PUT, sinon POST
    if (this.isEditMode && this.eventId) {
      // PUT: Mettre à jour l'événement
      this.eventService.updateEvent({
        ...eventData,
        id: this.eventId
      } as Event).subscribe({
        next: (updatedEvent) => {
          console.log('Événement modifié avec succès:', updatedEvent);
          alert('Événement modifié avec succès !');
          // Rediriger vers mes événements
          this.router.navigate(['/events/my-events']);
        },
        error: (error) => {
          console.log('Erreur lors de la modification de l\'événement:', error);
          alert('Erreur lors de la modification de l\'événement. Veuillez réessayer.');
        }
      });
    } else {
      // POST: Ajouter l'événement via HttpClient (Workshop: utiliser addEventToBackend)
      this.eventService.addEventToBackend(eventData).subscribe({
        next: (newEvent) => {
          console.log('Événement créé avec succès:', newEvent);
          console.log('ID de l\'événement créé:', newEvent.id, 'Type:', typeof newEvent.id);
          
          // Réinitialiser le formulaire
          this.event.reset({
            origanisateurId: 1,
            nbrLikes: 0
          });
          this.domains.clear();
          this.addDomain();
          
          // Rediriger vers la liste des événements
          this.router.navigate(['/list']);
        },
        error: (error) => {
          console.log('Erreur lors de la création de l\'événement:', error);
          alert('Erreur lors de la création de l\'événement. Veuillez réessayer.');
        }
      });
    }
  }
}


