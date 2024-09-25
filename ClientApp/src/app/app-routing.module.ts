import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { EmailFormComponent } from './components/email-form/email-form.component';
import { EmailHistoryComponent } from './components/email-history/email-history.component';


import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: AppComponent }, 
  { path: 'login', component: LoginComponent },
  {
    path: 'compose',
    component: EmailFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'history',
    component: EmailHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }, // Wildcard route for handling 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


