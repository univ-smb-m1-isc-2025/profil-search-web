import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { InfoEntrepriseComponent } from './components/info-entreprise/info-entreprise.component';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterOutlet,
        InfoEntrepriseComponent,
        HttpClientModule
      ],
    }).compileComponents();
  });

  it('devrait créer l\'application', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('devrait avoir le titre "profil-search"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('profil-search');
  });

  it('devrait afficher le titre', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('profil-search');
  });

  it('devrait avoir RouterOutlet dans le template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });

  it('devrait avoir HttpClientModule importé', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const module = TestBed.inject(HttpClientModule);
    expect(module).toBeTruthy();
  });

  it('devrait être un composant standalone', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const isStandalone = (fixture.componentInstance as any).constructor.ɵcmp.standalone;
    expect(isStandalone).toBeTruthy();
  });

  it('devrait avoir le sélecteur correct', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const selector = (fixture.componentInstance as any).constructor.ɵcmp.selectors[0];
    expect(selector).toContain('app-root');
  });
});
