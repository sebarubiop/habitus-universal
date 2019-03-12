import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

import { animation } from '@app/animation/animation-custom'
import { AuthenticationService } from '@app/services/authentication.service'

@Component({
  selector: 'app-navbar-menu',
  templateUrl: 'navbar-menu.component.pug',
  styleUrls: ['navbar-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animation.heightExpand],
})
export class NavbarMenuComponent implements OnInit {

  constructor(
    public authService: AuthenticationService,
  ) { }

  ngOnInit() {
  }
}
