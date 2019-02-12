import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'

import { AccountRoutingModule, routedComponents } from '@app/pages/account/account-routing.module'
import { NavbarComponent } from '@app/components/navbar/navbar.component'
import { NavbarMenuComponent } from '@app/components/navbar-menu/navbar-menu.component'
import { ResizeObserverDirective } from '@app/directive/resize-observer/resize-observer.directive'

const components = [
    NavbarComponent,
    NavbarMenuComponent,
    ResizeObserverDirective,
  ]

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    AccountRoutingModule,
  ],
  declarations: [
    routedComponents,
    components,
  ],
  exports: [
    components,
  ],
  schemas:[]
})
export class AccountModule { }
