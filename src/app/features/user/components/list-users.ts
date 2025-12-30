import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: '../pages/list-users.html',
  styleUrls: ['../pages/list-users.css'],
})
export class ListUsers {

  filterForm: FormGroup;

  users = [
    {
      usuario: 'bgonzales',
      foto: 'https://via.placeholder.com/40',
      nombres: 'Blas Gonzales',
      rol: 'Supervisor',
      fecha: '2024-01-15'
    },
    {
      usuario: 'jperez',
      foto: 'https://via.placeholder.com/40',
      nombres: 'Juan Pérez',
      rol: 'Administrador',
      fecha: '2023-11-02'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      rol: ['']
    });
  }

  get filteredUsers() {
    const { search, rol } = this.filterForm.value;

    return this.users.filter(u =>
      (search ? u.nombres.toLowerCase().includes(search.toLowerCase()) : true) &&
      (rol ? u.rol === rol : true)
    );
  }
}
