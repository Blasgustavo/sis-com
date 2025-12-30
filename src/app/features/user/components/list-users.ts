import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserListService } from '../services/user-list.service';
import { UserData } from '../services/user.service';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../pages/list-users.html',
  styleUrls: ['../pages/list-users.css'],
})
export class ListUsers implements OnInit {

  private userListService = inject(UserListService);


  filterForm: FormGroup;

  users = signal<UserData[]>([]);

  ngOnInit(){
    this.userListService.getAllUsers().subscribe({
      next: data => this.users.set(data),
      error: err => console.error('🚫 Error cargando usuarios', err)
    });
  }

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      role: ['']
    });
  }

  get filteredUsers() {
    const { search, role } = this.filterForm.value;

    return this.users().filter(u =>
      (search ? u.names.toLowerCase().includes(search.toLowerCase()) : true) &&
      (role ? u.role === role : true)
    );
  }
}
