import { Routes } from '@angular/router'

import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component'
import { LoginComponent } from './pages/login/login.component'
import { RegisterComponent } from './pages/register/register.component'

export const appRoutes: Routes = [
    {
        path: '',
        loadChildren: './pages/account/account.module#AccountModule',
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent // Default Route
    },
    { path: '**', component: PageNotFoundComponent } // "Catch-All" Route
];

export const routedComponents = [
    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
]