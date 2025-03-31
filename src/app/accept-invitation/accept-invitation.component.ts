import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  standalone: true,

})
export class AcceptInvitationComponent {
  invitationToken: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.invitationToken = this.route.snapshot.queryParamMap.get('token');
  }

  acceptInvitation(): void {
    this.http.post('/api/invitations/accept', { token: this.invitationToken }).subscribe(() => {
      alert('Invitation acceptée avec succès.');
    });
  }
}
