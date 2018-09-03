import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { XhrFactory } from '@angular/common/http/src/xhr';
// import { error } from '@angular/compiler/src/util';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
import { Console } from '@angular/core/src/console';
import { Subscription } from 'rxjs/';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';


const input = new QueueingSubject<string>();
const msg = JSON.stringify({
  event: 'subscribe',
  channel: 'candles',
  key: 'trade:1m:tBTCUSD'
});
@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class GraphComponent implements OnInit {

  sub: Subscription;
  // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:member-ordering

  tickers$: Object;
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  source: any =
  {
      datatype: 'tsv',
      datafields: [
          { name: 'Date' },
          { name: 'SPOpen' },
          { name: 'SPHigh' },
          { name: 'SPLow' },
          { name: 'SPClose' },
          { name: 'SPVolume' },
          { name: 'SPAdjClose' }
      ],
      url: this.tickers$
  };
  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    }

    return 850;
  }
  // tslint:disable-next-line:member-ordering
  dataAdapter = new jqx.dataAdapter(this.source, {async: false, autoBind: true, loadError: (xhr: any, status: any, error: any) => {
    alert('Error loading "' + this.source.url + '" : ' + error);
    console.log(this.source);
  }});
  toolTipCustomFormatFn = (value: any, itemIndex: any, serie: any, group: any, categoryValue: any, categoryAxis: any) => {
      const dataItem = this.dataAdapter.records[itemIndex];
      const volume = dataItem.SPVolume;
      return '<DIV style="text-align:left"><b>Date: ' +
          categoryValue.getDate() + '-' + this.months[categoryValue.getMonth()] + '-' + categoryValue.getFullYear() +
          '</b><br />Open price: $' + value.open +
          '</b><br />Close price: $' + value.close +
          '</b><br />Low price: $' + value.low +
          '</b><br />High price: $' + value.high +
          '</b><br />Daily volume: ' + volume +
      '</DIV>';
  }
  // tslint:disable-next-line:member-ordering
  padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
  // tslint:disable-next-line:member-ordering
  xAxis: any =
  {
      dataField: 'Date',
      labels: {
          formatFunction: (value) => {
              return value.getDate() + '-' + this.months[value.getMonth()] + '\'' + value.getFullYear().toString().substring(2);
          }
      },
      type: 'date',
      valuesOnTicks: true,
      minValue: new Date(2014, 1, 1),
      maxValue: new Date(2014, 10, 1),
      rangeSelector: {
          padding: { left: 25, right: 10, top: 10, bottom: 10 },
          backgroundColor: 'white',
          dataField: 'SPClose',
          baseUnit: 'month',
          serieType: 'area',
          gridLines: { visible: false },
          labels:
          {
              formatFunction: (value: any) => {
                  return this.months[value.getMonth()] + '\'' + value.getFullYear().toString().substring(2);
              }
          }
      }
  };
  // tslint:disable-next-line:member-ordering
  seriesGroups: any[] =
  [
      {
          type: 'candlestick',
          columnsMaxWidth: 15,
          columnsMinWidth: 5,
          toolTipFormatFunction: this.toolTipCustomFormatFn,
          valueAxis:
          {
              description: 'S&P 500<br>'
          },
          series: [
              {
                  dataFieldClose: 'SPClose',
                  displayTextClose: 'S&P Close price',
                  dataFieldOpen: 'SPOpen',
                  displayTextOpen: 'S&P Open price',
                  dataFieldHigh: 'SPHigh',
                  displayTextHigh: 'S&P High price',
                  dataFieldLow: 'SPLow',
                  displayTextLow: 'S&P Low price',
                  displayText: 'S&P 500',
                  lineWidth: 1
              }
          ]
      },
      {
          type: 'line',
          valueAxis:
          {
              position: 'right',
              title: { text: '<br>Daily Volume' },
              gridLines: { visible: false },
              labels: {
                  formatFunction: (value: string) => {
                      return (+value / 1000000) + 'M';
                  }
              }
          },
          series: [
              {
                  dataField: 'SPVolume',
                  displayText: 'Volume',
                  lineWidth: 1
              }
          ]
      }
  ];

  // tslint:disable-next-line:member-ordering
  constructor(private data: DataService) { }
  ngOnInit(): void {
      // let payload = msg;
      const { messages, connectionStatus } = websocketConnect('wss://api.bitfinex.com/ws/2', input);
      input.next(msg);

      const connectionStatusSubscription = connectionStatus.subscribe(numberConnected => {
        console.log('number of connected websockets:', numberConnected);
      });

      const messagesSubscription = messages.subscribe((message: string) => {
        console.log('received message:', message);
        this.tickers$ = message;
      });


  }
}



