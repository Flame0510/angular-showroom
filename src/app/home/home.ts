import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FeatureCard } from '../components/feature-card/feature-card';
import { Icon } from '../components/icon/icon';

interface Feature {
  routerLink: string;
  iconName: string;
  title: string;
  description: string;
  features: string[];
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, FeatureCard, Icon],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  featureCards: Feature[] = [
    {
      routerLink: '/data-binding',
      iconName: 'data-binding',
      title: 'Data Binding',
      description: 'Esempi di binding bidirezionale',
      features: ['Property Binding', 'Event Binding', 'Two-way Binding [(ngModel)]'],
    },
    {
      routerLink: '/directives',
      iconName: 'directives',
      title: 'Directives',
      description: 'Direttive strutturali e di attributo',
      features: ['@if, @for, @switch', 'ngClass, ngStyle', 'Custom Directives'],
    },
    {
      routerLink: '/forms',
      iconName: 'form',
      title: 'Forms',
      description: 'Reactive Forms con validazione avanzata',
      features: ['FormGroup e FormControl', 'Validatori custom', 'Feedback visivo real-time'],
    },
    {
      routerLink: '/signals',
      iconName: 'signals',
      title: 'Signals',
      description: 'Angular Signals API con esempi pratici',
      features: ['Writable Signals', 'Computed Signals', 'Effects', 'Carrello reattivo'],
    },
    {
      routerLink: '/http',
      iconName: 'http',
      title: 'HTTP & Services',
      description: 'Richieste HTTP con Service Facade Pattern',
      features: [
        'GET, POST, PUT, DELETE',
        'Observable e subscribe',
        'Service Facade best practices',
      ],
    },
    {
      routerLink: '/users',
      iconName: 'users',
      title: 'Users',
      description: 'Gestione utenti con componenti standalone, Signals e Service',
      features: ['Lista utenti dinamica', 'Ricerca in tempo reale', 'Cards con animazioni'],
    },
  ];
}
