import { Component, OnInit } from '@angular/core';
import { EmailService } from '../../services/email.service';
import { Router } from '@angular/router';

interface Email {
  id: number;
  fromEmailAddress: string;
  toEmailAddress: string;
  ccEmailAddresses: string;
  subject: string;
  importance: string;
  emailContent: string;
  sentDate: string;
}

@Component({
  selector: 'app-email-history',
  templateUrl: './email-history.component.html',
  styleUrls: ['./email-history.component.css']
})
export class EmailHistoryComponent implements OnInit {
  emails: Email[] = [];

  constructor(private emailService: EmailService,
    private router: Router) {}

  ngOnInit(): void {
    this.emailService.getEmailHistory().subscribe({
      next: (data) => {
        this.emails = data as Email[];
      },
      error: (err) => {
        console.error('Error fetching email history', err);
      }
    });
  }
}
