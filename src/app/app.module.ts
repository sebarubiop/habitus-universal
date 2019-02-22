import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {TransferHttpCacheModule} from '@nguniversal/common';
import { HttpClientModule } from '@angular/common/http';

import {AppComponent} from './app.component';
import { appRoutes, routedComponents } from './app-routing.module'
import { FooterComponent } from '@app/components/footer/footer.component'

const components = [
  FooterComponent,
]

@NgModule({
  declarations: [
    AppComponent,
    routedComponents,
    components,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TransferHttpCacheModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
