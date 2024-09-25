import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('login', () => {
    it('should send POST request to login API', () => {
      const mockResponse = { token: 'mockToken' };
      const username = 'testuser';
      const password = 'testpassword';

      authService.login(username, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('http://localhost:30829/api/user/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });

      req.flush(mockResponse);
    });

    it('should handle error response from login API', () => {
      const username = 'testuser';
      const password = 'testpassword';
      const errorMessage = 'Unauthorized';

      authService.login(username, password).subscribe(
        () => fail('expected an error, not a success'),
        (error) => {
          expect(error.status).toBe(401); 
          expect(error.statusText).toBe('Unauthorized');
        }
      );

      const req = httpMock.expectOne('http://localhost:30829/api/user/login');
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      spyOn(localStorage, 'removeItem');
      authService.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      const mockToken = 'mockToken';
      spyOn(localStorage, 'getItem').and.returnValue(mockToken);

      const token = authService.getToken();
      expect(token).toBe(mockToken);
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });

    it('should return null if no token is found in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const token = authService.getToken();
      expect(token).toBeNull();
      expect(localStorage.getItem).toHaveBeenCalledWith('token');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists in localStorage', () => {
      spyOn(authService, 'getToken').and.returnValue('mockToken');

      const isAuthenticated = authService.isAuthenticated();
      expect(isAuthenticated).toBeTrue();
    });

    it('should return false if no token exists in localStorage', () => {
      spyOn(authService, 'getToken').and.returnValue(null);

      const isAuthenticated = authService.isAuthenticated();
      expect(isAuthenticated).toBeFalse();
    });
  });
});


