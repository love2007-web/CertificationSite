import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupService } from '../../Services/signup.service';
import { MessageService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrl: './user-signup.component.css',
})
export class UserSignupComponent {
  public FirstName = '';
  public LastName = '';
  public Email = '';
  public Password = '';
  public ConfirmPassword = '';
  public isLoading = false;
  constructor(private signUp: SignupService, private messageService: MessageService) {}

  submitFrom() {
    this.isLoading = true;
    let data = {
      FirstName: this.FirstName,
      LastName: this.LastName,
      Email: this.Email,
      Password: this.Password,
      ConfirmPassword: this.ConfirmPassword,
    };
    console.log(data);

    this.signUp.postData(data).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log(response);
        this.messageService.add({ severity: 'success', summary: 'Sign Up Successful', detail: response.message });
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Sign Up Failed', detail: error.error.message});
      }
    );
  }
}
