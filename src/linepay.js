var axios = require('axios');
var crypto = require('crypto-js');
const {
    v4: uuidv4
} = require('uuid');


// Make request headers 
const MakeHeaders = (method, api, node, body) => {
    let nonce = uuidv4();
    return {
        'Content-Type': 'application/json',
        'X-LINE-ChannelId': node.config.channelId,
        'X-LINE-Authorization-Nonce': nonce,
        'X-LINE-Authorization': MakeHash(method, api, body, nonce, node.config.channelSecret)
    }
};

// Make hash for Authorization
const MakeHash = (method, api, body, nonce, channelSecret) => {
    let encrypt = null;
    if (method == 'GET') {
        encrypt = crypto.HmacSHA256(channelSecret + api + body + nonce, channelSecret);
    } else if (method == 'POST') {
        encrypt = crypto.HmacSHA256(channelSecret + api + JSON.stringify(body) + nonce, channelSecret);
    }
    return crypto.enc.Base64.stringify(encrypt);
};

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
