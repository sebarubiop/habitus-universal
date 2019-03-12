import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { AccountComponent } from '@app/pages/account/account.component'
import { DashboardComponent } from '@app/pages/account/dashboard/dashboard.component'
import { ProfileComponent } from '@app/pages/account/profile/profile.component'
import { AuthGuard } from '@app/services/guards/auth.guard'

const routes: Routes = [
  { path: '', redirectTo: '/app/dashboard', pathMatch: 'full' },
  {
    path: '',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'profile', component: ProfileComponent },
    ],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule { }

export const routedComponents = [ 
    AccountComponent,
    DashboardComponent,
    ProfileComponent, 
]