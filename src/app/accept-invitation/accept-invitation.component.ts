import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { AcceptInvitationService } from '../services/accept-invitation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  standalone: true,

})
export class AcceptInvitationComponent {
  invitationToken: string | null = null;

  readonly #service = inject(AcceptInvitationService);
  private mySubscription: Subscription | undefined;
  
  ngOnInit(): void {
   this.acceptInvitation(); 
  }
  
  acceptInvitation(): void {
    if (this.invitationToken) {
      this.mySubscription = this.#service.acceptInvitation(this.invitationToken).subscribe(() => {
        alert('Votre invitation a été acceptée avec succès.');
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

}
