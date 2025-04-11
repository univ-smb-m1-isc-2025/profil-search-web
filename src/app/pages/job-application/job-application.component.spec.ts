import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { JobApplicationComponent } from './job-application.component';
import { ApplicationService } from '../../services/application.service';
import { JobService } from '../../services/job.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('JobApplicationComponent', () => {
  let component: JobApplicationComponent;
  let fixture: ComponentFixture<JobApplicationComponent>;
  let applicationService: jasmine.SpyObj<ApplicationService>;
  let jobService: jasmine.SpyObj<JobService>;

  const mockJob = {
    id: 1,
    title: 'Test Job',
    company: 'Test Company',
    description: 'Test Description',
    bulletPoints: ['Point 1', 'Point 2']
  };

  const mockQuestions = [
    {
      id: 1,
      question: "Combien d'année d'expérience disposez-vous ?",
      type: 'text' as const,
      required: true
    }
  ];

  beforeEach(async () => {
    const applicationServiceSpy = jasmine.createSpyObj('ApplicationService', [
      'getQuestions',
      'setCurrentJobId',
      'submitApplication'
    ]);
    applicationServiceSpy.getQuestions.and.returnValue(mockQuestions);

    const jobServiceSpy = jasmine.createSpyObj('JobService', ['getJobs']);
    jobServiceSpy.getJobs.and.returnValue(of([mockJob]));

    await TestBed.configureTestingModule({
      imports: [
        JobApplicationComponent,
        RouterTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ApplicationService, useValue: applicationServiceSpy },
        { provide: JobService, useValue: jobServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    applicationService = TestBed.inject(ApplicationService) as jasmine.SpyObj<ApplicationService>;
    jobService = TestBed.inject(JobService) as jasmine.SpyObj<JobService>;
    
    fixture = TestBed.createComponent(JobApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load job details on init', () => {
    expect(component.job).toEqual(mockJob);
    expect(jobService.getJobs).toHaveBeenCalled();
  });

  it('should load questions on init', () => {
    expect(component.questions).toEqual(mockQuestions);
    expect(applicationService.getQuestions).toHaveBeenCalled();
  });

  it('should set current job id on init', () => {
    expect(applicationService.setCurrentJobId).toHaveBeenCalledWith(1);
  });

  it('should submit application on form submit', () => {
    const testAnswers = { 1: 'Test Answer' };
    component.answers = testAnswers;
    component.onSubmit();
    expect(applicationService.submitApplication).toHaveBeenCalledWith(testAnswers);
  });
}); 