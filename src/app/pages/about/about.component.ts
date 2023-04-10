import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  q1 = false;
  q2 = false;
  q3 = false;
  q4 = false;

  displayQ1(): void {
    this.q1 = !this.q1;
    this.q2 = false;
    this.q3 = false;
    this.q4 = false;
  }

  displayQ2(): void {
    this.q2 = !this.q2;
    this.q1 = false;
    this.q3 = false;
    this.q4 = false;
  }

  displayQ3(): void {
    this.q3 = !this.q3;
    this.q1 = false;
    this.q2 = false;
    this.q4 = false;
  }

  displayQ4(): void {
    this.q4 = !this.q4;
    this.q1 = false;
    this.q2 = false;
    this.q3 = false;
  }
}
