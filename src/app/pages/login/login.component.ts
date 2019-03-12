import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { AuthenticationService } from '@app/services/authentication.service'
import { AuthGuard } from '@app/services/guards/auth.guard'
import { User } from '@app/model/user'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.pug',
  styleUrls: ['login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  form: FormGroup
  message
  messageClass
  processing = false
  previousUrl
  isError

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private authGuard: AuthGuard,
  ) { 
    this.createForm()
  }

  ngOnInit() {
    // On page load, check if user was redirected to login
    if (this.authGuard.redirectUrl) {
      this.messageClass = 'alert alert-danger' // Set error message: need to login
      this.message = 'Tienes que acceder a tu cuenta para ver esa página.' // Set message
      this.previousUrl = this.authGuard.redirectUrl // Set the previous URL user was redirected from
      this.authGuard.redirectUrl = undefined // Erase previous URL
    }
  }

  createForm() {
    this.form = this.formBuilder.group({
      // Email Input
      emailCtrl: ['',
        [Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(35), // Maximum length is 30 characters
        // this.validateEmail // Custom validation
        ]],
      // Password Input
      passwordCtrl: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(35), // Maximum length is 35 characters
        // this.validatePassword // Custom validation
      ])]
    })
  }

  // Function to disable the registration form
  disableForm() {
    this.form.controls['emailCtrl'].disable()
    this.form.controls['passwordCtrl'].disable()
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['emailCtrl'].enable()
    this.form.controls['passwordCtrl'].enable()
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

  // Function to submit form
  async onLoginSubmit() {
    // Create user object form user's inputs
    const user = {
      email: this.form.get('emailCtrl').value, // E-mail input field
      password: this.form.get('passwordCtrl').value // Password input field
    }
    this.onLoginUser(user)
  }

  private async onLoginUser(user: User) {
    this.processing = true // Used to notify HTML that form is in processing, so that it can be disabled
    this.disableForm() // Disable the form
    try {
      // Function from authentication service to register user
      const data = await this.authService.loginUser(user).toPromise()
      // Resposne from registration attempt
      if (!data.success) {
        this.messageClass = 'alert alert-danger' // Set an error class
        this.message = data.message // Set an error message
        this.processing = false // Re-enable submit button
        this.enableForm() // Re-enable form
      } else {
        this.messageClass = 'alert alert-success' // Set a success class
        this.message = data.message // Set a success message
        // Function to store user's token in client local storage
        this.authService.storeUserData(data.value, data.token)
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          // Check if user was redirected or logging in for first time
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]) // Redirect to page they were trying to view before
          } else {
            this.router.navigate(['/app'])
          }
        }, 1000)
      }
    } catch (error) {
      // console.log(error)
      this.isError = true
      this.messageClass = 'alert alert-danger'
      this.message = 'Perdón, estamos experimentando algunos problemas. Intentelo más tarde.'
    }
    this.cdr.markForCheck()
  }


}