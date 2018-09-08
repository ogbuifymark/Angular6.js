import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ws} from 'ws';
import { from } from 'rxjs/internal/observable/from';
// import {BitfinexAPI} from '../../node_modules/bitfinex-api/dist/index.js';
import * as socketIo from 'socket.io-client';
import { Observable } from 'rxjs';
import { Socket } from './shared/interfaces';
import { Observer } from 'rxjs';
import { QueueingSubject } from 'queueing-subject';
import websocketConnect from 'rxjs-websockets';
import { map, take } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})


export class DataService {
uri = 'http://localhost:4000/bitfinexRoutes';

  socket: Socket;
  observer: Observer<Object>;
    constructor(private http: HttpClient) {}
  getTickers() {
    const check = this.http.get(this.uri);
    return check;
  }


  postTickers(tickers) {
    return this.http.post(this.uri + '/add', tickers)
    .subscribe(res => console.log('Done'));
  }

  getPosts() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts');
  }

}
