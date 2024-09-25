import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailHistoryComponent } from './email-history.component';
import { EmailService } from '../../services/email.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('EmailHistoryComponent', () => {
  let component: EmailHistoryComponent;
  let fixture: ComponentFixture<EmailHistoryComponent>;
  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockEmails = [
    {
      id: 1,
      fromEmailAddress: 'test1@example.com',
      toEmailAddress: 'recipient1@example.com',
      ccEmailAddresses: 'cc1@example.com',
      subject: 'Test Email 1',
      importance: 'Normal',
      emailContent: 'This is a test email content 1.',
      sentDate: '2023-09-21T12:00:00'
    },
    {
      id: 2,
      fromEmailAddress: 'test2@example.com',
      toEmailAddress: 'recipient2@example.com',
      ccEmailAddresses: '',
      subject: 'Test Email 2',
      importance: 'High',
      emailContent: 'This is a test email content 2.',
      sentDate: '2023-09-22T14:30:00'
    }
  ];

  beforeEach(async () => {
    const emailServiceMock = jasmine.createSpyObj('EmailService', ['getEmailHistory']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EmailHistoryComponent],
      providers: [
        { provide: EmailService, useValue: emailServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailHistoryComponent);
    component = fixture.componentInstance;
    emailServiceSpy = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should handle error when fetching email history', () => {
    const consoleSpy = spyOn(console, 'error');
    emailServiceSpy.getEmailHistory.and.returnValue(throwError('Error fetching email history'));

    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching email history', 'Error fetching email history');
    expect(component.emails.length).toBe(0);
  });


});

