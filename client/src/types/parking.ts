export interface ParkingPrivate {
  id: string;
  ownerId: string;
  name: string;
  lat: number;
  lng: number;
  fotoURL?: string;
  foto2URL?: string;
  foto3URL?: string;
  prezzo: number;
  orariDisponibilita: string;
  accessibileDisabili: boolean;
  isActive: boolean;
  createdAt?: Date;
}

export interface ParkingPublic {
  id: string;
  name: string;
  lat: number;
  lng: number;
  prezzo: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
}
