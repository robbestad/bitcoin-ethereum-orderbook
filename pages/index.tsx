import useWebSocket from "react-use-websocket";
import {useEffect, useReducer, useState} from "react";
import OrderbookStyles from "../styles/Orderbook.module.css";
import orderBy from "lodash.orderby";
import asyncGetter from "../components/utils/asyncGetter";

const SOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";

interface Bid {
    price: number,
    size: number
}

function reducer(state: { bids: Bid[], asks: Bid[], bidsSorted:Bid[],asksSorted:Bid[] }, action: { type: string; payload?: Bid; }) {
    function bidExists(price: number) {
        let position = -1;
        if (state.bids.length > 0) {
            state.bids.forEach((bid: Bid, index: number) => {
                if (bid.price === price){
                    position = index;
                    return;
                }
            });
        }
        return position;
    }

    function askExists(price: number) {
        let position = -1;
        if (state.asks.length > 0) {
            state.asks.forEach((bid: Bid, index: number) => {
                if (bid.price === price) {
                    position = index;
                    return;
                }
            });
        }
        return position;
    }

    switch (action.type) {
        case "addBid": {
            const {price, size} = action.payload!;
            let position = bidExists(price);
            if (position > -1) {
                state.bids[position].size = size;
            } else {
                state.bids.push({price, size});
            }
            return state;
        }
        case "removeBid": {
            const {price, size} = action.payload!;
            state.bids.filter(bid=>bid.price !== price);
            return state;
        }
        case "removeAsk": {
            const {price, size} = action.payload!;
            state.asks.filter(bid=>bid.price !== price);
            return state;
        }
        case "addAsk": {
            const {price, size} = action.payload!;
            let position = askExists(price);
            if (position > -1) {
                 state.asks[position].size = size;
            } else {
                state.asks.push({price, size});
            }
            return state;
        }
        case "sort": {
            const _nonZeroBids = state.bids.filter(bid=>bid.size>0)
            const _nonZeroAsks = state.asks.filter(bid=>bid.size>0)
            state.bidsSorted = orderBy(state.bids, ["price"], ["desc"]);
            state.asksSorted = orderBy(state.asks, ["price"], ["asc"]);
            return {
                bids: _nonZeroBids,
                asks: _nonZeroAsks,
                bidsSorted: orderBy(_nonZeroBids, ["price"], ["desc"]),
                asksSorted: orderBy(_nonZeroAsks, ["price"], ["desc"])
            };
        }
        default:
            throw new Error();
    }
}


const initialState = {bids: [], asks: [], asksSorted: [], bidsSorted:[]};

export default function Home() {
    const [currentSocketUrl, setCurrentSocketUrl] = useState(SOCKET_URL);
    const [state, orderbookDispatch] = useReducer(reducer, initialState);

    const {sendMessage, lastMessage, readyState, getWebSocket} = useWebSocket(
        currentSocketUrl,
        {
            share: true,
            shouldReconnect: () => false
        }
    );

    useEffect(() => {
        if (!lastMessage) return;
        const data = JSON.parse(lastMessage.data);
        if (data.feed && data.feed.startsWith("book_ui_1")) {
            data.bids && data.bids.forEach((bid: number[]) => {
                const size=bid[1];
                const price=bid[0];
                if(size===0) orderbookDispatch({type: "removeBid", payload: {price: bid[0], size: bid[1]}});
                else orderbookDispatch({type: "addBid", payload: {price: bid[0], size: bid[1]}});
            });
            data.asks && data.asks.forEach((bid: number[]) => {
                const size=bid[1];
                const price=bid[0];
                if(size===0) orderbookDispatch({type: "removeAsk", payload: {price: bid[0], size: bid[1]}});
                else orderbookDispatch({type: "addAsk", payload: {price: bid[0], size: bid[1]}});
            });
        }
    }, [lastMessage]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            orderbookDispatch({type:"sort"});
        }, 100) // in milliseconds
        return () => clearInterval(intervalId)
    }, [lastMessage]);

    // @ts-ignore
    const readyStateString = {
        0: "CONNECTING",
        1: "OPEN",
        2: "CLOSING",
        3: "CLOSED"
    }[readyState];

    useEffect(() => {
        console.clear();
        asyncGetter(SOCKET_URL);
        return ()=>{
            if (readyStateString === "OPEN") {
                sendMessage("{\"event\":\"unsubscribe\",\"feed\":\"book_ui_1\",\"product_ids\":[\"PI_XBTUSD\"]}");
            }
        }
    }, []);

    useEffect(() => {
        if (readyStateString === "OPEN") {
            sendMessage("{\"event\":\"subscribe\",\"feed\":\"book_ui_1\",\"product_ids\":[\"PI_XBTUSD\"]}");
        }
    }, [readyState]);


    return (
        <div className={OrderbookStyles.container}>
            <div className={OrderbookStyles.total}>
                total
            </div>
            <div className={OrderbookStyles.size}>
                size
            </div>
            <div className={OrderbookStyles.price}>
                {state.bidsSorted && state.bidsSorted.map((bid) => <p key={bid.price}>{bid.price} - {bid.size}</p>)}
            </div>

            <div className={OrderbookStyles.price}>
                {state.asksSorted && state.asksSorted.map((bid) => <p key={bid.price}>{bid.price} - {bid.size}</p>)}
            </div>
            <div className={OrderbookStyles.size}>
                size
            </div>
            <div className={OrderbookStyles.total}>
                total
            </div>

        </div>
    );

}
