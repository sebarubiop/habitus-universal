import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.pug',
  styleUrls: ['login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {

  form: FormGroup

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 
    this.createForm()
  }

  ngOnInit() {
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

  onLoginSubmit() {
    this.router.navigate(['/app'])
  }

}