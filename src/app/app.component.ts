/**
 * App component
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TimelineComponent } from './timeline/timeline.component';

@Component({
  selector: 't-root',
  templateUrl: `app.component.html`,
  styleUrls: ['app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit {
  @ViewChild('timeline') public timeline: TimelineComponent;

  public startYear = -722;
  public endYear = -468;
  public currentYear: number;

  public ngAfterViewInit() {
    setTimeout(() => this.timeline.markYear(this.startYear));
  }

  /**
   * View text of some year
   */
  public viewByYear(year: number) {
    this.currentYear = year;
  }
}
