import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.pug',
  styleUrls: ['footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }
}
