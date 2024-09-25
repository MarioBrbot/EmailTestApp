import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EmailService {
  private apiUrl = 'http://localhost:30829/api/email';

  constructor(private http: HttpClient) {}

  sendEmail(emailData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, emailData);
  }

  getEmailHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/history`);
  }
}
