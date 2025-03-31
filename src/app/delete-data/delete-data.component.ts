import { Component, inject, OnDestroy } from '@angular/core';
import { DeleteDataService } from '../services/delete-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-data',
  templateUrl: './delete-data.component.html',
  standalone: true,
})
export class DeleteDataComponent implements OnDestroy {
  confirmation: boolean = false;

  readonly #service = inject(DeleteDataService);
  private mySubscription: Subscription | undefined;

  deleteData(): void {
    this.mySubscription = this.#service.deleteData().subscribe(() => {
      alert('Vos données ont été supprimées.');
    });
  }

  ngOnDestroy(): void {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
