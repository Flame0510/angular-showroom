import { Component } from '@angular/core';
import { UserList } from '../user-list/user-list';

@Component({
  selector: 'app-user-page',
  imports: [UserList],
  templateUrl: './user-page.html',
  styleUrl: './user-page.scss',
})
export class UserPage {}
