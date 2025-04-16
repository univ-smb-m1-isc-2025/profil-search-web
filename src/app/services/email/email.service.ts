import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface EmailParams {
  to_email: string;
  to_name: string;
  subject: string;
  message: string;
  company_name: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly SERVICE_ID = environment.EMAILJS.SERVICE_ID;
  private readonly TEMPLATE_ID = environment.EMAILJS.TEMPLATE_ID;
  private readonly USER_ID = environment.EMAILJS.USER_ID;

  constructor() {
    // Initialiser EmailJS
    emailjs.init(this.USER_ID);
  }

  sendInvitationEmail(
    email: string,
    name: string,
    companyName: string,
    token: string
  ): Observable<boolean> {
    const templateParams: EmailParams = {
      to_email: email,
      to_name: name,
      subject: `Token d'authentification pour ${companyName}`,
      message: `Voici le token d'authentification pour votre compte ProfilSearch: ${token}`,
      company_name: companyName
    };

    return from(
      emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams)
    ).pipe(
      map(() => true),
      catchError(error => {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
      })
    );
  }
} 