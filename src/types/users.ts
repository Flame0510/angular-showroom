// Interface che definisce la struttura di un utente
export interface User {
  id: number;
  name: string;
  surname: string;
  username: string;
  email: string;
  age: number;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}

// Interface per l'indirizzo dell'utente
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

// Interface per le coordinate geografiche
export interface Geo {
  lat: string;
  lng: string;
}

// Interface per le informazioni aziendali
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
