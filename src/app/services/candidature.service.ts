import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tag {
  id: number;
  tag: string;
}

export interface BulletPoint {
  id: number;
  bulletPoint: string;
  offreId: number;
}

export interface Offre {
  id: number;
  userSource: number;
  estPubliee: boolean;
  titre?: string;
  entreprise?: string;
  bulletPoints?: BulletPoint[];
}

export interface Candidature {
  id: number;
  offreId: number;
  mailCandidat: string;
  assigneId?: number;
  estClo: boolean;
  positif?: boolean;
  dateCreation: Date;
  commentaire?: string;
  prochaineAction?: string;
  tags?: Tag[];
  offre?: Offre;
  nomAssigne?: string;
}

export interface CandidatureTag {
  candidatureId: number;
  tagId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private readonly apiUrl = environment.BASE_API_URL;

  constructor(private http: HttpClient) { }

  getCandidatures(filtreNonClo: boolean = false): Observable<Candidature[]> {
    // En attendant l'implémentation du backend, on renvoie des données fictives
    return of(this.getMockCandidatures(filtreNonClo));
  }

  getCandidature(id: number): Observable<Candidature | undefined> {
    // En attendant l'implémentation du backend, on renvoie des données fictives
    const candidatures = this.getMockCandidatures();
    const candidature = candidatures.find(c => c.id === id);
    return of(candidature);
  }

  getTags(): Observable<Tag[]> {
    // En attendant l'implémentation du backend, on renvoie des données fictives
    return of([
      { id: 1, tag: 'Urgent' },
      { id: 2, tag: 'Senior' },
      { id: 3, tag: 'Junior' },
      { id: 4, tag: 'Remote' },
      { id: 5, tag: 'Freelance' }
    ]);
  }

  addTagToCandidature(candidatureId: number, tagId: number): Observable<boolean> {
    // Simuler l'ajout d'un tag à une candidature
    return of(true);
  }

  removeTagFromCandidature(candidatureId: number, tagId: number): Observable<boolean> {
    // Simuler la suppression d'un tag d'une candidature
    return of(true);
  }

  updateCandidature(candidature: Candidature): Observable<boolean> {
    // Simuler la mise à jour d'une candidature
    return of(true);
  }

  closeCandidature(id: number, positif: boolean, commentaire: string): Observable<boolean> {
    // Simuler la clôture d'une candidature
    return of(true);
  }

  private getMockCandidatures(filtreNonClo: boolean = false): Candidature[] {
    const candidatures: Candidature[] = [
      {
        id: 1,
        offreId: 1,
        mailCandidat: 'jean.dupont@exemple.com',
        assigneId: 1,
        estClo: false,
        dateCreation: new Date('2023-04-01'),
        commentaire: '',
        tags: [{ id: 1, tag: 'Urgent' }, { id: 3, tag: 'Junior' }],
        offre: {
          id: 1,
          userSource: 1,
          estPubliee: true,
          titre: 'Développeur Frontend Angular',
          entreprise: 'TechCorp',
          bulletPoints: [
            { id: 1, bulletPoint: 'Expérience en Angular', offreId: 1 },
            { id: 2, bulletPoint: 'Connaissance de TypeScript', offreId: 1 },
            { id: 3, bulletPoint: 'Travail en équipe', offreId: 1 }
          ]
        },
        nomAssigne: 'Sarah Martin'
      },
      {
        id: 2,
        offreId: 2,
        mailCandidat: 'marie.laurent@exemple.com',
        assigneId: 2,
        estClo: false,
        dateCreation: new Date('2023-04-05'),
        commentaire: 'Candidate intéressante avec de bonnes compétences techniques',
        prochaineAction: 'Entretien technique',
        tags: [{ id: 2, tag: 'Senior' }, { id: 4, tag: 'Remote' }],
        offre: {
          id: 2,
          userSource: 1,
          estPubliee: true,
          titre: 'Développeur Backend Node.js',
          entreprise: 'InnovTech',
          bulletPoints: [
            { id: 4, bulletPoint: 'Maîtrise de Node.js', offreId: 2 },
            { id: 5, bulletPoint: 'Expérience en API REST', offreId: 2 },
            { id: 6, bulletPoint: 'Base de données NoSQL', offreId: 2 }
          ]
        },
        nomAssigne: 'Thomas Bernard'
      },
      {
        id: 3,
        offreId: 1,
        mailCandidat: 'paul.martin@exemple.com',
        assigneId: 1,
        estClo: true,
        positif: true,
        dateCreation: new Date('2023-03-20'),
        commentaire: 'Excellent candidat, embauché',
        tags: [{ id: 3, tag: 'Junior' }],
        offre: {
          id: 1,
          userSource: 1,
          estPubliee: true,
          titre: 'Développeur Frontend Angular',
          entreprise: 'TechCorp',
          bulletPoints: [
            { id: 1, bulletPoint: 'Expérience en Angular', offreId: 1 },
            { id: 2, bulletPoint: 'Connaissance de TypeScript', offreId: 1 },
            { id: 3, bulletPoint: 'Travail en équipe', offreId: 1 }
          ]
        },
        nomAssigne: 'Sarah Martin'
      },
      {
        id: 4,
        offreId: 2,
        mailCandidat: 'sophie.durand@exemple.com',
        assigneId: 2,
        estClo: true,
        positif: false,
        dateCreation: new Date('2023-03-15'),
        commentaire: 'Profil ne correspondant pas aux attentes',
        tags: [],
        offre: {
          id: 2,
          userSource: 1,
          estPubliee: true,
          titre: 'Développeur Backend Node.js',
          entreprise: 'InnovTech',
          bulletPoints: [
            { id: 4, bulletPoint: 'Maîtrise de Node.js', offreId: 2 },
            { id: 5, bulletPoint: 'Expérience en API REST', offreId: 2 },
            { id: 6, bulletPoint: 'Base de données NoSQL', offreId: 2 }
          ]
        },
        nomAssigne: 'Thomas Bernard'
      }
    ];

    if (filtreNonClo) {
      return candidatures.filter(c => !c.estClo);
    }

    return candidatures;
  }
}
