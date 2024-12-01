import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiKeyComponent } from './api-key/api-key.component';
import { TokenManagementComponent } from './token-management/token-management.component';

@NgModule({
  declarations: [
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ApiKeyComponent,
    TokenManagementComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule {}
