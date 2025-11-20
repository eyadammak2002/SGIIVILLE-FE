export interface GeoPoint {
  value?: string;
  latitude: number;
  longitude: number;
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
  photos?: Photo[];
  localisation: GeoPoint;
  citoyenId?: number;
}
