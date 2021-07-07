/*class Orderbook {
    price = 0;
    size = 0;
    bids: [{ price: number, size: number }?] = [];
    asks: [{ price: number, size: number }?] = [];

    constructor(price: number, size: number) {
        this.price = price;
        this.size = size;
    }

    add(price: number, size: number, bid: boolean) {
        if (bid) {
            if(this.bids.find()){
                this.bids[]
            }
        }
    }

}

export default Orderbook;
*/

function Orderbook() {
    const bids = new Array<{ price: number, size: number }>();
    const asks = new Array<{ price: number, size: number }>();

    return {
        bids: function () {
            return bids;
        },
        addBid: function (price: number, size: number) {
            let position = this.bidExists(price);
            if (position > -1) {
                bids[position]!.size = size;
            } else {
                position = bids.push({price, size}) - 1;
            }
            return position;
        },
        bidExists: function (price: number) {
            let position = -1;
            if (bids.length > 0) {
                bids.filter((bid, index) => {
                    if (bid?.price === price) position = index;
                });
            }
            return position;
        }
    };
}

export default Orderbook;
