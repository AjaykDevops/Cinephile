import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private apiKey = 'aba9fd7a193bf1ac59b84cb6925311c1';
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) {}

  // Step 1: Get new request token
  getRequestToken(): Observable<{ request_token: string }> {
    return this.http.get<{ request_token: string }>(
      `${this.apiUrl}/authentication/token/new?api_key=${this.apiKey}`
    );
  }

  // Step 3: Create session with approved request token
  createSession(requestToken: string): Observable<{ session_id: string }> {
    return this.http.post<{ session_id: string }>(
      `${this.apiUrl}/authentication/session/new?api_key=${this.apiKey}`,
      { request_token: requestToken }
    );
  }
}
