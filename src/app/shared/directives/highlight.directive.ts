import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight?: string;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.highlight(this.appHighlight || '');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {
    this.elementRef.nativeElement.style.backgroundColor = color;
  }
}