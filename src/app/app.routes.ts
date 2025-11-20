import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DemandeListComponent } from './components/demande-list/demande-list.component';
import { InterventionListComponent } from './components/intervention-list/intervention-list.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ChefDashboardComponent } from './components/chef-dashboard/chef-dashboard.component';
import { TechnicienDashboardComponent } from './components/technicien-dashboard/technicien-dashboard.component';
import { CitoyenDashboardComponent } from './components/citoyen-dashboard/citoyen-dashboard.component';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  
  // Dashboards par rôle
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard(['ADMINISTRATEUR'])] },
  { path: 'chef', component: ChefDashboardComponent, canActivate: [roleGuard(['CHEF_SERVICE'])] },
  { path: 'technicien', component: TechnicienDashboardComponent, canActivate: [roleGuard(['TECHNICIEN'])] },
  { path: 'citoyen', component: CitoyenDashboardComponent, canActivate: [roleGuard(['CITOYEN'])] },
  
  // Routes existantes (compatibilité)
  { path: 'demandes', component: DemandeListComponent, canActivate: [authGuard] },
  { path: 'interventions', component: InterventionListComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '/login' }
];
