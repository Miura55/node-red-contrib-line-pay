var axios = require('axios');
var crypto = require('crypto-js');
var jsonBigint = require('json-bigint');
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
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            RED.log.error('Config Not Found.');
        }
        node.on('input', async (msg, send, done) => {
            let api = '/v3/payments/request';
            let body = msg.payload;
            RED.log.info(`call ${api}`);

            try {
                let setting = {
                    headers: MakeHeaders('POST', api, node, body),
                    transformResponse: [
                        data => {
                            return jsonBigint.parse(data)
                        }
                    ],
                };
                res = await axios.post(node.config.uri + api, body, setting);
                msg.payload = res.data;
                send(msg);
                done()
            } catch (err) {
                done(err);
            }
        });
    }
    RED.nodes.registerType("Request", RequestNode);

    // call confirm API
    function ConfirmNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg, send, done) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/${transactionId}/confirm`;
            let body = msg.payload;
            RED.log.info(`call ${api}`);

            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                        transformResponse: [
                            data => {
                                return jsonBigint.parse(data)
                            }
                        ],
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("Confirm", ConfirmNode);

    // call capture API
    function CaptureNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg, send, done) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/authorizations/${transactionId}/capture`;
            let body = msg.payload;
            RED.log.info(`call ${api}`);

            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                        transformResponse: [
                            data => {
                                return jsonBigint.parse(data)
                            }
                        ],
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("Capture", CaptureNode);

    // call void API
    function VoidNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info("LINE Pay Config Name: " + node.config.name);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg, send, done) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/authorizations/${transactionId}/void`;
            RED.log.info(`call ${api}`);

            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, {}),
                        transformResponse: [
                            data => {
                                return jsonBigint.parse(data)
                            }
                        ],
                    };
                    res = await axios.post(node.config.uri + api, {}, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("Void", VoidNode);

    // call refund API
    function RefundNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);
        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            RED.log.error('Config Not Found.');
        }

        node.on('input', async (msg, send, done) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/${transactionId}/refund`;
            let body = msg.payload;
            RED.log.info(`call ${api}`);

            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                        transformResponse: [
                            data => {
                                return jsonBigint.parse(data)
                            }
                        ],
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("Refund", RefundNode);

    // call payment details API
    function PaymentDetailsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            node.error('Missing config setting')
        }

        node.on('input', async (msg, send, done) => {
            let transactionId = msg.transactionId;
            let orderId = msg.payload.orderId;
            let fields = msg.payload.fields;
            let api = '/v3/payments';
            let params = {}

            // set params
            if (transactionId) {
                RED.log.info(`transactionId: ${transactionId}`);
                params.transactionId = String(transactionId);
            }
            if (orderId) {
                RED.log.info(`orderId: ${orderId}`);
                params.orderId = orderId;
            }
            if (fields) {
                RED.log.info(`fields: ${fields}`);
                params.fields = fields;
            }

            // change parameters to make hash
            let paramString = Object.keys(params).map(idx => {
                return encodeURIComponent(idx) + '=' + encodeURIComponent(params[idx])
            }).join('&');
            RED.log.info(`call ${api}?${paramString}`);

            try {
                let setting = {
                    headers: MakeHeaders('GET', api, node, paramString),
                    transformResponse: [
                        data => {
                            return jsonBigint.parse(data)
                        }
                    ],
                    params: params,
                };
                res = await axios.get(node.config.uri + api, setting);
                msg.payload = res.data;
                send(msg);
                done();
            } catch (err) {
                done(err);
            }
        });
    }
    RED.nodes.registerType("PaymentDetails", PaymentDetailsNode);

    // call check payment status API
    function CheckPaymentStatusNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            node.error('Missing config setting')
        }

        node.on('input', async (msg, send, done) => {
            let transactionId = msg.transactionId;
            let api = `/v3/payments/requests/${transactionId}/check`;
            RED.log.info(`call ${api}`);

            if (transactionId) {
                try {
                    let setting = {
                        headers: MakeHeaders('GET', api, node, ''),
                    };
                    res = await axios.get(node.config.uri + api, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.transactionId is undefined');
            }
        });
    }
    RED.nodes.registerType("CheckPaymentStatus", CheckPaymentStatusNode);

    // call check RegKey API
    function CheckRegKeyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            node.error('Missing config setting');
        }

        node.on('input', async (msg, send, done) => {
            let regKey = msg.regKey;
            let api = `/v3/payments/preapprovedPay/${regKey}/check`;
            RED.log.info(`call ${api}`);

            if (msg.regKey) {
                try {
                    let paramString = '';
                    if ('creditCardAuth' in msg.payload) {
                        setting.params = {}
                        setting.params.creditCardAuth = msg.payload.creditCardAuth;
                        paramString = Object.keys(setting.params).map(idx => {
                            return encodeURIComponent(idx) + '=' + encodeURIComponent(setting.params[idx])
                        }).join('&');
                    }
                    let setting = {
                        headers: MakeHeaders('GET', api, node, paramString),
                        transformResponse: [
                            data => {
                                return jsonBigint.parse(data)
                            }
                        ],
                    }
                    res = await axios.get(node.config.uri + api, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.regKey is undefined');
            }
        });
    }
    RED.nodes.registerType("CheckRegKey", CheckRegKeyNode);

    // call pay preapproved API
    function PayPreapprovedNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            node.error('Missing config setting');
        }

        node.on('input', async (msg, send, done) => {
            let regKey = msg.regKey;
            let api = `/v3/payments/preapprovedPay/${regKey}/payment`;
            let body = msg.payload;
            RED.log.info(`call ${api}`);

            if (msg.regKey) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, body),
                        transformResponse: [
                            data => {
                                return jsonBigint.parse(data)
                            }
                        ],
                    };
                    res = await axios.post(node.config.uri + api, body, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.regKey is undefined');
            }
        });
    }
    RED.nodes.registerType("PayPreapproved", PayPreapprovedNode);

    // call expire regKey API
    function ExpireRegKeyNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.config = RED.nodes.getNode(config.linepayConfig);

        if (node.config) {
            RED.log.info(`LINE Pay Config Name: ${node.config.name}`);
        } else {
            node.error('Missing config setting');
        }

        node.on('input', async (msg, send, done) => {
            let regKey = msg.regKey;
            let api = `/v3/payments/preapprovedPay/${regKey}/expire`;
            RED.log.info(`call ${api}`);

            if (msg.regKey) {
                try {
                    let setting = {
                        headers: MakeHeaders('POST', api, node, {}),
                        transformResponse: [
                            data => {
                                return jsonBigint.parse(data)
                            }
                        ],
                    };
                    res = await axios.post(node.config.uri + api, {}, setting);
                    msg.payload = res.data;
                    send(msg);
                    done();
                } catch (err) {
                    done(err);
                }
            } else {
                done('msg.regKey is undefined');
            }
        });
    }
    RED.nodes.registerType("ExpireRegKey", ExpireRegKeyNode);

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
