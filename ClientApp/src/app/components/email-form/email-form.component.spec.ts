import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailFormComponent } from './email-form.component';
import { EmailService } from '../../services/email.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('EmailFormComponent', () => {
  let component: EmailFormComponent;
  let fixture: ComponentFixture<EmailFormComponent>;
  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const emailServiceMock = jasmine.createSpyObj('EmailService', ['sendEmail']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EmailFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: EmailService, useValue: emailServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailFormComponent);
    component = fixture.componentInstance;
    emailServiceSpy = TestBed.inject(EmailService) as jasmine.SpyObj<EmailService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with controls', () => {
    expect(component.emailForm.contains('fromEmailAddress')).toBeTruthy();
    expect(component.emailForm.contains('toEmailAddress')).toBeTruthy();
    expect(component.emailForm.contains('ccEmailAddresses')).toBeTruthy();
    expect(component.emailForm.contains('subject')).toBeTruthy();
    expect(component.emailForm.contains('importance')).toBeTruthy();
    expect(component.emailForm.contains('emailContent')).toBeTruthy();
  });

  it('should make fromEmailAddress and toEmailAddress required with valid email format', () => {
    let fromEmailAddress = component.emailForm.get('fromEmailAddress');
    let toEmailAddress = component.emailForm.get('toEmailAddress');

    fromEmailAddress?.setValue('');
    toEmailAddress?.setValue('');

    expect(fromEmailAddress?.valid).toBeFalsy();
    expect(toEmailAddress?.valid).toBeFalsy();

    fromEmailAddress?.setValue('invalidEmail');
    toEmailAddress?.setValue('invalidEmail');

    expect(fromEmailAddress?.valid).toBeFalsy();
    expect(toEmailAddress?.valid).toBeFalsy();

    fromEmailAddress?.setValue('test@example.com');
    toEmailAddress?.setValue('recipient@example.com');

    expect(fromEmailAddress?.valid).toBeTruthy();
    expect(toEmailAddress?.valid).toBeTruthy();
  });

  it('should mark all controls as touched if form is invalid on send()', () => {
    spyOn(component.emailForm, 'markAllAsTouched');

    component.send();

    expect(component.emailForm.markAllAsTouched).toHaveBeenCalled();
  });


  it('should alert error message if email sending fails', () => {
    spyOn(window, 'alert');
    const error = { message: 'Error occurred' };
    emailServiceSpy.sendEmail.and.returnValue(throwError(error));

    component.emailForm.patchValue({
      fromEmailAddress: 'test@example.com',
      toEmailAddress: 'recipient@example.com',
      subject: 'Test Subject',
      emailContent: 'Test Content',
      importance: 'Normal'
    });

    component.send();

    expect(window.alert).toHaveBeenCalledWith('Error sending email: ' + error.message);
  });



});

