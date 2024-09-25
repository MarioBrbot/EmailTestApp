import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the guard', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true); 
    const canActivate = authGuard.canActivate();
    expect(canActivate).toBeTrue(); 
    expect(routerSpy.navigate).not.toHaveBeenCalled(); 
  });

  it('should return false and navigate to login if user is not authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false); 
    const canActivate = authGuard.canActivate();
    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
