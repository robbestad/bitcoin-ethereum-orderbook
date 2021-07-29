import curry from "lodash.curry";
import styles from "../styles/Orderbook.module.css";
import overlaystyles from "../styles/Overlay.module.css";
import { Feed, Variant } from "../src/typings/enums";
import useOrderBook from "../src/hooks/orderbook";
import Orders from "../src/views/orders";
import Titlebar from "../src/views/titlebar";
import { useMemo, useState, StrictMode } from "react";
import toggleFeed from "../src/functions/toggleFeed";
import calculateSpread from "../src/functions/calculateSpread";
import changeTicketSizeGrouping from "../src/functions/changeTicketSizeGrouping";
import Controls from "../src/views/controls";
import Slider from "../src/views/slider";

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
    displayConnectionStatus,
    connectionStatus,
    setSlider,
    depth,
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
  const totalReversed = useMemo(() => {
    return asksReversed.filter((e) => e.total).reduce((x, y) => x + y.total, 0);
  }, [asksReversed]);
  const totalBids = bids[bids.length - 1]?.total;
  const totalAsks = asks[asks.length - 1]?.total;

  const spread = useMemo(() => {
    return calculateSpread(bids, asks);
  }, [bids, asks]);

  return (
    <StrictMode>
      {displayError && (
        <div className={overlaystyles.errorView}>
          An unexpected error has occurred!
          <br />
        </div>
      )}
      {displayConnectionStatus && (
        <div className={overlaystyles.connectionView}>{connectionStatus}</div>
      )}

      <div className={styles.container}>
        <Titlebar
          feed={feed}
          currentGrouping={currentGrouping}
          handleChangeGrouping={curriedHandleGroupingChange}
          spread={spread}
        >
          <Slider
            size={depth}
            minVal={3}
            maxVal={25}
            updateFn={(val) => setSlider("depth", val)}
          />
        </Titlebar>
        <Orders entries={bids} total={totalBids} isAsk={false} depth={depth} />

        {/* only visible on mobile */}
        <div className={styles.spread}>Spread {spread}</div>

        {/* only visible on desktop */}
        <Orders
          entries={asks}
          total={totalReversed}
          isAsk={true}
          depth={depth}
        />

        {/* only visible on mobile */}
        <Orders
          entries={asksReversed}
          total={totalAsks}
          isAsk={true}
          depth={depth}
          variant={Variant.mobile}
        />

        <Controls
          feed={feed}
          handleToggleCrash={handleToggleCrash}
          handleToggleFeed={curriedToggleFeed}
          displayError={displayError}
        />
      </div>
    </StrictMode>
  );
}
