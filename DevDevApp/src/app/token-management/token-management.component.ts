import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-token-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './token-management.component.html',
  styleUrls: ['./token-management.component.css']
})
export class TokenManagementComponent implements OnInit {
  apiKey: string = '';
  jwtToken: string = '';
  userTokens: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getTokens();
  }

  authenticateApiKey() {
    this.apiService.authenticate(this.apiKey).subscribe({
      next: (response) => {
        this.jwtToken = response.token as string;
        alert(`JWT Token: ${this.jwtToken}`);
        this.getTokens();
      },
      error: (err) => {
        alert(`Error: ${err.message}`);
      }
    });
  }

  getTokens() {
    this.apiService.getTokens('user-id').subscribe((tokens) => {
      this.userTokens = tokens;
    });
  }

  revokeApiKey(id: string) {
    this.apiService.revokeApiKey(id).subscribe(() => {
      alert('API Key revoked successfully!');
      this.getTokens();
    });
  }
}
