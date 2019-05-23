/**
 * Text component
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { allRulers } from '../data/rulers';
import { paragraphs } from '../data/zuozhuan';
import { IParagraph } from '../interfaces/i-paragraph';
import { IRuler } from '../interfaces/i-ruler';

@Component({
  selector: 't-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent implements OnChanges {
  @Input() public currentYear: number;
  @Input() public startYear: number;
  @Input() public endYear: number;

  @Output() public selectYear: EventEmitter<number> = new EventEmitter<number>();

  @HostBinding('class.xiaozhuan') public useXiaozhuan = false;

  public rulers: IRuler[] = [];

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.startYear || changes.endYear) {
      this.rulers = allRulers.filter(
        r => r.state === '魯' && r.reignEnd >= this.startYear && r.reignStart <= this.endYear
      );
    }

    if (changes.currentYear) {
      this.scrollToYear(this.currentYear);
    }
  }

  /**
   * Scrolling event
   */
  @HostListener('scroll')
  public scrollContainer() {
    const yearElements = Array.from(document.querySelectorAll('h3'));
    const firstYearElementInView = yearElements.find(el => {
      return el.getBoundingClientRect().top > 0;
    });

    if (!firstYearElementInView) {
      return;
    }

    this.selectYear.emit(+firstYearElementInView.dataset.year);
  }

  /**
   * Fetch original text
   */
  public fetchTextByRuler(ruler: IRuler): IParagraph[] {
    const groupedByRuler = paragraphs.filter((paragraph: IParagraph) => {
      return paragraph.year.startsWith(ruler.title.slice(1));
    });

    groupedByRuler.forEach((paragraph: IParagraph, index: number) => {
      paragraph.yearNumber = ruler.reignStart + index;
      paragraph.jing = this.parseTextMarks(paragraph.jing);
      paragraph.zhuan = this.parseTextMarks(paragraph.zhuan);
    });

    return groupedByRuler;
  }

  /**
   * Add pinyin markers
   */
  private parseTextMarks(originalText: string): string {
    return originalText
      .replace(
        /\[([^|]+)\|([^\]]+)\]/g,
        `<div class="word"><span class="word-char">$1</span><span class="word-explanation">$2</span></div>`
      )
      .replace(/(.)\(([^)]+)\)/g, `<ruby>$1<rt>$2</rt></ruby>`);
  }

  /**
   * Scroll to certain year
   */
  private scrollToYear(year: number) {
    if (!year) {
      return;
    }

    const item = document.getElementById(`year-${year}`);

    if (!item) {
      return;
    }

    item.scrollIntoView();
  }
}
