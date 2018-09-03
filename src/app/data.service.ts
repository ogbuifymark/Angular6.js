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
  socket: Socket;
  observer: Observer<Object>;
    constructor(private http: HttpClient) {}
  getTickers() {
    return this.http.get('https://api.bitfinex.com/v2/tickers?symbols=ALL');
  }


  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
        const errMessage = error.error.message;
        return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }

  getPosts() {
    return this.http.get('https://jsonplaceholder.typicode.com/posts');
  }

}
