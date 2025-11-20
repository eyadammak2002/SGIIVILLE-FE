import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DemandeService } from '../../services/demande.service';
import * as L from 'leaflet';  // Import Leaflet
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-demande-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LeafletModule],
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.css']
})
export class DemandeFormComponent {
  step = 1;
  totalSteps = 5;
  isSubmitting = false;
  errorMessage: string | null = null;
  ticketId: string | null = null;

  categories = ['Voirie', 'Éclairage public', 'Eau & Assainissement', 'Déchets', 'Sécurité', 'Autre'];
  priorites = [
    { label: 'Faible', value: 'LOW' },
    { label: 'Moyenne', value: 'MEDIUM' },
    { label: 'Haute', value: 'HIGH' }
  ];

  demande: any = {
    category: '',
    subCategory: '',
    description: '',
    priority: 'LOW',
    localisation: { latitude: 0, longitude: 0, address: '' },
    isAnonymous: false,
    contactEmail: ''
  };

  selectedFiles: File[] = [];
  fileError: string | null = null;

  // Options pour la carte Leaflet avec tuiles Satellite Esri (plus réaliste)
  mapOptions: L.MapOptions = {
    layers: [
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      })
    ],
    zoom: 15,  // Zoom plus détaillé par défaut
    center: L.latLng(36.8065, 10.1815)  // Centre sur Tunis
  };

  // Couches pour les marqueurs
  layers: L.Layer[] = [];
  private marker: L.Marker | null = null;  // Marqueur pour la position sélectionnée
  map: L.Map | null = null;  // Référence à la carte

  // Icône rouge personnalisée (SVG base64 pour simplicité)
  private redIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIyMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDIwIDMwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIzMCIgZmlsbD0icmVkIiByeD0iMTAiIHJ5PSIxNSIvPjx0ZXh0IHg9IjUiIHk9IjIwIiBmaWxsPSJ3aGl0ZSI+PC90ZXh0Pjwvc3ZnPg==',  // Icône rouge simple
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  constructor(private demandeService: DemandeService) {}

  // Initialisation de la carte
  onMapReady(map: L.Map) {
    this.map = map;
    map.on('click', (e: L.LeafletMouseEvent) => {
      this.placeMarker(e.latlng);
    });
  }

  // Placer un marqueur rouge et mettre à jour
  private placeMarker(latlng: L.LatLng) {
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng, { icon: this.redIcon, draggable: true }).addTo(this.map!);
      this.layers = [this.marker];
      this.marker.on('dragend', (e: L.DragEndEvent) => {
        this.updateLocationFromMarker();
      });
    }
    this.updateLocationFromMarker();
  }

  // Mettre à jour les coordonnées et récupérer l'adresse auto
  private updateLocationFromMarker() {
    if (this.marker) {
      const latlng = this.marker.getLatLng();
      this.demande.localisation.latitude = latlng.lat;
      this.demande.localisation.longitude = latlng.lng;
      this.getAddressFromLatLng(latlng);  // Récupère l'adresse auto
    }
  }

  // Reverse geocoding pour auto-remplir l'adresse (gratuit via Nominatim)
  private getAddressFromLatLng(latlng: L.LatLng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`)
      .then(response => response.json())
      .then(data => {
        this.demande.localisation.address = data.display_name || 'Adresse inconnue';
      })
      .catch(() => {
        console.error('Erreur de reverse geocoding');
        this.demande.localisation.address = '';  // Reset si erreur
      });
  }

  // Géolocalisation GPS
  geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        this.demande.localisation.latitude = pos.coords.latitude;
        this.demande.localisation.longitude = pos.coords.longitude;
        if (this.map) {
          this.map.setView(latlng, 15);
          this.placeMarker(latlng);
        }
      }, () => alert('Impossible de récupérer la position GPS.'));
    } else {
      alert('Géolocalisation non supportée par votre navigateur.');
    }
  }

  nextStep() { if (this.validateStep(this.step)) this.step++; }

  prevStep() { if (this.step > 1) this.step--; }

  validateStep(step: number): boolean {
    switch(step) {
      case 1:
        return this.demande.localisation.latitude !== 0 && this.demande.localisation.longitude !== 0;
      case 2:
        return !!this.demande.category;
      case 3:
        return (this.demande.description || '').length >= 10;
      case 4:
        return !this.fileError;
      default:
        return true;
    }
  }

  onFileSelected(event: any) {
    this.fileError = null;
    const files = event.target.files as FileList;
    if (!files) return;
    if (files.length > 5) { this.fileError = 'Maximum 5 fichiers autorisés.'; return; }

    const list: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files.item(i)!;
      if (f.size > 8 * 1024 * 1024) { this.fileError = `Le fichier ${f.name} dépasse 8MB.`; return; }
      const allowed = ['image/jpeg','image/png','audio/mpeg','audio/wav','audio/ogg'];
      if (allowed.indexOf(f.type) === -1) { this.fileError = `Type non supporté: ${f.type}`; return; }
      list.push(f);
    }
    this.selectedFiles = list;
  }

  submit() {
    if (this.demande.isAnonymous && !this.demande.contactEmail) {
      this.errorMessage = "L'email est obligatoire pour les signalements anonymes.";
      return;
    }
    this.isSubmitting = true;
    this.errorMessage = null;

    this.demandeService.createDemande(this.demande, this.selectedFiles.length ? this.selectedFiles : undefined)
      .subscribe({
        next: (res: any) => {
          this.ticketId = res.id ? 'SCTY-2025-' + String(res.id).padStart(6,'0') : null;
          this.step = this.totalSteps + 1;
          this.isSubmitting = false;
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = 'Une erreur est survenue lors de l\'envoi.';
          this.isSubmitting = false;
        }
      });
  }

  resetForm() {
    this.step = 1; this.ticketId = null; this.selectedFiles = [];
    this.demande = { category: '', subCategory: '', description: '', priority: 'LOW', localisation: { latitude: 0, longitude: 0, address: '' }, isAnonymous: false, contactEmail: '' };
  }
}