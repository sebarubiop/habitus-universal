import { Directive, ElementRef, EventEmitter, NgZone, OnInit, Output } from '@angular/core'
import ResizeObserver from 'resize-observer-polyfill'

@Directive({ selector: '[resizeObserver]' })
export class ResizeObserverDirective implements OnInit {

    ro: ResizeObserver
    @Output() resize = new EventEmitter()

    constructor(private zone: NgZone, private el: ElementRef<HTMLElement>) { }

    ngOnInit() {
        this.ro = new ResizeObserver(() => {
            this.zone.run(() => {
                this.resize.emit(this.el.nativeElement)
            })
        })
        this.ro.observe(this.el.nativeElement)
    }
}
