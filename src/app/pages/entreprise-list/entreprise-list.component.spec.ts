import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EntrepriseListComponent, Entreprise } from './entreprise-list.component';
import { InfoEntrepriseService } from '../../services/info-entreprise.service';
import { of } from 'rxjs';

describe('EntrepriseListComponent', () => {
  let component: EntrepriseListComponent;
  let fixture: ComponentFixture<EntrepriseListComponent>;
  let mockInfoEntrepriseService: jasmine.SpyObj<InfoEntrepriseService>;

  const mockEntreprises: Entreprise[] = [
    {
      id: 1,
      name: 'Google',
      logo: 'google-logo.png',
      industry: 'Technology',
      description: 'Leading technology company',
      location: 'Mountain View, CA',
      jobCount: 150
    },
    {
      id: 2,
      name: 'Apple',
      industry: 'Technology',
      location: 'Cupertino, CA',
      jobCount: 100
    }
  ];

  beforeEach(async () => {
    mockInfoEntrepriseService = jasmine.createSpyObj('InfoEntrepriseService', ['getEntreprises']);
    mockInfoEntrepriseService.getEntreprises.and.returnValue(of(mockEntreprises));

    await TestBed.configureTestingModule({
      imports: [EntrepriseListComponent, RouterTestingModule],
      providers: [
        { provide: InfoEntrepriseService, useValue: mockInfoEntrepriseService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EntrepriseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load entreprises on init', () => {
    expect(component.entreprises).toEqual(mockEntreprises);
    expect(mockInfoEntrepriseService.getEntreprises).toHaveBeenCalled();
  });

  it('should display entreprise cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.bg-white.rounded-lg');
    expect(cards.length).toBe(mockEntreprises.length);
  });

  it('should display entreprise name and industry', () => {
    const firstCard = fixture.nativeElement.querySelector('.bg-white.rounded-lg');
    expect(firstCard.textContent).toContain('Google');
    expect(firstCard.textContent).toContain('Technology');
  });

  it('should display logo when available', () => {
    const logo = fixture.nativeElement.querySelector('img');
    expect(logo).toBeTruthy();
    expect(logo.src).toContain('google-logo.png');
    expect(logo.alt).toBe('Google');
  });

  it('should display job count', () => {
    const jobCounts = fixture.nativeElement.querySelectorAll('.text-sm.text-gray-500');
    expect(jobCounts[0].textContent).toContain('150 postes disponibles');
    expect(jobCounts[1].textContent).toContain('100 postes disponibles');
  });

  it('should have correct detail links', () => {
    const detailButtons = fixture.nativeElement.querySelectorAll('button');
    expect(detailButtons[0].getAttribute('ng-reflect-router-link')).toContain('/entreprise,1');
    expect(detailButtons[1].getAttribute('ng-reflect-router-link')).toContain('/entreprise,2');
  });

  it('should unsubscribe on destroy', () => {
    const subscription = spyOn(component['mySubscription']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(subscription).toHaveBeenCalled();
  });
}); 