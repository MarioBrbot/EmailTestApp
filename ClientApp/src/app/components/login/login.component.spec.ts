import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule], // Needed because [(ngModel)] is used in the template
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message on invalid login', () => {

    authServiceSpy.login.and.returnValue(throwError('Invalid credentials'));
    
    component.username = 'wrongUser';
    component.password = 'wrongPass';
    component.login();

    expect(component.errorMessage).toBe('Invalid username or password');
    expect(authServiceSpy.login).toHaveBeenCalledWith('wrongUser', 'wrongPass');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to "compose" on successful login', () => {
    const mockResponse = { token: 'mockToken' };
    

    authServiceSpy.login.and.returnValue(of(mockResponse));
    
    component.username = 'validUser';
    component.password = 'validPass';
    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('validUser', 'validPass');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['compose']);
    expect(localStorage.getItem('token')).toBe('mockToken');
  });
});

