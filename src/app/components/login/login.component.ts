import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public hide = true;
  public loginForm!: FormGroup;
  public loginFlag: boolean = true;
  public userDetails = {
    username: "admin",
    password: "test"
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }
  public userLogin() {
    const {username, password} = this.loginForm.value;
    if(username === this.userDetails.username && password === this.userDetails.password ) {
      localStorage.setItem('userDetails','admin');
      this.loginFlag = true;
      this.router.navigate(['/home']);
    } else{
      this.loginFlag = false;
    }
   
  }

  private initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    })
  }
  public onFormReset() {
    this.loginForm.controls['username'].setValue('');
    this.loginForm.controls['password'].setValue('');
  }
}
