import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { OffreService } from '../../services/offre.service';
import { QuestionService } from '../../services/question.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-job-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './job-create.component.html',
})
export class JobCreateComponent implements OnInit {
  offerForm: FormGroup;
  isEditing: boolean = false;
  offerId: number | null = null;
  isSubmitting: boolean = false;
  error: string | null = null;
  success: string | null = null;

  // Pour stocker les questions de la bibliothèque
  existingQuestions: any[] = [];

  // Pour suivre les questions sélectionnées
  selectedQuestions: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private offreService: OffreService,
    private questionService: QuestionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offerForm = this.createForm();
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/connexion']);
        return;
      }
    });

    // Charger les questions existantes
    this.loadExistingQuestions();

    // Vérifier si on est en mode édition
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditing = true;
        this.offerId = +id;
        this.loadOfferDetails(this.offerId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      titre: ['', Validators.required],
      estPubliee: [false],
      paragraphes: this.fb.array([]),
      bulletPoints: this.fb.array([]),
      newQuestions: this.fb.array([]),
    });
  }

  // Getters pour accéder facilement aux FormArrays
  get paragraphes(): FormArray {
    return this.offerForm.get('paragraphes') as FormArray;
  }

  get bulletPoints(): FormArray {
    return this.offerForm.get('bulletPoints') as FormArray;
  }

  get newQuestions(): FormArray {
    return this.offerForm.get('newQuestions') as FormArray;
  }

  // Méthodes pour ajouter des éléments aux FormArrays
  addParagraphe(): void {
    this.paragraphes.push(
      this.fb.group({
        contenu: ['', Validators.required]
      })
    );
  }

  addBulletPoint(): void {
    this.bulletPoints.push(
      this.fb.group({
        content: ['', Validators.required]
      })
    );
  }

  addNewQuestion(): void {
    this.newQuestions.push(
      this.fb.group({
        question: ['', Validators.required]
      })
    );
  }

  // Méthodes pour supprimer des éléments
  removeParagraphe(index: number): void {
    this.paragraphes.removeAt(index);
  }

  removeBulletPoint(index: number): void {
    this.bulletPoints.removeAt(index);
  }

  removeNewQuestion(index: number): void {
    this.newQuestions.removeAt(index);
  }

  // Méthode pour charger les questions existantes
  loadExistingQuestions(): void {
    this.questionService.getAllQuestions().subscribe({
      next: (questions) => {
        this.existingQuestions = questions;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des questions';
        console.error(err);
      }
    });
  }

  // Méthode pour gérer la sélection/déselection des questions existantes
  toggleQuestionSelection(questionId: number): void {
    if (this.selectedQuestions.has(questionId)) {
      this.selectedQuestions.delete(questionId);
    } else {
      this.selectedQuestions.add(questionId);
    }
  }

  // Charger les détails d'une offre existante pour l'édition
  loadOfferDetails(offerId: number): void {
    this.offreService.getOffreById(offerId).subscribe({
      next: (offre) => {
        // Remplir le formulaire avec les données de l'offre
        this.offerForm.get('titre')?.setValue(offre.titre);
        this.offerForm.get('estPubliee')?.setValue(offre.estPubliee);

        // Remplir les paragraphes
        offre.paragraphes.forEach((paragraphe: { contenu: any; id: any; }) => {
          this.paragraphes.push(
            this.fb.group({
              contenu: [paragraphe.contenu, Validators.required],
              id: [paragraphe.id]
            })
          );
        });

        // Remplir les bullet points
        offre.bulletPoints.forEach((bulletPoint: { content: any; id: any; }) => {
          this.bulletPoints.push(
            this.fb.group({
              content: [bulletPoint.content, Validators.required],
              id: [bulletPoint.id]
            })
          );
        });

        // Marquer les questions associées comme sélectionnées
        offre.questions.forEach((question: { id: number; }) => {
          this.selectedQuestions.add(question.id);
        });
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des détails de l\'offre';
        console.error(err);
      }
    });
  }

  // Méthode pour soumettre le formulaire
  onSubmit(): void {
    if (this.offerForm.invalid) {
      this.error = 'Veuillez remplir correctement tous les champs obligatoires';
      return;
    }

    this.isSubmitting = true;
    this.error = null;
    this.success = null;

    const formValues = this.offerForm.value;

    // Étape 1 : Créer ou mettre à jour l'offre de base
    const offreDTO = {
      titre: formValues.titre,
      memberId: JSON.parse(localStorage.getItem('currentUser') || '{}')?.id,
      est_publiee: formValues.estPubliee
    };

    const saveObservable = this.isEditing
      ? this.offreService.updateOffre(this.offerId!, offreDTO)
      : this.offreService.createOffre(offreDTO);

    saveObservable.subscribe({
      next: async (result) => {
        const offreId = this.isEditing ? this.offerId! : result.id;

        try {
          // Étape 2 : Créer et associer les paragraphes
          for (const para of formValues.paragraphes) {
            await firstValueFrom(
              this.offreService.createParagraphe(para.contenu, offreId)
            );
          }

          // Étape 3 : Créer et associer les bullet points
          for (const bp of formValues.bulletPoints) {
            await firstValueFrom(
              this.offreService.createBulletPoint(bp.content, offreId)
            );
          }

          // Étape 4 : Associer les questions existantes
          for (const questionId of this.selectedQuestions) {
            await firstValueFrom(
              this.offreService.associateQuestionToOffre(offreId, questionId)
            );
          }

          // Étape 5 : Créer et associer les nouvelles questions
          for (const q of formValues.newQuestions) {
            const createdQuestion = await firstValueFrom(
              this.questionService.createQuestion(q.question)
            );
            await firstValueFrom(
              this.offreService.associateQuestionToOffre(offreId, createdQuestion.id)
            );
          }

          this.isSubmitting = false;
          this.success = `Offre ${this.isEditing ? 'mise à jour' : 'créée'} avec succès`;

          // Redirection après un court délai
          setTimeout(() => {
            this.router.navigate(['/offres']);
          }, 2000);
        } catch (err) {
          this.isSubmitting = false;
          this.error = `Une erreur est survenue lors de la création des éléments associés`;
          console.error(err);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = `Erreur lors de ${this.isEditing ? 'la mise à jour' : 'la création'} de l'offre`;
        console.error(err);
      }
    });
  }
}
