import { Injectable, signal } from '@angular/core';
import { User } from '../types/users';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // Array di utenti accessibile nel template
  baseUsers: User[] = [];

  users = signal<User[]>([]);

  /**
   * Costruttore che inizializza il servizio con la dipendenza del client HTTP e carica gli utenti.
   * Recupera automaticamente gli utenti quando il servizio viene istanziato.
   *
   * @param http - Il client HTTP per effettuare richieste API
   */
  constructor(private http: HttpClient) {
    // Carica gli utenti all'inizializzazione del servizio
    this.fetchUsers();
  }

  // Funzione per ottenere gli utenti da un'API esterna
  fetchUsers() {
    this.http.get<User[]>('https://jsonplaceholder.typicode.com/users').subscribe((users) => {
      this.baseUsers = users;
      this.users.set(users);
    });
  }

  // Funzione per filtrare gli utenti in base a una stringa di ricerca
  filterUsers(search?: string) {
    // se search è undefined fa il set di users da baseUsers
    if (!search) {
      this.users.set(this.baseUsers);
    }

    const searchLower = (search || '').toLowerCase().trim();

    this.users.set(
      this.baseUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower)
      )
    );
  }

  // Funzione per aggiornare la lista degli utenti
  setUsers(users: User[]) {
    this.users.set(users);
  }

  // Funzione per eliminare un utente in base al suo ID
  deleteUser(userId: number) {
    this.baseUsers = this.baseUsers.filter((user) => user.id !== userId);
    this.users.set(this.baseUsers);
  }
}
