import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JobCardComponent } from './job-card.component';
import { Job } from '../../services/job.service';

describe('JobCardComponent', () => {
  let component: JobCardComponent;
  let fixture: ComponentFixture<JobCardComponent>;

  const mockJob: Job = {
    id: 1,
    title: 'Test Job',
    company: 'Test Company',
    description: 'Test Description',
    bulletPoints: ['Point 1', 'Point 2']
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCardComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(JobCardComponent);
    component = fixture.componentInstance;
    component.job = mockJob;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display job title', () => {
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement.textContent).toContain(mockJob.title);
  });

  it('should display company name', () => {
    const companyElement = fixture.nativeElement.querySelector('h3');
    expect(companyElement.textContent).toContain(mockJob.company);
  });

  it('should display job description', () => {
    const descriptionElement = fixture.nativeElement.querySelector('p');
    expect(descriptionElement.textContent).toContain(mockJob.description);
  });

  it('should display all bullet points', () => {
    const bulletPoints = fixture.nativeElement.querySelectorAll('li span:last-child');
    expect(bulletPoints.length).toBe(mockJob.bulletPoints.length);
    bulletPoints.forEach((point: HTMLElement, index: number) => {
      expect(point.textContent).toContain(mockJob.bulletPoints[index]);
    });
  });

  it('should have correct postuler link', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('ng-reflect-router-link')).toContain('/postuler,1');
  });
}); 