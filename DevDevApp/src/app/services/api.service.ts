import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const headerDict = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'X-User-Id': 'user-id',
  'Access-Control-Allow-Origin': '*'
};

const requestOptions = {                                                                                                                                                                                 
  headers: new HttpHeaders(headerDict), 
};

@Injectable({
  providedIn: 'root'
})  
export class ApiService {
  private apiUrl = 'httpS://localhost:44388/api/ApiKey';


 
  constructor(private http: HttpClient) {}

   // Create an API key
   createApiKey(permissions: string[]): Observable<any> {
    const request = { permissions };
    return this.http.post(`${this.apiUrl}/`, request, requestOptions );
  }

  // Authenticate with API key to generate JWT token
  authenticate(apiKey: string): Observable<any> {
    const request =  JSON.stringify(apiKey) ;  
    return this.http.post(`${this.apiUrl}/authenticate`, request, {
      headers: { 'Content-Type': 'application/json;' },
      responseType: 'json'
    });
}

  // Revoke an API key by ID
  revokeApiKey(apiKeyId: string): Observable<any> {
    var id = encodeURIComponent(apiKeyId);
    return this.http.delete(`${this.apiUrl}/${id}`, requestOptions);
  }

  // Get all tokens of the user
  getTokens(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`, requestOptions);
  }

}
