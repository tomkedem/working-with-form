import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  form = new FormGroup({
    email: new FormControl('',{
      validators: [ Validators.email, Validators.required]
    }),
    password: new FormControl('',{
      validators: [ Validators.required, Validators.minLength(6)]      
    }),
  });
  onSubmit(){
    console.log('myForm', this.form);
    const enteredEmail =  this.form.value.email;
    const enteredPassword =  this.form.value.password;
    console.log(enteredPassword + ',' ,enteredEmail);
    
  }
  onReset(){
    this.form.reset();
  }
}
