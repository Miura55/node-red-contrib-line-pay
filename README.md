# node-red-contrib-line-pay
Node-RED expansion node for LINE Pay

This node uses [LINE Pay API V3](https://pay.line.me/jp/developers/apis/onlineApis?locale=en_US).
## Install
### npm

```
$ cd ~/.node-red
$ npm install node-red-contrib-line-pay
```

### from Node-RED

- Select `Manage Pallet`
- Click `Add Node` tab
- Search `node-red-contrib-line-pay`
- Install

## Getting Start
1. Get channel ID and channel secret from https://pay.line.me.
2. Set URI, channel ID and channel secret to config node.
    
Chose URI below which you want to use environment. 
- sandbox: https://sandbox-api-pay.line.me
- production: https://api-pay.line.me

![config node](https://i.gyazo.com/82423633ff349ae092eb45d4a70be159.png)

## Nodes
### Common
- A node which requires transaction ID, set transaction ID as `msg.transactionId`.
- A node which requires RegKey, set RegKey as `msg.regKey`.     
- Another params, set `msg.payload`.
### Request
Call request API.

#### `msg.payload`sample

```json
{
    "amount" : 100,
    "currency" : "JPY",
    "orderId" : "MKSI_S_20180904_1000001",
    "packages" : [
        {
            "id" : "1",
            "amount": 100,
            "products" : [
                {
                    "id" : "PEN-B-001",
                    "name" : "Pen Brown",
                    "imageUrl" : "https://pay-store.line.com/images/pen_brown.jpg",
                    "quantity" : 2,
                    "price" : 50
                }
            ]
        }
    ],
    "redirectUrls" : {
        "confirmUrl" : "https://pay-store.line.com/order/payment/authorize",
        "cancelUrl" : "https://pay-store.line.com/order/payment/cancel"
    },
    "options" : {
        "extra" : {
            "branchName" : "BRANCH_NAME",
            "branchId" : "BRANCH_ID"
        }
    }
}
```
### Confirm
Call confirm API.

This node requires `msg.transactionId`.

#### `msg.payload` sample
```json
{
    "amount": 1000,
    "currency":"JPY" 
}
```

### Capture
Call capture API.

This node requires `msg.transactionId`.

#### `msg.payload` sample
```json
{
    "amount": 1000,
    "currency":"JPY" 
}
```

### Void
Call capture API.

This node requires `msg.transactionId`.

No require `msg.payload`.

### Refund
Call refund API.

This node requires `msg.transactionId`.

#### `msg.payload` sample
This request body is option.

If `msg.payload` is undefined, this API returns refund all price.

```json
{
    "refundAmount": 1000 
}
```

### Detail
Call payment detail API.

This node requires `msg.transactionId` or `msg.payload.orderId`.

#### `msg.payload` sample
`msg.payload.fields`is option.

```json
{
    "orderId": "1002045572",
    "fields": "ORDER"
}
```

### CheckPaymentStatus
Call payment status API.

This node requires `msg.transactionId`.

No require `msg.payload`.
### CheckRegKey
Call check regKey API.

This node requires `msg.regKey`.

#### `msg.payload` sample
This request body is option.

```json
{
    "creditCardAuth": true
}
```

### PayPreapproved
Call pay preapproved.

This node requires `msg.regKey`.

#### `msg.payload` sample
```json
{
    "productName":"Brown pen", 
    "amount": 1000, 
    "currency":"JPY", 
    "orderId":"Ord2018123100000001"
}
```

### ExpireRegKey
Call Expire regKey API.

This node requires `msg.regKey`.

No require `msg.payload`.

## Example Flow

![flow](https://i.gyazo.com/223738ac3dc08ec93a977ee2534a35af.png)

This flow source is [line_pay_example_flow.json](examples/line_pay_example_flow.json)
