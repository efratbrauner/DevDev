import { Routes } from '@angular/router';
import { ApiKeyComponent } from './api-key/api-key.component';

const routeConfig: Routes = [
  {
    path: '',
    component: ApiKeyComponent,
    title: 'Home page'
  },

];

export default routeConfig;
