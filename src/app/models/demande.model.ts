export interface GeoPoint {
  value?: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Photo {
  id_photo: number;
  url: string;
  nom: string;
}

export interface Demande {
  id: number;
  description: string;
  dateSoumission: string;
  etat: 'SOUMISE' | 'EN_ATTENTE' | 'TRAITEE' | 'REJETEE';
  attachments?: string[];  // Change to string[] (photo IDs); fetch full Photo[] separately if needed
  localisation: GeoPoint;
  citoyenId?: number;
  category?: string;
  subCategory?: string;
  priority?: string;
  contactEmail?: string;
}