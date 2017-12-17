import "thenForEach";
export declare class QuoteService {
    private _data;
    apiKey: string;
    private _updateIntervalInSec;
    private _updateIntervalRef;
    private _waitInSec;
    private _tAudio;
    private _sAudio;
    constructor();
    private _getQuotes(q);
    addSymbol(symbols: Array<string>, reply: (value: any) => void): Promise<void>;
    delSymbol(msg: any, reply: (value: any) => void): void;
    getData(reply: (value: any) => void): void;
    update(msg: any): void;
    updateInterval(msg: any): void;
    updateApiKey(msg: any): void;
    private _reportError(errMsg);
    private _updateQuotes();
    private _wait();
    private _saveData();
    private _notify(trSl, item);
    private _checkTS();
    private _stopUpdate();
    private _addId();
}
