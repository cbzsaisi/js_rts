cc.macro.ENABLE_WEBGL_ANTIALIAS = false;
var GamePublic = require("./F_GamePublic");

var C_Cursor = {
    New: function(_MainNode) {
        var node = {};

        node.MainNode = _MainNode;
        node.Image = null;
        node.ButtonWidth = null;
        node.ButtonHeight = null;
        node.Pos = GamePublic.s_Vec2d(0, 0);;
        node.LoadWellDone = false;
        node.Node = new cc.Node();
        node.MainNode.Page_sceen_root.addChild(node.Node, 15);

        node.Delete = function() {
            node.Node.destroy();
            node.MainNode.Page_sceen_root.removeChild(node.Node);
        }
        node.SetPos = function(_Pos) {
            node.Pos.x = _Pos.x;
            node.Pos.y = _Pos.y;
        }
        node.SetImage = function(_Image) {
            node.Image = _Image;
            cc.resources.load(_Image, cc.SpriteFrame,function (err, prefab) {
                node.Node.addComponent(cc.Sprite).spriteFrame = prefab;
                node.ButtonWidth = prefab._rect.width * 0.5;
                node.ButtonHeight = prefab._rect.height * 0.5;
                node.LoadWellDone = true;
            });
            // cc.assetManager.loadRemote('http://cdncfgh5.52bjd.com/upload/player/1060/120098_1592632713.png', function (err, texture) {
            //     texture.setFilters(cc.Texture2D.Filter.NEAREST, cc.Texture2D.Filter.NEAREST);
            //     node.Node.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture, cc.rect(0,0,texture.width,texture.height),false,0,cc.size(texture.width,texture.height));
            //     node.ButtonWidth = texture.width * 0.5;
            //     node.ButtonHeight = texture.height * 0.5;
            //     node.LoadWellDone = true;
            // });
        }
            
        node.Update = function() {
            node.Node.setPosition({ x: node.Pos.x + node.ButtonWidth, y: node.Pos.y - node.ButtonHeight, });
        }
        node.SetImage("Cursor01");
        return node;
    }
}


module.exports = C_Cursor;