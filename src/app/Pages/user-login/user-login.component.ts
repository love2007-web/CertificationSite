import { Component } from '@angular/core';
import { SignupService } from '../../Services/signup.service';
import { MessageService, MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {
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
      Email: this.Email,
      Password: this.Password,
    };
    console.log(data);

    this.signUp.organizationLogin(data).subscribe(
      (response: any) => {
        console.log(response);
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: response.message });
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Login Failed', detail: error.error.message});
      }
    );
  }
  showPassword: boolean = false;

  show() {
    this.showPassword = !this.showPassword;
  }
}
