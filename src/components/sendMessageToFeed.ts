export function sendMessageToFeed(
  sendJsonMessage: Function,
  feed: string,
  product_ids: string[],
  event: string
) {
  sendJsonMessage({
    event,
    feed,
    product_ids,
  });
}
