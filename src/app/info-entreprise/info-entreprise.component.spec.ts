import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoEntrepriseComponent } from './info-entreprise.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('InfoEntrepriseComponent', () => {
  let component: InfoEntrepriseComponent;
  let fixture: ComponentFixture<InfoEntrepriseComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

    await TestBed.configureTestingModule({
      imports: [InfoEntrepriseComponent],
      providers: [
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoEntrepriseComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait charger la liste des entreprises au démarrage', () => {
    const mockEntreprises = [
      { name: 'Entreprise 1' },
      { name: 'Entreprise 2' }
    ];

    httpClientSpy.get.and.returnValue(of(mockEntreprises));

    fixture.detectChanges();

    expect(component.entreprises).toEqual(mockEntreprises);
    expect(httpClientSpy.get).toHaveBeenCalledWith('api.profil-search.oups.net/api/entreprises/all');
  });

  it('devrait gérer les erreurs lors du chargement des entreprises', () => {
    const errorMessage = 'Erreur API';
    httpClientSpy.get.and.returnValue(throwError(() => new Error(errorMessage)));

    spyOn(console, 'error');

    fixture.detectChanges();

    expect(component.entreprises).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error fetching entreprises:', jasmine.any(Error));
  });

});
