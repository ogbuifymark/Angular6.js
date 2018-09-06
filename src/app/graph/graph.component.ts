import { Component, OnInit , AfterViewInit} from '@angular/core';
import { DataService } from '../data.service';
import { XhrFactory } from '@angular/common/http/src/xhr';
// import { error } from '@angular/compiler/src/util';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';
import { Console } from '@angular/core/src/console';
import { Subscription } from 'rxjs/';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import { ViewChild } from '@angular/core';
import { BitfinexCandles } from '../shared/interfaces';

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
        console.log('hey');
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
        // const timer = setInterval(() => {
        //     const max = 800;
        //     if (data.length >= 60) {
        //         data.splice(0, 1);
        //     }
        //     const timestamp = new Date();
        //     timestamp.setSeconds(timestamp.getSeconds());
        //     timestamp.setMilliseconds(0);
        //     data.push({ timestamp: timestamp, value: Math.max(100, (Math.random() * 1000) % max) });
        //     this.myChart.update();
        // }, 1000);
        const { messages, connectionStatus } = websocketConnect('wss://api.bitfinex.com/ws/2', input);
        input.next(msg);

        const connectionStatusSubscription = connectionStatus.subscribe(numberConnected => {
        //   console.log('number of connected websockets:', numberConnected);
        });

        const messagesSubscription = messages.subscribe((message: string) => {
            this.sockets = JSON.parse(message);
            if (data.length >= 60) {
                        data.splice(0, 1);
                    }
            if (this.sockets instanceof Array) {
                if (this.sockets[1].length > 6) {
                    // tslint:disable-next-line:forin
                    for (const socket in this.sockets[1]) {
                        const jsondata = {
                            timestamp: new Date(this.sockets[1][socket][0]).setMilliseconds(0),
                            // open: this.sockets[1][socket][1],
                            // high: this.sockets[1][socket][3],
                            // low: this.sockets[1][socket][4],
                            // value: this.sockets[1][socket][2],
                            value: this.sockets[1][socket][5]
                        };
                        if (jsondata.timestamp != null) {
                            data.push(jsondata);
                            this.myChart.update();
                        }

                        // this.tickers$ = data;
                        // localStorage.setItem('chartdata', JSON.stringify(data));
                        this.mysource.postTickers(jsondata);
                    }
                  } else {
                    const jsondata = {
                        timestamp: new Date(this.sockets[1][0]).setMilliseconds(0),
                        // open: this.sockets[1][1],
                        // high: this.sockets[1][3],
                        // low: this.sockets[1][4],
                        // value: this.sockets[1][2],
                        value: this.sockets[1][5]
                    };
                    if (jsondata.timestamp != null) {
                        data.push(jsondata);
                        this.myChart.update();
                    }
                    // localStorage.setItem('chartdata', JSON.stringify(data));
                    this.mysource.postTickers(jsondata);
                    this.myChart.update();
                  }
            }
        });
    }

    // toolTipCustomFormatFn = (value: any, itemIndex: any, serie: any, group: any, categoryValue: any, categoryAxis: any) => {
    //     const dataItem = data.records[itemIndex];
    //     const volume = dataItem.volume;
    //     return '<DIV style="text-align:left"><b>Date: ' +
    //         categoryValue.getDate() + '-' + this.months[categoryValue.getMonth()] + '-' + categoryValue.getFullYear() +
    //         '</b><br />Open price: $' + value.open +
    //         '</b><br />Close price: $' + value.close +
    //         '</b><br />Low price: $' + value.low +
    //         '</b><br />High price: $' + value.high +
    //         '</b><br />Daily volume: ' + volume +
    //     '</DIV>';
    // }
    // tslint:disable-next-line:member-ordering
    data: any[] = [];
    // tslint:disable-next-line:member-ordering
    padding: any = { left: 5, top: 5, right: 5, bottom: 5 };
    // tslint:disable-next-line:member-ordering
    titlePadding: any = { left: 0, top: 0, right: 0, bottom: 10 };
    // tslint:disable-next-line:member-ordering
    xAxis: any =
    {
        dataField: 'timestamp',
        type: 'date',
        baseUnit: 'second',
            // unitInterval: 1,
        formatFunction: (value: any) => {
            return jqx.dataFormat.formatdate(value, 'hh:mm:ss', 'en-us');
        },
        gridLines: { interval: 2 },
        valuesOnTicks: true,
        labels: { offset: { x: -17, y: 0 } }
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
            type: 'line',
            columnsGapPercent: 50,
            alignEndPointsWithIntervals: true,
            valueAxis:
            {
                minValue: 0,
                maxValue: 1000,
                title: { text: 'Index Value' }
            },
            series: [
                // tslint:disable-next-line:max-line-length
                { dataField: 'value', displayText: 'value', opacity: 1, lineWidth: 2, symbolType: 'circle', fillColorSymbolSelected: 'white', symbolSize: 4 }
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
        // const max = 800;
        // const timestamp = new Date();
        // for (let i = 0; i < 60; i++) {
        //     timestamp.setMilliseconds(0);
        //     timestamp.setSeconds(timestamp.getSeconds() - 1);
        //     this.data.push({ timestamp: new Date(timestamp.valueOf()), value: Math.max(100, (Math.random() * 1000) % max) });
        // }
        // console.log('data  ', this.data);
        // this.data = this.data.reverse();
        // localStorage.setItem('chartdata', null);
        this.mysource.getTickers().subscribe(
            (savedDatas: BitfinexCandles) => {
                // tslint:disable-next-line:forin
                for (const savedData in savedDatas) {
                    if (savedDatas[savedData].timestamp != null) {
                        this.data.push(savedDatas[savedData]);
                    }
                    // if (Object.keys(savedDatas[savedData]).length > 6) {

                console.log('data  ', savedDatas[savedData]);
                    // }
                }

            });
            console.log('data  ', this.data);
            this.data = this.data.reverse();
    }
  // tslint:disable-next-line:member-ordering

}



