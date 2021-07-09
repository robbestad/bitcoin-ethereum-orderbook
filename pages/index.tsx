import curry from "lodash.curry";
import orderBy from "lodash.orderby";
import styles from "../styles/Orderbook.module.css";
import {Feed, Variant} from "../src/typings/enums";
import useOrderBook from "../src/hooks/orderbook";
import Bids from "../src/views/bids";
import Header from "../src/views/header";
import { useEffect, useMemo, useState } from "react";
import toggleFeed from "../src/components/toggleFeed";
import calculateSpread from "../src/components/calculateSpread";
import changeGrouping from "../src/components/changeGrouping";

export default function Orderbook() {
  const [feed, setFeed] = useState(Feed.Bitcoin_USD);
  const {
    asks,
    bids,
    currentGrouping,
    sendMessageEvent,
    setGroupingEvent,
    clearOrderBook,
  } = useOrderBook("wss://www.cryptofacilities.com/ws/v1", [feed]);

  useEffect(() => {
    clearOrderBook("reset");
    sendMessageEvent([feed], "subscribe");
  }, [feed]);

  const curriedToggleFeed = curry(toggleFeed)(
    sendMessageEvent,
    setFeed,
    setGroupingEvent,
    clearOrderBook
  );
  const curriedHandleGroupingChange = curry(changeGrouping)(
    setGroupingEvent,
    clearOrderBook
  );

  const [killed, setIsKilled] = useState(false);

  function toggleKillFeed(feed: Feed) {
    if (killed) sendMessageEvent([feed], "subscribe");
    else sendMessageEvent([feed], "unsubscribe");
    setIsKilled(!killed);
  }

  const spread = useMemo(() => {
    return calculateSpread(bids, asks);
  }, [bids, asks]);
  let asksReversed = orderBy(asks, "price", "desc").slice(asks.length-10,asks.length)

  return (
    <div className={styles.container}>
      <Header
        feed={feed}
        currentGrouping={currentGrouping}
        handleChangeGrouping={curriedHandleGroupingChange}
        spread={spread}
      />
      <Bids entries={bids} reverse={false} depth={10}  />
      <div className={styles.spread}>Spread {spread}</div>
      <Bids entries={asks} reverse={true} depth={10} />
      <Bids entries={asksReversed} reverse={true} depth={10} variant={Variant.mobile} />
      <div className={styles.controls}>
        <button
          className={styles.btnToggleFeed}
          onClick={() => curriedToggleFeed(feed)}
        >
          Toggle feed
        </button>
        <button
          className={styles.btnKillFeed}
          onClick={() => toggleKillFeed(feed)}
        >
          Kill feed
        </button>
      </div>
    </div>
  );
}
