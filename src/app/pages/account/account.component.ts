import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

import { animation } from '@app/animation/animation-custom'

@Component({
  selector: 'app-account',
  templateUrl: 'account.component.pug',
  styleUrls: ['account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animation.heightExpand],
})
export class AccountComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }
}
