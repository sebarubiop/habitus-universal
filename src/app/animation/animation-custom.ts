import { animate, state, style, transition, trigger } from '@angular/animations'

export const animation = {
  slideInDownFade: trigger('slideInDownFade', [
    state('void', style({ opacity: 0, transform: 'translateY(-20px)' })),
    state('*', style({ opacity: 1, transform: 'translateY(0)' })),
    transition('void => *', animate('0.2s ease-in')),
    transition('* => void', animate('0.2s ease-in')),
  ]),
  slideInLeftFade: trigger('slideInLeftFade', [
    state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),
    state('*', style({ opacity: 1, transform: 'translateX(0)' })),
    transition('void => *', animate('0.2s ease-in')),
    transition('* => void', animate('0.2s ease-in')),
  ]),
  widthExpand: trigger('widthExpand', [
    state('void', style({ opacity: 0, width: 0 })),
    state('*', style({ opacity: 1, width: '*' })),
    transition('void => *', animate('0.2s ease-in')),
    transition('* => void', animate('0.2s ease-in')),
  ]),
  heightExpand: trigger('heightExpand', [
    state('void', style({ height: 0, opacity: 0, overflow: 'hidden' })),
    state('*', style({ height: '*', opacity: 1, overflow: 'hidden' })),
    transition('void => *', animate('0.2s ease-in')),
    transition('* => void', animate('0.2s ease-in')),
  ]),
  fade: trigger('fade', [
    state('void', style({ opacity: 0})),
    state('*', style({ opacity: 1})),
    transition('void => *', animate('0.2s ease-in')),
    transition('* => void', animate('0.2s ease-in')),
  ]),
  zoom: trigger('zoom', [
    state('void', style({ opacity: 0, transform: 'scale(0)' })),
    state('*', style({ opacity: 1, transform: 'scale(1)' })),
    transition('void => *', animate('0.2s cubic-bezier(.31,.68,.59,1.23)')),
    transition('* => void', animate('0.2s cubic-bezier(.47,-0.37,.67,.24)', style({
      opacity: 0,
      transform: 'scale(0)',
      position: 'absolute',
    }))),
  ]),
}
