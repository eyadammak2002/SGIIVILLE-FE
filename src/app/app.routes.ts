import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DemandeListComponent } from './components/demande-list/demande-list.component';
import { InterventionListComponent } from './components/intervention-list/intervention-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'demandes', component: DemandeListComponent, canActivate: [authGuard] },
  { path: 'interventions', component: InterventionListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
