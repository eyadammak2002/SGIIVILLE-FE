import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande } from '../models/demande.model';

@Injectable({ providedIn: 'root' })
export class DemandeService {
  private baseUrl = 'http://localhost:8080/api/demandes';

  constructor(private http: HttpClient) {}

  getAllDemandes(): Observable<Demande[]> {
    return this.http.get<Demande[]>(this.baseUrl);
  }

  getDemandeById(id: number): Observable<Demande> {
    return this.http.get<Demande>(`${this.baseUrl}/${id}`);
  }

  createDemande(demande: Partial<Demande> | any): Observable<Demande> {
    return this.http.post<Demande>(this.baseUrl, demande);
  }

  planifierIntervention(demandeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/planifier/${demandeId}`, {});
  }
}
