import curry from "lodash.curry";
import styles from "../styles/Orderbook.module.css";
import errorstyles from "../styles/Error.module.css";
import { Feed, Variant } from "../src/typings/enums";
import useOrderBook from "../src/hooks/orderbook";
import Orders from "../src/views/orders";
import Titlebar from "../src/views/titlebar";
import { useMemo, useState } from "react";
import toggleFeed from "../src/components/toggleFeed";
import calculateSpread from "../src/components/calculateSpread";
import changeTicketSizeGrouping from "../src/components/changeTicketSizeGrouping";
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

  const curriedToggleFeed = curry(toggleFeed)(
    sendMessageEvent,
    setFeed,
    setGroupingEvent,
    clearOrderBook
  );

  const curriedHandleGroupingChange = curry(changeTicketSizeGrouping)(
    setGroupingEvent,
    clearOrderBook
  );

  function handleToggleCrash() {
    if (!displayError) {
      crashFeed();
    } else {
      clearOrderBook("reset");
      restartFeed();
    }
  }

  const spread = useMemo(() => {
    return calculateSpread(bids, asks);
  }, [bids, asks]);

  return (
    <div className={styles.container}>
      <Titlebar
        feed={feed}
        currentGrouping={currentGrouping}
        handleChangeGrouping={curriedHandleGroupingChange}
        spread={spread}
      />

      <Orders entries={bids} greenColorScheme={false} depth={10} />

      {/* only visible on mobile */}
      <div className={styles.spread}>Spread {spread}</div>

      {/* only visible on desktop */}
      <Orders entries={asks} greenColorScheme={true} depth={10} />

      {/* only visible on mobile */}
      <Orders
        entries={asksReversed}
        greenColorScheme={true}
        depth={10}
        variant={Variant.mobile}
      />

      <Controls
        feed={feed}
        handleToggleCrash={handleToggleCrash}
        handleToggleFeed={curriedToggleFeed}
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
