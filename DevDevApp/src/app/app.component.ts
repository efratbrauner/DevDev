import { Component } from '@angular/core';
import { TokenManagementComponent } from './token-management/token-management.component';
import { ApiKeyComponent } from './api-key/api-key.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TokenManagementComponent, ApiKeyComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DevDev API Management';
}
