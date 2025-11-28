import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { BouncingLogo } from './bouncing-logo/bouncing-logo';

@Component({
  selector: 'app-root',
  imports: [RouterModule, Navbar, BouncingLogo],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('corso-34-angular');
}
