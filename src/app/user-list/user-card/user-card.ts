import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from '../../../types/users';
import { Icon } from '../../components/icon/icon';

@Component({
  selector: 'app-user-card',
  imports: [Icon],
  templateUrl: './user-card.html',
  styleUrl: './user-card.scss',
})
export class UserCard implements OnInit, OnDestroy {
  // Riceve i dati dell'utente dal componente parent
  @Input() user?: User;

  // Emette l'ID dell'utente da eliminare al componente parent
  @Output() delete = new EventEmitter<number>();

  // Eseguito quando il componente viene creato
  ngOnInit() {
    console.log(`UserCard di ${this.user?.name} creato`);
  }

  // Eseguito quando il componente viene distrutto
  ngOnDestroy() {
    console.log(`UserCard di ${this.user?.name} distrutto`);
  }

  // Emette l'evento di eliminazione con l'ID dell'utente
  handleDelete() {
    this.delete.emit(this.user?.id);
  }
}
