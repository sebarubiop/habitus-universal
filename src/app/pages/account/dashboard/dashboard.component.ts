import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

import { animation } from '@app/animation/animation-custom'

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.pug',
  styleUrls: ['dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animation.heightExpand],
})
export class DashboardComponent implements OnInit {

  title = 'Hello, world!'

  constructor(
  ) { }

  ngOnInit() {
  }
}
