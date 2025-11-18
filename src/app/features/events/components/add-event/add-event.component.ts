import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { futureDateValidator } from '../../../shared/validators/date.validators';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly eventService: EventService,
    private readonly router: Router
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

  onSubmit(): void {
    if (this.event.invalid) {
      this.event.markAllAsTouched();
      return;
    }

    const formValue = this.event.value;
    const domainsArray = (formValue.domains || [])
      .map((domain: string) => (domain ?? '').trim())
      .filter((domain: string) => domain.length > 0);
    
    // Ajouter l'événement au service
    this.eventService.addEvent({
      titre: formValue.titre,
      description: formValue.description,
      date: new Date(formValue.date),
      Lieu: formValue.Lieu,
      prix: parseFloat(formValue.prix),
      nbreplaces: parseInt(formValue.nbreplaces, 10),
      imageUrl: formValue.imageUrl,
      origanisateurId: formValue.origanisateurId || 1,
      nbrLikes: formValue.nbrLikes || 0,
      domains: domainsArray.length > 0 ? domainsArray : undefined
    });

    // Réinitialiser le formulaire
    this.event.reset({
      origanisateurId: 1,
      nbrLikes: 0
    });
    this.domains.clear();
    this.addDomain();
    
    // Rediriger vers la liste des événements
    this.router.navigate(['/list']);
  }
}


