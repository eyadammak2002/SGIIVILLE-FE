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

  createDemande(demande: any, files?: File[]): Observable<any> {
    // If files present, send multipart/form-data with a 'demande' JSON part
    if (files && files.length > 0) {
      const fd = new FormData();
      fd.append('demande', JSON.stringify(demande));
      files.forEach((f, idx) => fd.append('files', f, f.name));
      return this.http.post<any>(this.baseUrl, fd);
    }

    // Otherwise send JSON
    return this.http.post<any>(this.baseUrl, demande);
  }

  planifierIntervention(demandeId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/planifier/${demandeId}`, {});
  }
}
