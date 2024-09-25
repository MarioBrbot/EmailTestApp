import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent {
  emailForm: FormGroup;
  importanceOptions = ['Low', 'Normal', 'High'];

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private router: Router
  ) {
    this.emailForm = this.fb.group({
      fromEmailAddress: ['', [Validators.required, Validators.email]],
      toEmailAddress: ['', [Validators.required, Validators.email]],
      ccEmailAddresses: [''],
      subject: ['', Validators.required],
      importance: ['Normal', Validators.required],
      emailContent: ['', Validators.required]
    });
  }

  send(): void {
    if (this.emailForm.valid) {
      this.emailService.sendEmail(this.emailForm.value).subscribe({
        next: () => {
          alert('Email sent successfully');
          this.emailForm.reset();
        },
        error: (err) => {
          alert('Error sending email: ' + err.message);
        }
      });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel?')) {
      this.emailForm.reset();
      this.router.navigate(['history']);
    }

  }



}



