import curry from "lodash.curry";
import styles from "../styles/Orderbook.module.css";
import errorstyles from "../styles/Error.module.css";
import { Feed, Variant } from "../src/typings/enums";
import useOrderBook from "../src/hooks/orderbook";
import Orders from "../src/views/orders";
import Header from "../src/views/header";
import { useEffect, useMemo, useRef, useState } from "react";
import toggleFeed from "../src/components/toggleFeed";
import calculateSpread from "../src/components/calculateSpread";
import changeGrouping from "../src/components/changeGrouping";
import Controls from "../src/views/controls";

export default function Orderbook() {
  const [feed, setFeed] = useState(Feed.Bitcoin_USD);
  const {
    asks,
    bids,
    asksReversed,
    currentGrouping,
    sendMessageEvent,
    setGroupingEvent,
    clearOrderBook,
    crashFeed,
    restartFeed,
    displayError,
  } = useOrderBook("wss://www.cryptofacilities.com/ws/v1", [feed]);

  useEffect(() => {
    // important to clear orderbook when changing feeds
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

  function handleToggleCrash() {
    if (!displayError) {
      crashFeed();
    } else {
      restartFeed();
    }
  }

  const spread = useMemo(() => {
    return calculateSpread(bids, asks);
  }, [bids, asks]);

  return (
    <div className={styles.container}>
      <Header
        feed={feed}
        currentGrouping={currentGrouping}
        handleChangeGrouping={curriedHandleGroupingChange}
        spread={spread}
      />
      <Orders entries={bids} reverse={false} depth={10} />
      <div className={styles.spread}>Spread {spread}</div>
      <Orders entries={asks} reverse={true} depth={10} />
      <Orders
        entries={asksReversed}
        reverse={true}
        depth={10}
        variant={Variant.mobile}
      />
      <Controls
        feed={feed}
        handleToggleCrash={handleToggleCrash}
        curriedToggleFeed={curriedToggleFeed}
        displayError={displayError}
      />
      {displayError && (
        <div className={errorstyles.errorView}>
          An unexpected error has occurred!
        </div>
      )}
    </div>
  );
}
