var GamePublic = require("./F_GamePublic");

var C_Cursor = {
    New: function (_MainNode) {
        var node = {};

        node.MainNode = _MainNode;
        node.Image = null;
        node.ButtonWidth = null;
        node.ButtonHeight = null;
        node.Pos = GamePublic.s_Vec2d(0, 0);;
        node.LoadWellDone = false;
        node.Node = new cc.Node();
        node.MainNode.Page_sceen_root.addChild(node.Node, 15);

        node.LoadSpriteRes = function (_Image) {
            cc.loader.loadRes(node.Image, cc.SpriteFrame, function (err, spriteFrame) {
                let renderer = node.Node.getComponent(cc.Sprite);
                if (!renderer) {
                    renderer = node.Node.addComponent(cc.Sprite);
                }
                renderer.spriteFrame = spriteFrame;

                //node.Node.setPosition({x:node.ButtonInfo.Pos.x - node.MainPage.SccenHW.Width * 0.5,y:node.ButtonInfo.Pos.y - node.MainPage.SccenHW.Height * 0.5});
                node.ButtonWidth = spriteFrame._rect.width;
                node.ButtonHeight = spriteFrame._rect.height;
                node.LoadWellDone = true;
                //node.Pos = GamePublic.s_Vec2d(0,0);
                //node.Rect = GamePublic.s_Rect(pos.x,pos.y,pos.x + node.ButtonWidth,pos.y + node.ButtonHeight);
            });
            node.LoadWellDone = false;
        };

        node.Delete = function () {
            node.Node.destroy();
            node.MainNode.Page_sceen_root.removeChild(node.Node);
        }
        node.SetPos = function (_Pos) {
            node.Pos.x = _Pos.x;
            node.Pos.y = _Pos.y;
        }
        node.SetImage = function (_Image) {
            node.Image = _Image;
            //node.LoadSpriteRes();
            for (var i in GamePublic.g_resources1) {
                if (GamePublic.g_resources1[i].FileName == _Image) {
                    let renderer = node.Node.getComponent(cc.Sprite);
                    if (!renderer) {
                        renderer = node.Node.addComponent(cc.Sprite);
                    }
                    renderer.spriteFrame = GamePublic.g_resources1[i].FileData;
                    node.ButtonWidth = renderer.spriteFrame._rect.width * 0.5;
                    node.ButtonHeight = renderer.spriteFrame._rect.height * 0.5;
                    node.LoadWellDone = true;
                }
            }
        }

        node.Update = function () {
            node.Node.setPosition({ x: node.Pos.x + node.ButtonWidth, y: node.Pos.y - node.ButtonHeight, });
        }
        node.SetImage("Cursor01");
        return node;
    }
}


module.exports = C_Cursor;