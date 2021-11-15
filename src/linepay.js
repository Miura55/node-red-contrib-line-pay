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
    console.log(`channel Id: ${node.config.channelId}`);
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
    RED.nodes.registerType("confirm", ConfirmNode);

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
