/**
 * Timeline
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { TooltipService } from '@signify/interact-ui';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { allRulers } from '../data/rulers';
import { IRuler } from '../interfaces/i-ruler';

@Component({
  selector: 't-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent implements OnChanges {
  @Input() public startYear: number;
  @Input() public endYear: number;

  @Output() public setYear: EventEmitter<number> = new EventEmitter<number>();

  public axisLabelYears: Array<{ yearText: string; percent: number }> = [];
  public currentDate$: BehaviorSubject<{
    yearText: string;
    percent: number;
    year: number;
  }> = new BehaviorSubject(null);

  public rulersByState: Map<string, IRuler[]> = new Map<string, IRuler[]>();
  public states: string[] = [];
  public selectedStates: string[] = ['魯'];

  private axisYearInterval = 25;

  constructor(private el: ElementRef<HTMLElement>, private tooltip: TooltipService) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.startYear || changes.endYear) {
      this.createAxis();
      this.parseRulers(allRulers);
    }
  }

  /**
   * Percentage on the axis
   */
  public getYearPercent(year: number): number {
    const percent: number = ((year - this.startYear) / (this.endYear - this.startYear)) * 100;

    return Math.max(Math.min(percent, 100), 0);
  }

  /**
   * Hide tooltip
   */
  public hideYearTooltip() {
    this.tooltip.destroyTooltip();
  }

  /**
   * Ruler in current year
   */
  public isCurrentRuler(ruler: IRuler, currentYear: number): boolean {
    return currentYear && ruler && ruler.reignStart <= currentYear && ruler.reignEnd >= currentYear;
  }

  /**
   * Show marker of current year
   */
  public markYear(year: number) {
    this.currentDate$.next({
      yearText: `前${-year}`,
      percent: this.getYearPercent(year),
      year
    });
  }

  /**
   * Emit event
   */
  public setCurrentYear() {
    this.currentDate$.pipe(first()).subscribe(currentDate => {
      if (currentDate && currentDate.year) {
        this.setYear.emit(currentDate.year);
      }
    });

    this.hideYearTooltip();
  }

  /**
   * Show tooltip of hovered year
   */
  public showYearTooltip($event: Touch) {
    if (!this.startYear || !this.endYear) {
      return;
    }

    const x = $event.pageX;
    const percentX = x / this.el.nativeElement.offsetWidth;
    const year = Math.floor(this.startYear + (this.endYear - this.startYear) * percentX);
    const yearText = `前${-year}`;

    this.currentDate$.next({
      yearText,
      percent: percentX * 100,
      year
    });

    this.tooltip.destroyTooltip();

    this.tooltip.showTooltip({
      x,
      y: this.el.nativeElement.getBoundingClientRect().top,
      message: yearText
    });
  }

  /**
   * Touch devices
   */
  public showYearTooltipTouch($event: TouchEvent) {
    this.showYearTooltip($event.touches[0]);
  }

  /**
   * Create axis for hundred years
   */
  private createAxis() {
    if (!this.startYear || !this.endYear) {
      return;
    }

    const axisStartYear = Math.ceil(this.startYear / this.axisYearInterval) * this.axisYearInterval;
    const axisEndYear = Math.ceil(this.endYear / this.axisYearInterval) * this.axisYearInterval;

    this.axisLabelYears = new Array((axisEndYear - axisStartYear) / this.axisYearInterval)
      .fill(axisStartYear)
      .map((start, i) => {
        const year = start + i * this.axisYearInterval;
        const percent = this.getYearPercent(year);

        return {
          yearText: `前${-year}`,
          percent
        };
      });
  }

  /**
   * Group rulers by states
   */
  private parseRulers(rulers: IRuler[]) {
    rulers
      .filter(ruler => {
        return (
          ruler.reignStart && ruler.reignStart <= this.endYear && ruler.reignEnd && ruler.reignEnd >= this.startYear
        );
      })
      .forEach((ruler: IRuler) => {
        if (this.rulersByState.get(ruler.state)) {
          this.rulersByState.get(ruler.state).push(ruler);
        } else {
          this.rulersByState.set(ruler.state, [ruler]);
        }
      });

    this.states = Array.from(this.rulersByState.keys());
  }
}
