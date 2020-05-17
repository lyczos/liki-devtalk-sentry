import { Component, OnInit } from '@angular/core';

const initialListOfContent: DevTalk[] = [
  { author: 'Krzysztof Wyrzykowski', topic: 'CSS Grid' },
  { author: 'Marcin Skrzyński', topic: 'Optymalizacja aplikacji na nowoczesne przeglądarki' },
  { author: 'Michał Łyczko', topic: ' RxJS wprowadzenie do programowania reaktywnego' },
  { author: 'Tomasz Krajewski', topic: 'GIT' },
  { author: 'Adriań Wolański', topic: 'Electron Forge - aplikacje desktopowe' },
  {
    author: 'Monika Opawska',
    topic: 'Accessibility - strony dostępne dla wszystkich',
  },
  { author: 'Szymon Lisiecki', topic: 'CI/CD' },
  { author: 'Kinga Kaczyńska', topic: 'Design system - znaczenie i zalety w projekcie' },
  {
    author: 'Marcin Skrzyński',
    topic: 'Przyszłość CSS. Czy niskopoziomowy CSS zrewolucjonizuje tworzenie interfejsów?',
  },
  { author: 'Tomasz Madej', topic: 'Optimizing loading time for react apps' },
  { author: 'Patryk Kluczak', topic: 'Fancy development using Pixi' },
  { author: 'Cezary Lewczuk', topic: 'Design Thinking' },
  { author: 'Michał Łyczko', topic: 'Errors reporting tools in FE Apps + CI/CD' },
];
type DevTalk = {
  author: string;
  topic: string;
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'liki-devtalk-sentry';
  listOfContent: DevTalk[];
  listOfContentRecent: DevTalk[];
  errorMode = false;

  ngOnInit() {
    this.listOfContent = this.listOfContentRecent = [...initialListOfContent];
  }
  refreshList() {
    const devTalk: DevTalk = {
      author: 'Adrian Wolański',
      topic: '[AMA] Programista na bezrobociu',
    };
    if (this.errorMode) {
      this.listOfContentRecent = [...this.listOfContent];
      // @ts-ignore
      this.listOfContent = {
        ...this.listOfContent,
        ...devTalk,
      };
      return;
    }

    devTalk.topic += ` - część ${this.listOfContent.length - initialListOfContent.length + 1}`;
    this.listOfContent = [...this.listOfContent, devTalk];
  }

  clearList() {
    if (this.errorMode) {
      this.assignUndefined(); // let's do smth stupid by mistake...
      return;
    }
    this.listOfContent = [...initialListOfContent];

    if (this.listOfContent.length) {
      alert('Done.');
    }
  }

  toggleErrorMode() {
    if (this.errorMode) {
      this.listOfContent = [...this.listOfContentRecent];
    }
    this.errorMode = !this.errorMode;
  }

  assignUndefined() {
    this.listOfContent = undefined;
  }

  throwError() {
    throw Error('New awesome error!');
  }
}
