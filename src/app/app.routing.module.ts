import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { NavigationComponent} from './navigation/navigation.component';
import { FormsModule } from '@angular/forms';
import {SlideMenuModule} from 'primeng/slidemenu';
import {ButtonModule} from 'primeng/button';

@NgModule({
  declarations: [ 
    NavigationComponent
  ],
  imports: [
    RouterModule.forRoot([
      { path: 'navigation/:afdeling', component: NavigationComponent },
      { path: '**', redirectTo: 'navigation/DMO' }
    ]),
    FormsModule, SlideMenuModule, ButtonModule
  ],
  exports: [
    RouterModule
  ],
  providers: [],

})
export class AppRoutingModule {}