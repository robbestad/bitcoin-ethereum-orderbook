import curry from "lodash.curry";
import { useEffect, useReducer, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { resetOrderbook } from "../functions/resetOrderbook";
import { sendMessageToFeed } from "../functions/sendMessageToFeed";
import { setSliderValue } from "../functions/setSliderValue";
import { setTicketSizeGrouping } from "../functions/setTicketSizeGrouping";
import { TicketSize } from "../typings/enums";
import { IState } from "../typings/interfaces";
import { reducer } from "./orderbookReducer";

const useOrderBook = (url: string, product_ids: string[]) => {
  const initialState = <IState>{
    asks: [],
    bids: [],
    asksReversed: [],
    currentGrouping: TicketSize.BTCDefault,
    depth: 8,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const [socketUrl, setSocketUrl] = useState(url);
  const [displayError, setDisplayError] = useState(false);
  const [displayConnectionStatus, setDisplayConnectionStatus] = useState(false);
  const [manuallyStopped, setManuallyStopped] = useState(false);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        if (displayError) setDisplayError(false);
      },
      onClose: () => {
        if (!manuallyStopped) {
          clearOrderBook();
        }
      },
      shouldReconnect: () => {
        return !manuallyStopped;
      },
      reconnectInterval: 3000,
      retryOnError: true,
      reconnectAttempts: 10,
    }
  );
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Connection closing",
    [ReadyState.CLOSED]: "Connection closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const sendMessageEvent = curry(sendMessageToFeed)(
    sendJsonMessage,
    "book_ui_1"
  );
  const setGroupingEvent = curry(setTicketSizeGrouping)(dispatch);
  const clearOrderBook = curry(resetOrderbook)(dispatch);
  const setSlider = curry(setSliderValue)(dispatch);

  const crashFeed = () => {
    setSocketUrl("wss://error");
    setManuallyStopped(true);
  };
  const restartFeed = () => {
    setSocketUrl(url);
    setManuallyStopped(false);
  };

  useEffect(() => {
    if (manuallyStopped) !displayError && setDisplayError(true);

    if (readyState === ReadyState.OPEN) {
      displayConnectionStatus && setDisplayConnectionStatus(false);
      return;
    }
    !displayConnectionStatus && setDisplayConnectionStatus(true);
    !displayConnectionStatus && !manuallyStopped && clearOrderBook();

    sendMessageEvent(product_ids, "subscribe");
  }, [connectionStatus, readyState, sendMessageEvent]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    dispatch({
      type: "newData",
      payload: lastJsonMessage,
    });
  }, [lastJsonMessage]);

  return {
    ...state,
    sendMessageEvent,
    setGroupingEvent,
    crashFeed,
    restartFeed,
    displayError,
    clearOrderBook,
    connectionStatus,
    displayConnectionStatus,
    setSlider,
  };
};
export default useOrderBook;
