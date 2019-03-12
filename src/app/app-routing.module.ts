import { Routes } from '@angular/router'

import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component'
import { LoginComponent } from './pages/login/login.component'
import { RegisterComponent } from './pages/register/register.component'
import { HomeComponent } from './pages/home/home.component'
import { NotAuthGuard } from '@app/services/guards/notAuth.guard'

export const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'app',
        loadChildren: './pages/account/account.module#AccountModule',
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NotAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [NotAuthGuard]
    },
    { path: '**', component: PageNotFoundComponent } // "Catch-All" Route
];

export const routedComponents = [
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    HomeComponent,
]