import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  // L'@Input name permette di specificare quale icona renderizzare
  // Es: <app-icon name="users" /> renderizzerà l'icona users
  @Input() name!: string;
}
