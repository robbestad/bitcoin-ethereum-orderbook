import { Feed, TicketSize } from "../typings/enums";
import styles from "../../styles/Titlebar.module.css";

type SelectProps = {
  feed: Feed;
  currentGrouping: TicketSize;
  callback: (value: TicketSize) => void;
};

export default function Select({
  currentGrouping,
  callback,
  feed,
}: SelectProps) {
  return (
    <select
      className={styles.select}
      value={currentGrouping}
      onChange={({ target: { value } }) =>
        callback(value as unknown as TicketSize)
      }
    >
      {(() => {
        if (feed === Feed.Bitcoin_USD) {
          return (
            <>
              <option value={TicketSize.BTCDefault}>
                Group {`${TicketSize.BTCDefault}`}
              </option>
              <option value={TicketSize.BTCMedium}>
                Group {`${TicketSize.BTCMedium}`}
              </option>
              <option value={TicketSize.BTCLarge}>
                Group {`${TicketSize.BTCLarge}`}
              </option>
            </>
          );
        }
        return (
          <>
            <option value={TicketSize.EthDefault}>
              Group {`${TicketSize.EthDefault}`}
            </option>
            <option value={TicketSize.EthMedium}>
              Group {`${TicketSize.EthMedium}`}
            </option>
            <option value={TicketSize.EthLarge}>
              Group {`${TicketSize.EthLarge}`}
            </option>
          </>
        );
      })()}
    </select>
  );
}
