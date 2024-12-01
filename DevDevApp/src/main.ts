import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; 
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([]),  
    { provide: FormsModule, useValue: FormsModule } 
  ]
}).catch(err => console.error(err));
