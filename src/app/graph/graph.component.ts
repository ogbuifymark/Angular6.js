import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { XhrFactory } from '@angular/common/http/src/xhr';
// import { error } from '@angular/compiler/src/util';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
import { Console } from '@angular/core/src/console';
import { Subscription } from 'rxjs/';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import { ViewChild } from '@angular/core';
// import { Socket } from 'dgram';


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
    months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    sub: Subscription;
    tickers$: any[] = [];
    sockets: any;
    @ViewChild('myChart') myChart: jqxChartComponent;

    constructor(private mysource: DataService) { }
    ngOnInit(): void {
        // let payload = msg;
        this.generateChartData();
    }

  getWidth(): any {
    if (document.body.offsetWidth < 850) {
        return '90%';
    }
    return 850;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngAfterViewInit(): void {
        const data = this.myChart.source();
        const { messages, connectionStatus } = websocketConnect('wss://api.bitfinex.com/ws/2', input);
        input.next(msg);

        const connectionStatusSubscription = connectionStatus.subscribe(numberConnected => {
        //   console.log('number of connected websockets:', numberConnected);
        });

        const messagesSubscription = messages.subscribe((message: string) => {
            this.sockets = JSON.parse(message);
            console.log(this.sockets);
            if (this.sockets instanceof Array) {
                if (this.sockets[1].length > 6) {
                    // tslint:disable-next-line:forin
                    for (const socket in this.sockets[1]) {
                        data.push({
                            date: new Date(socket[0]),
                            open: socket[1],
                            high: socket[3],
                            low: socket[4],
                            close: socket[2],
                            volume: socket[5]
                        });
                        localStorage.setItem('chartdata', data.push({
                            date: new Date(socket[0]),
                            open: socket[1],
                            high: socket[3],
                            low: socket[4],
                            close: socket[2],
                            volume: socket[5]
                        }));
                    }
                    this.myChart.update();
                  } else {
                    data.push({
                        date: new Date(this.sockets[0]),
                        open: this.sockets[1],
                        high: this.sockets[3],
                        low: this.sockets[4],
                        close: this.sockets[2],
                        volume: this.sockets[5]
                    });
                    localStorage.setItem('chartdata', data.push({
                        date: new Date(this.sockets[0]),
                        open: this.sockets[1],
                        high: this.sockets[3],
                        low: this.sockets[4],
                        close: this.sockets[2],
                        volume: this.sockets[5]
                    }));
                  }
            }
        });
    }

    toolTipCustomFormatFn = (value: any, itemIndex: any, serie: any, group: any, categoryValue: any, categoryAxis: any) => {
        const data = JSON.parse(localStorage.getItem('chartdata'));
        const dataItem = data.records[itemIndex];
        const volume = dataItem.volume;
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
    data: any[] = [];
    // tslint:disable-next-line:member-ordering
    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    // tslint:disable-next-line:member-ordering
    titlePadding: any = { left: 0, top: 0, right: 0, bottom: 10 };
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
            dataField: 'close',
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
    valueAxis: any =
    {
        minValue: 0,
        maxValue: 1000,
        title: { text: 'Index Value' },
        labels: { horizontalAlignment: 'right' }
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
                    dataFieldClose: 'close',
                    displayTextClose: 'Close price',
                    dataFieldOpen: 'open',
                    displayTextOpen: 'Open price',
                    dataFieldHigh: 'high',
                    displayTextHigh: 'High price',
                    dataFieldLow: 'low',
                    displayTextLow: 'Low price',
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
                        return (+(value) / 1000000) + 'M';
                    }
                }
            },
            series: [
                {
                    dataField: 'volume',
                    displayText: 'Volume',
                    lineWidth: 1
                }
            ]
        }
    ];

    // tslint:disable-next-line:member-ordering
    colorsSchemesList: string[] = ['scheme01', 'scheme02', 'scheme03', 'scheme04', 'scheme05', 'scheme06', 'scheme07', 'scheme08'];
    // tslint:disable-next-line:member-ordering
    seriesList: string[] = ['splinearea', 'spline', 'column', 'scatter', 'stackedcolumn', 'stackedsplinearea', 'stackedspline'];
    colorsOnChange(event: any): void {
        const value = event.args.item.value;
        this.myChart.colorScheme(value);
        this.myChart.update();
    }
    seriesOnChange(event: any): void {
        const args = event.args;
        if (args) {
            const value = args.item.value;
            this.myChart.seriesGroups()[0].type = value;
            this.myChart.update();
        }
    }
    generateChartData = () => {
        this.data = JSON.parse(localStorage.getItem('chartdata'));
        console.log('data  ', this.data);
        if (this.data != null) {
            this.data = this.data.reverse();
        }
    }
  // tslint:disable-next-line:member-ordering

}



