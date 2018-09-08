import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
// import {GraphComponent} from '../graph/graph.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('listStagger', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger(
              '50ms',
              animate(
                '550ms ease-out',
                style({ opacity: 1, transform: 'translateY(0px)' })
              )
            )
          ],
          { optional: true }
        ),
        query(':leave', animate('50ms', style({ opacity: 0 })), {
          optional: true
        })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  color  = 'red';
  values: number[] = [102, 115, 130, 137];
  tickers$: Object;
  colour$: Object;
  constructor(private data: DataService) { }

  ngOnInit() {
    this.colour$ = 'off';
    // this.data.getTickers().subscribe(
    //     data => this.tickers$ = data
    // );
    // console.log(this.data);
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    const timer = setInterval(() => {
      if (navigator.onLine) {
        this.color = 'green';
        this.colour$ = 'on';
        // Has connection, go do something
      } else {
        this.color = 'red';
        this.colour$ = 'off';
      }


      }, 1000);
  }

}
