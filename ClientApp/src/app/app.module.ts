import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { EmailFormComponent } from './components/email-form/email-form.component';
import { EmailHistoryComponent } from './components/email-history/email-history.component';

// Services
import { AuthService } from './services/auth.service';
import { EmailService } from './services/email.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Interceptors

import { TokenInterceptor } from './helpers/token.interceptor';

// Routing Module
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailFormComponent,
    EmailHistoryComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, // Add FormsModule here
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    AuthService,
    EmailService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

