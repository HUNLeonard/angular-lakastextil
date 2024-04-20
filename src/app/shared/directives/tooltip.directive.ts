import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() appTooltip?: string;
  private tooltipElement?: HTMLElement;

  constructor(private elementRef: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.showTooltip();
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.classList.add('tooltip');
    if (this.appTooltip !== undefined) {
      this.tooltipElement.textContent = this.appTooltip;
    }
    this.elementRef.nativeElement.appendChild(this.tooltipElement);
  }

  private hideTooltip() {
    if (this.tooltipElement) {
      this.elementRef.nativeElement.removeChild(this.tooltipElement);
    }
  }
}