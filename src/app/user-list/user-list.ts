import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { User } from '../../types/users';
import { UserCard } from './user-card/user-card';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { PageHeader } from '../page-header/page-header';
import { Icon } from '../components/icon/icon';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, UserCard, FormsModule, PageHeader, Icon],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  // Inietta il service degli utenti tramite Dependency Injection
  usersService = inject<UsersService>(UsersService);

  // Signal che contiene il testo della ricerca
  search = signal<string>('');

  constructor() {
    // Effect che si attiva quando search cambia, filtra automaticamente gli utenti
    effect(() => {
      this.usersService.filterUsers(this.search());
    });
  }

  // Getter per accedere agli utenti dal service
  get users(): User[] {
    return this.usersService.users();
  }

  // Ricarica la lista degli utenti
  fetchUsers() {
    this.usersService.fetchUsers();
  }

  // Elimina un utente, riceve l'ID dal componente figlio UserCard
  deleteUser(userId: number) {
    this.usersService.deleteUser(userId);
  }
}
