/**
 * 左傳
 */

import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { TimelineComponent } from '../../timeline/timeline.component';

@Component({
  selector: 't-zuo-zhuan',
  templateUrl: './zuo-zhuan.component.html',
  styleUrls: ['./zuo-zhuan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZuoZhuanComponent implements AfterViewInit {
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
