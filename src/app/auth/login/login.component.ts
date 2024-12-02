import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(contorl: AbstractControl){
  if(contorl.value.includes('?')){
    return null;
  }

  return { doesNotContainQuestionMark: true };
}

function emailIsUnique(control: AbstractControl){
  if (control.value !== 'test@example.com'){
    return of(null)
  }
  return of({ notUnique: true});
}

let initialEmailValue ='';
const saveForm = window.localStorage.getItem( 'save-login-form');
if(saveForm){
    const loadedForm = JSON.parse(saveForm);
    initialEmailValue = loadedForm.email
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  private destroyRef = inject(DestroyRef)
  ngOnInit(): void {
    // const saveForm = window.localStorage.getItem( 'save-login-form');
    // if(saveForm){
    //   const loadedForm = JSON.parse(saveForm);
    //   this.form.patchValue({
    //     email: loadedForm.email
    //   }) 
    // }
    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: value => {
        window.localStorage.setItem(
          'save-login-form', 
          JSON.stringify({ email: value.email }          
          )
        );
      }
    });

   this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
  form = new FormGroup({
    email: new FormControl(initialEmailValue,{
      validators: [ Validators.email, Validators.required],
      asyncValidators: [emailIsUnique]
    }),
    password: new FormControl('',{
      validators: [ Validators.required, Validators.minLength(6), mustContainQuestionMark]      
    }),
  });

  get emailIsInvalid(){
    return (
      this.form.controls.email.touched && 
      this.form.controls.email.dirty && 
      this.form.controls.email.invalid);
  }
  get passwordIsInvalid(){
    return (
      this.form.controls.password.touched && 
      this.form.controls.password.dirty && 
      this.form.controls.password.invalid);
  }
  onSubmit(){
    console.log('myForm', this.form);
    const enteredEmail =  this.form.value.email;
    const enteredPassword =  this.form.value.password;
    console.log(enteredPassword,enteredEmail);
    
  }
}