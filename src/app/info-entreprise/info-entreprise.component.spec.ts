import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoEntrepriseComponent } from './info-entreprise.component';

describe('InfoEntrepriseComponent', () => {
  let component: InfoEntrepriseComponent;
  let fixture: ComponentFixture<InfoEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoEntrepriseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
