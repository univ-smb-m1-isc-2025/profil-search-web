import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the application title', () => {
    const titleElement = fixture.nativeElement.querySelector('.logo h1');
    expect(titleElement.textContent).toContain('Profil-search');
  });

  it('should have navigation links', () => {
    const links = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(3);
    
    const linkTexts = Array.from(links).map(link => (link as HTMLElement).textContent?.trim());
    expect(linkTexts).toContain('Accueil');
    expect(linkTexts).toContain('Liste des entreprises');
    expect(linkTexts).toContain('Connexion');
  });

  it('should have correct router links', () => {
    const links = fixture.nativeElement.querySelectorAll('nav a');
    
    expect(links[0].getAttribute('ng-reflect-router-link')).toBe('/');
    expect(links[1].getAttribute('ng-reflect-router-link')).toBe('/liste-entreprises');
    expect(links[2].getAttribute('ng-reflect-router-link')).toBe('/connexion');
  });
}); 