import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  standalone: true,
  imports: [
    NgFor
  ],

})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('/api/users').subscribe((data: any) => {
      this.users = data;
    });
  }

  deactivateUser(userId: string): void {
    if (confirm('Voulez-vous vraiment désactiver cet utilisateur ?')) {
      this.http.post(`/api/users/${userId}/deactivate`, {}).subscribe(() => {
        alert('Utilisateur désactivé.');
        this.users = this.users.filter(user => user.id !== userId);
      });
    }
  }
}
