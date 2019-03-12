import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { AuthenticationService } from '@app/services/authentication.service'

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.pug',
  styleUrls: ['register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit {

  form: FormGroup
  message
  messageClass
  processing = false
  emailValid
  emailMessage
  isError

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
  ) { 
    this.createForm()
  }

  ngOnInit() {
  }

  createForm() {
    this.form = this.formBuilder.group({
      nameCtrl: ['',
        [Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(35), // Maximum length is 30 characters
        // this.validateEmail // Custom validation
        ]],
      emailCtrl: ['',
        [Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(35), // Maximum length is 30 characters
        // this.validateEmail // Custom validation
        ]],
      passwordCtrl: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(35), // Maximum length is 35 characters
        // this.validatePassword // Custom validation
      ])],
      confirmPassCtrl: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(35), // Maximum length is 35 characters
        // this.validatePassword // Custom validation
      ])]
    })
  }

  // Function to disable the registration form
  disableForm() {
    this.form.controls['emailCtrl'].disable();
    this.form.controls['nameCtrl'].disable();
    this.form.controls['passwordCtrl'].disable();
    this.form.controls['confirmPassCtrl'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['emailCtrl'].enable();
    this.form.controls['nameCtrl'].enable();
    this.form.controls['passwordCtrl'].enable();
    this.form.controls['confirmPassCtrl'].enable();
  }

  // Function to validate e-mail is proper format
  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (controls.value) {
      if (regExp.test(controls.value)) {
        return null; // Return as valid email
      } else {
        return { 'validateEmail': true } // Return as invalid email
      }
    }
  }

  // Funciton to ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  // Function to check if e-mail is taken
  async checkEmail() {
    try {
      // Function from authentication file to check if e-mail is taken
      const data = await this.authService.checkEmail(this.form.get('emailCtrl').value).toPromise()
      // Check if success true or false was returned from API
      if (!data.success) {
        this.emailValid = false; // Return email as invalid
        this.emailMessage = data.message; // Return error message
      } else {
        this.emailValid = true; // Return email as valid
        this.emailMessage = data.message; // Return success message
      }
    } catch(error) {
      console.log(error)
      this.isError = true
      this.messageClass = 'alert alert-danger'
      this.message = 'Perdón, estamos experimentando algunos problemas. Intentelo más tarde.'
    }
    this.cdr.markForCheck()
    
  }

  // Function to submit form
  async onRegisterSubmit() {
    this.processing = true; // Used to notify HTML that form is in processing, so that it can be disabled
    this.disableForm(); // Disable the form
    // Create user object form user's inputs
    const user = {
      email: this.form.get('emailCtrl').value, // E-mail input field
      name: this.form.get('nameCtrl').value, // Username input field
      password: this.form.get('passwordCtrl').value // Password input field
    }
    try {
      // Function from authentication service to register user
      const data = await this.authService.registerUser(user).toPromise()
      // Resposne from registration attempt
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set an error class
        this.message = data.message; // Set an error message
        this.processing = false; // Re-enable submit button
        this.enableForm(); // Re-enable form
      } else {
        this.messageClass = 'alert alert-success'; // Set a success class
        this.message = data.message; // Set a success message
        
        // After 2 second timeout, navigate to the login page
        setTimeout(() => {
          this.router.navigate(['/login'])
        }, 2000);
      }
    } catch(error) {
      console.log(error)
      this.isError = true
      this.messageClass = 'alert alert-danger'
      this.message = 'Perdón, estamos experimentando algunos problemas. Intentelo más tarde.'
    }
    this.cdr.markForCheck()
  }


}