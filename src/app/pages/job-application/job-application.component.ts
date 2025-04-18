import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { JobService, Job } from '../../services/job.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email/email.service';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './job-application.component.html'
})
export class JobApplicationComponent implements OnInit {
  questions = this.applicationService.questions;
  applicationForm!: FormGroup;
  job: Job | null = null;
  isSubmitting = false;
  isSubmitted = false;
  error: string | null = null;
  isAuthenticated = false;

  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isAuthenticated = isLoggedIn;
    });

    const jobId = Number(this.route.snapshot.paramMap.get('id'));
    if (!jobId) {
      this.router.navigate(['/']);
      return;
    }

    // Charger les questions pour l'offre
    this.applicationService.setCurrentJobId(jobId);
    
    // Initialiser le formulaire après un court délai pour attendre les questions
    setTimeout(() => this.initForm(), 100);
    
    // Récupérer l'offre d'emploi
    this.loadJob(jobId);
  }

  private loadJob(jobId: number): void {
    const jobs = this.jobService.getJobs();
    
    if (jobs.length > 0) {
      this.job = jobs.find(j => j.id === jobId) || null;
    } else {
      this.jobService.fetchJobs();
      setTimeout(() => {
        const updatedJobs = this.jobService.getJobs();
        this.job = updatedJobs.find(j => j.id === jobId) || null;
      }, 300);
    }
  }

  private initForm(): void {
    const formConfig: Record<string, any> = {
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required]
    };
    
    for (const question of this.questions()) {
      formConfig[`question_${question.id}`] = ['', question.required ? Validators.required : []];
    }
    
    this.applicationForm = this.fb.group(formConfig);
  }

  onSubmit(): void {
    if (!this.applicationForm || this.applicationForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.applicationForm.controls).forEach(key => {
        this.applicationForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    this.error = null;
    
    // Transformer les données du formulaire au format attendu par le service
    const formValues = this.applicationForm.value;
    const answers: { [key: number]: string } = {};
    
    for (const key in formValues) {
      if (key.startsWith('question_')) {
        const questionId = parseInt(key.replace('question_', ''));
        answers[questionId] = formValues[key];
      }
    }
    
    // Utiliser les informations du candidat depuis le formulaire
    const candidatName = formValues.name;
    const candidatEmail = formValues.email;
    
    // Soumettre la candidature
    this.applicationService.submitApplication(answers, candidatName, candidatEmail).subscribe({
      next: (response) => {
        if (response.success) {
          // Envoyer l'email avec le lien de suppression
          this.emailService.sendDeletionEmail(
            candidatEmail,
            candidatName,
            response.deleteToken
          ).subscribe({
            next: () => {
              this.isSubmitted = true;
              this.isSubmitting = false;
              // Rediriger vers la page d'accueil après un délai
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 3000);
            },
            error: (emailError) => {
              console.error('Erreur lors de l\'envoi de l\'email', emailError);
              // On continue même si l'email n'a pas été envoyé
              this.isSubmitted = true;
              this.isSubmitting = false;
              setTimeout(() => {
                this.router.navigate(['/']);
              }, 3000);
            }
          });
        } else {
          this.error = response.error || 'Une erreur est survenue lors de la soumission';
          this.isSubmitting = false;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la soumission de la candidature', error);
        this.error = 'Une erreur est survenue lors de la soumission. Veuillez réessayer plus tard.';
        this.isSubmitting = false;
      }
    });
  }
} 