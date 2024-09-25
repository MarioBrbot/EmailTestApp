import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:30829/api/email';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmailService]
    });

    emailService = TestBed.inject(EmailService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // ensure no unmatched HTTP requests are pending
    httpMock.verify();
  });

  it('should be created', () => {
    expect(emailService).toBeTruthy();
  });

  describe('sendEmail', () => {
    it('should send a POST request to send an email', () => {
      const mockEmailData = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        body: 'This is a test email.'
      };
      const mockResponse = { success: true };

      emailService.sendEmail(mockEmailData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/send`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockEmailData);

      req.flush(mockResponse);
    });

    it('should handle errors on sendEmail', () => {
      const mockEmailData = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        body: 'This is a test email.'
      };
      const mockError = { message: 'Error sending email' };

      emailService.sendEmail(mockEmailData).subscribe(
        () => fail('expected an error, not a success'),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toEqual(mockError);
        }
      );

      const req = httpMock.expectOne(`${apiUrl}/send`);
      req.flush(mockError, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getEmailHistory', () => {
    it('should send a GET request to retrieve email history', () => {
      const mockEmailHistory = [
        {
          id: 1,
          fromEmailAddress: 'test@example.com',
          toEmailAddress: 'recipient@example.com',
          subject: 'Test Email 1',
          sentDate: '2023-09-22T14:30:00'
        },
        {
          id: 2,
          fromEmailAddress: 'test2@example.com',
          toEmailAddress: 'recipient2@example.com',
          subject: 'Test Email 2',
          sentDate: '2023-09-21T12:00:00'
        }
      ];

      emailService.getEmailHistory().subscribe(history => {
        expect(history).toEqual(mockEmailHistory);
      });


      const req = httpMock.expectOne(`${apiUrl}/history`);
      expect(req.request.method).toBe('GET');

      req.flush(mockEmailHistory);
    });

    it('should handle errors when retrieving email history', () => {
      const mockError = { message: 'Error fetching email history' };

      emailService.getEmailHistory().subscribe(
        () => fail('expected an error, not email history'),
        (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toEqual(mockError);
        }
      );

      const req = httpMock.expectOne(`${apiUrl}/history`);
      req.flush(mockError, { status: 500, statusText: 'Server Error' });
    });
  });
});

   
