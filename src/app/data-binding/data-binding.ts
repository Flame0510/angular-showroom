/**
 * DATA BINDING IN ANGULAR
 *
 * 1. INTERPOLAZIONE: {{ variabile }} o {{ metodo() }}
 * 2. PROPERTY BINDING: [property]="valore"
 * 3. EVENT BINDING: (event)="handler()"
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageHeader } from '../page-header/page-header';

@Component({
  selector: 'app-data-binding',
  imports: [CommonModule, PageHeader],
  templateUrl: './data-binding.html',
  styleUrl: './data-binding.scss',
})
export class DataBinding {
  // Proprietà semplice - usata con interpolazione {{ text }}
  text = 'testo statico da variabile';

  // Proprietà mutabile - modificata dagli eventi
  // In React: const [imgLogo, setImgLogo] = useState('/logo.png')
  imgLogo = '/logo.png';

  // Metodo semplice - chiamato nel template: {{ getText() }}
  getText() {
    return 'testo da getText()';
  }

  // Metodo con parametri - esempio: {{ getDynamicText('test') }}
  getDynamicText(text: string) {
    return 'dynamic text: ' + text;
  }

  // Metodo con più parametri - esempio: {{ sum(2, 3) }}
  sum(a: number, b: number) {
    return a + b;
  }

  trackByUserId(_: number, user: any) {
    return user.id;
  }

  // GETTER: accede a imgLogo come proprietà
  // Usabile nel template: {{ imgLogoSrc }} o [src]="imgLogoSrc"
  get imgLogoSrc() {
    return this.imgLogo;
  }

  // SETTER: modifica imgLogo come proprietà
  // In React non servono getter/setter, si usa direttamente lo state
  set imgLogoSrc(value: string) {
    this.imgLogo = value;
  }

  // EVENT HANDLER: modifica lo stato quando si clicca
  // Angular: (click)="onClick()" - chiamata esplicita
  // React: onClick={onClick} - riferimento alla funzione
  onClick() {
    this.imgLogo = '/path-inesistente.png';
  }

  onReset() {
    this.imgLogo = '/logo.png';
  }
}
