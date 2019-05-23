/**
 * 詩經
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { shijing } from '../../data/shijing';
import { sounds } from '../../data/sounds';
import { IPoem } from '../../interfaces/i-poem';

@Component({
  selector: 't-shi-jing',
  templateUrl: './shi-jing.component.html',
  styleUrls: ['./shi-jing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiJingComponent {
  public textWithSound = this.addText(shijing);

  private addText(text: IPoem[]): IPoem[] {
    return text.map(poem => {
      return {
        ...poem,
        content: poem.content.map(paragraph => {
          return paragraph
            .split('')
            .map(char => {
              const sound = sounds.find(item => item.char === char);

              if (sound) {
                return `<span class="char"><ruby>${char}<rt>${sound.sound}</rt></ruby></span>`;
              } else {
                return char;
              }
            })
            .join('');
        })
      };
    });
  }
}
