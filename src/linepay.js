module.exports = function (RED) {
    function ReserveNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("reserve", ReserveNode);

    function RemoteServerNode(n) {
        RED.nodes.createNode(this, n);
        this.name = n.name;
        this.channelId = n.channelId;
        this.channelSecret = n.channelSecret;
    }
    RED.nodes.registerType("remote-server", RemoteServerNode);
}
