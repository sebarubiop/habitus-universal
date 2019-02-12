import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

import { animation } from '@app/animation/animation-custom'

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.pug',
  styleUrls: ['profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animation.heightExpand],
})
export class ProfileComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }
}
