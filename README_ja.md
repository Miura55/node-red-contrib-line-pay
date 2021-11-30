# node-red-contrib-line-pay
LINE PayをNode-REDで使うための拡張ノードです。

このノードは [LINE Pay API V3](https://pay.line.me/jp/developers/apis/onlineApis?locale=ja_JP)を利用しています。
## インストール
### npm

```
$ cd ~/.node-red
$ npm install node-red-contrib-line-pay
```

### Node-REDの画面でのインストール

- `パレットの管理`を選択
- `ノードを追加`タブをクリック
- `node-red-contrib-line-pay`を検索
- インストール

## Getting Start
1. https://pay.line.me にて、Channel IDとChannel Secretを取得します。
2. config nodeにURIとChannel ID、Channel Secretを設定します。
    
URIは下記のいずれかを選択してください。 
- sandbox: https://sandbox-api-pay.line.me
- production: https://api-pay.line.me

![config node](https://i.gyazo.com/82423633ff349ae092eb45d4a70be159.png)

## Nodes
### 共通のルール
- トランザクションIDが必要なノードでは、トランザクションIDを`msg.transactionId`に設定します。
- RegKeyが必要なノードでは、RegKeyを`msg.regKey`に設定します。     
- 他のパラメータは`msg.payload`に設定します。
### Request
Request APIを呼び出します。

- `msg.payload`のサンプル 

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
Confirm APIを呼び出します。

このノードは`msg.transactionId`を必要とします。

- `msg.payload`のサンプル
```json
{
    "amount": 1000,
    "currency":"JPY" 
}
```

### Capture
Capture APIを呼び出します。

このノードは`msg.transactionId`を必要とします。

- `msg.payload`のサンプル 
```json
{
    "amount": 1000,
    "currency":"JPY" 
}
```

### Void
Void APIを呼び出します。

このノードは`msg.transactionId`を必要とします。

`msg.payload`は必要ありません。

### Refund
Refund APIを呼び出します。


このノードは`msg.transactionId`を必要とします。

- `msg.payload`のサンプル

`msg.payload`は任意です。

`msg.payload`が設定されている場合、全額を返金します。

```json
{
    "refundAmount": 1000 
}
```

### Detail
Detail APIを呼び出します。

このノードは`msg.transactionId`か`msg.payload.orderId`のどちらかを必要とします。

- `msg.payload`のサンプル 

`msg.payload.field`は任意です。

```json
{
    "orderId": "1002045572",
    "fields": "ORDER"
}
```

### CheckPaymentStatus
CheckPaymentStatus APIを呼び出します。

`msg.transactionId`を必要とします。

`msg.payload`は必要ありません。

### CheckRegKey
CheckRegKey APIを呼び出します。

このノードは`msg.regKey`を必要とします。

- `msg.payload`のサンプル

`msg.payload`は任意です。

```json
{
    "creditCardAuth": true
}
```

### PayPreapproved
PayPreapproved APIを呼び出します。

このノードは`msg.regKey`を必要とします。

- `msg.payload`のサンプル
```json
{
    "productName":"Brown pen", 
    "amount": 1000, 
    "currency":"JPY", 
    "orderId":"Ord2018123100000001"
}
```

### ExpireRegKey
ExpireRegKey APIを呼び出します。

このノードは`msg.regKey`を必要とします。

`msg.payload`は必要ありません。

## サンプルフロー

![flow](https://i.gyazo.com/223738ac3dc08ec93a977ee2534a35af.png)


このフローのソースは[examples/line_pay_example_flow.json](https://raw.githubusercontent.com/Miura55/node-red-contrib-line-pay/main/examples/line_pay_example_flow.json)です。
