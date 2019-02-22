import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core'

import { animation } from '@app/animation/animation-custom'
import { DataService } from '@app/services/dara.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.pug',
  styleUrls: ['dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animation.heightExpand],
})
export class DashboardComponent implements OnInit {

  title = 'Hello, world!'
  regionesComunas: any

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
  ) { }

  async ngOnInit() {
    try {
      this.regionesComunas = await this.dataService.getRegionesComunas().toPromise()
      console.log('regionesComunas',this.regionesComunas)
      this.cdr.markForCheck()
    } catch (error) {
      console.log(error)
    }
  }
}
