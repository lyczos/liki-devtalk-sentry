import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'liki-devtalk-sentry';
  listOfContent: string[];

  ngOnInit() {
    this.listOfContent = ['DevTalk #1', 'DevTalk #2', 'DevTalk #3'];
  }

  refreshList() {
    // @ts-ignore
    this.listOfContent = 'DevTalk #1';
  }

  clearList() {
    this.listOfContent = [];
    this.assignNull(); // let's do smth stupid by mistake
    if (this.listOfContent.length) {
      alert('Yay!, no error.');
    }
  }

  assignNull() {
    this.listOfContent = null;
  }
}
