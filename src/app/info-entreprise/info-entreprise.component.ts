import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InfoEntrepriseService } from '../services/info-entreprise.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-info-entreprise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-entreprise.component.html',
})
export class InfoEntrepriseComponent implements OnInit, OnDestroy {
  entreprises: any[] = [];

  readonly #service = inject(InfoEntrepriseService);
  private mySubscription: Subscription | undefined;

  ngOnInit(): void {
    this.getEntreprises();
  }

  getEntreprises(): void {
    this.mySubscription = this.#service.getEntreprises().subscribe((data: any) => {
      this.entreprises = data;
    });
  }

  ngOnDestroy(): void {
      if (this.mySubscription) {
        this.mySubscription.unsubscribe();
      }
  }
}
