import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-page-not-found',
  templateUrl: 'page-not-found.component.pug',
  styleUrls: ['page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }

}