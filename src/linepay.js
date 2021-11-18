var axios = require('axios');
var crypto = require('crypto-js');
const {
    v4: uuidv4
} = require('uuid');


// Make request headers 
const MakeHeaders = (method, api, node, body) => {
    let nonce = uuidv4();
    let channelSecret = node.config.channelSecret;
    let encrypt = null;

    if (method == 'GET') {
        encrypt = crypto.HmacSHA256(channelSecret + api + body + nonce, channelSecret);
    } else if (method == 'POST') {
        encrypt = crypto.HmacSHA256(channelSecret + api + JSON.stringify(body) + nonce, channelSecret);
    }

    return {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': node.config.channelId,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': crypto.enc.Base64.stringify(encrypt)
    }
}


module.exports = function (RED) {
    // call request API
    function RequestNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            RED.log.error('Config Not Found.');
        }
        node.on('input', async (msg) => {
            let api = '/v3/payments/request';
            let body = msg.payload;
            try {
                let setting = {
                    headers: MakeHeaders('POST', api, node, body),
                };
                res = await axios.post(node.config.uri + api, body, setting);
                msg.payload = res.data;
                node.send(msg);
            } catch (err) {
                RED.log.error(err)
                node.error(err);
            }
        });
    }
    RED.nodes.registerType("request", RequestNode);

    // call confirm API
    function ConfirmNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/${transactionId}/confirm`;
            let body = msg.payload;
            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    node.send(msg);
                } catch (err) {
                    RED.log.error(err)
                    node.error(err);
                }
            } else {
                node.error('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("confirm", ConfirmNode);

    // call capture API
    function CaptureNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/authorizations/${transactionId}/capture`;
            let body = msg.payload;
            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    node.send(msg);
                } catch (err) {
                    RED.log.error(err)
                    node.error(err);
                }
            } else {
                node.error('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("capture", CaptureNode);

    // call void API
    function VoidNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/authorizations/${transactionId}/void`;
            let body = msg.payload;
            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    node.send(msg);
                } catch (err) {
                    RED.log.error(err)
                    node.error(err);
                }
            } else {
                node.error('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("void", VoidNode);

    // call refund API
    function RefundNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/${transactionId}/refund`;
            let body = msg.payload;
            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    node.send(msg);
                } catch (err) {
                    RED.log.error(err)
                    node.error(err);
                }
            } else {
                node.error('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("refund", RefundNode);

    // call payment details API
    function PaymentDetailsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            node.error('Missing config setting')
        }

        node.on('input', async (msg) => {
            let transactionId = msg.transactionId;
            let orderId = msg.payload.orderId;
            let fields = msg.payload.fields;
            let api = '/v3/payments';
            let params = {}

            // set params
            if (transactionId) {
                console.log(`transactionId ${transactionId}`);
                params.transactionId = transactionId;
            }
            if (orderId) {
                console.log(`orderId ${orderId}`);
                params.orderId = orderId;
            }
            if (fields) {
                console.log(`fields ${fields}`);
                params.fields = fields;
            }

            // change parameters to make hash
            let paramString = Object.keys(params).map(idx => {
                return encodeURIComponent(idx) + '=' + encodeURIComponent(params[idx])
            }).join('&');

            try {
                let setting = {
                    headers: MakeHeaders('GET', api, node, paramString),
                    params: params
                };
                res = await axios.get(node.config.uri + api, setting);
                msg.payload = res.data;
                node.send(msg);
            } catch (err) {
                RED.log.error(err)
                node.error(err);
            }
        });
    }
    RED.nodes.registerType("paymentDetails", PaymentDetailsNode);

    // call check payment status API
    function CheckPaymentStatusNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            node.error('Missing config setting')
        }

        node.on('input', async (msg) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/requests/${transactionId}/check`;

            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('GET', api, node, ''),
                    };
                    res = await axios.get(node.config.uri + api, setting);
                    msg.payload = res.data;
                    node.send(msg);
                } catch (err) {
                    RED.log.error(err)
                    node.error(err);
                }
            } else {
                node.error('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("checkPaymentStatus", CheckPaymentStatusNode);

    // call check RegKey API
    function CheckRegKeyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info("Config Name: " + node.config.name);
        } else {
            node.error('Missing config setting')
        }

        node.on('input', async (msg) => {
            let regKey = msg.payload.regKey;
            let api = `/v3/payments/preapprovedPay/${regKey}/check`;

            try {
                let setting = {};
                let paramString = '';
                if ('creditCardAuth' in msg.payload) {
                    setting.params = {}
                    setting.params.creditCardAuth = msg.payload.creditCardAuth;
                    paramString = Object.keys(setting.params).map(idx => {
                        return encodeURIComponent(idx) + '=' + encodeURIComponent(setting.params[idx])
                    }).join('&');
                }
                setting.headers = MakeHeaders('GET', api, node, paramString);
                res = await axios.get(node.config.uri + api, setting);
                msg.payload = res.data;
                node.send(msg);
            } catch (err) {
                RED.log.error(err)
                node.error(err);
            }
        });
    }
    RED.nodes.registerType("checkRegKey", CheckRegKeyNode);

    // config node   
    function LINEPayConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.uri = n.uri;
        this.channelId = n.channelId;
        this.channelSecret = n.channelSecret;
    }
    RED.nodes.registerType("linepay-config", LINEPayConfigNode);

}
