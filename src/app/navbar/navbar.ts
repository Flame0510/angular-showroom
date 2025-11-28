import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Icon } from '../components/icon/icon';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Icon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {}
