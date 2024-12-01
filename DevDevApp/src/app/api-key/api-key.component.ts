import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-api-key',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './api-key.component.html',
  styleUrls: ['./api-key.component.css']
})
export class ApiKeyComponent {
  permissions: string = '';
  newApiKey: string = '';

  constructor(private apiService: ApiService) {}

  createApiKey() {
    const permissionsArray = this.permissions.split(',').map(p => p.trim());
    this.apiService.createApiKey(permissionsArray).subscribe({
      next: (response) => {
        this.newApiKey = response.apiKey as string;
        alert(`API Key Created: ${this.newApiKey}`);
      },
      error: (err) => {
        alert(`Error: ${err.message}`);
      }
    });
  }
}
