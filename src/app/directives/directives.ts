/**
 * DIRETTIVE ANGULAR - Esempi Base
 *
 * *ngIf: mostra/nasconde elementi
 * *ngFor: ripete elementi
 * [ngClass]: classi CSS dinamiche
 * [ngStyle]: stili dinamici
 *
 * REACT:
 * *ngIf → {condition && <div>...</div>}
 * *ngFor → {items.map(item => <div key={item.id}>...</div>)}
 * [ngClass] → className={isActive ? 'active' : ''}
 * [ngStyle] → style={{color: myColor}}
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageHeader } from '../page-header/page-header';

@Component({
  selector: 'app-directives',
  imports: [CommonModule, PageHeader],
  templateUrl: './directives.html',
  styleUrl: './directives.scss',
})
export class Directives {
  // *ngIf
  showMessage = true;
  isLoggedIn = false;

  // *ngFor
  items = ['Mela', 'Banana', 'Arancia'];

  // ngClass
  isActive = false;

  // ngStyle
  textColor = '#000000';

  toggleMessage() {
    this.showMessage = !this.showMessage;
  }

  toggleLogin() {
    this.isLoggedIn = !this.isLoggedIn;
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  changeColor(color: string) {
    this.textColor = color;
  }
}
