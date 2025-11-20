import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DemandeService } from '../../services/demande.service';
import { InterventionService } from '../../services/intervention.service';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chef-dashboard.component.html',
  styleUrls: ['./chef-dashboard.component.css']
})
export class ChefDashboardComponent implements OnInit {
  demandes: any[] = [];
  interventions: any[] = [];
  techniciens: any[] = [];
  showAffectation = false;
  selectedIntervention: any = null;

  constructor(
    private demandeService: DemandeService,
    private interventionService: InterventionService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.loadInterventions();
    this.loadTechniciens();
  }

  loadDemandes(): void {
    this.demandeService.getAllDemandes().subscribe({
      next: (data) => this.demandes = data,
      error: (err) => console.error(err)
    });
  }

  loadInterventions(): void {
    this.interventionService.getAllInterventions().subscribe({
      next: (data) => this.interventions = data,
      error: (err) => console.error(err)
    });
  }

  loadTechniciens(): void {
    this.adminService.getAllTechniciens().subscribe({
      next: (data) => this.techniciens = data,
      error: (err) => console.error(err)
    });
  }

  planifier(demandeId: number): void {
    this.demandeService.planifierIntervention(demandeId).subscribe({
      next: () => {
        alert('Intervention planifiée');
        this.loadInterventions();
      },
      error: (err) => alert('Erreur: ' + err.message)
    });
  }

  affecterTech(intervention: any): void {
    this.selectedIntervention = intervention;
    this.showAffectation = true;
  }

  confirmerAffectation(techId: number): void {
    if (this.selectedIntervention) {
      this.interventionService.affecterTechnicien(this.selectedIntervention.id, techId).subscribe({
        next: () => {
          alert('Technicien affecté');
          this.showAffectation = false;
          this.loadInterventions();
        },
        error: (err) => alert('Erreur: ' + err.message)
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
