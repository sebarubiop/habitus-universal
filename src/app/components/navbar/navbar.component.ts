import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

import { animation } from '@app/animation/animation-custom'
import { AuthenticationService } from '@app/services/authentication.service'

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.pug',
  styleUrls: ['navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animation.heightExpand],
})
export class NavbarComponent implements OnInit {

  openNavMenu = false
  sizeNav: boolean

  constructor(
    public authService: AuthenticationService,
  ) { }

  ngOnInit() {
  }

  onNavMenu() {
    this.openNavMenu = !this.openNavMenu
  }
  
  onResize(e: HTMLElement) {
    this.sizeNav = e.clientWidth > 991
    if(e.clientWidth > 991) {
      this.openNavMenu = false
    }
  }
}
