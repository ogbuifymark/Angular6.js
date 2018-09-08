export interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
  }
export interface BitfinexCandles {
    id: Number;
    timestamp: String;
    // open: String;
    // high: String;
    // low: String;
    // close: String;
    volume: String;
}
