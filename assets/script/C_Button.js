var GamePublic = require("./F_GamePublic");

var C_Button = {
    New: function (_ButtonInfo, _MainPage, _ClickType) {
        var node = {};

        node.MainPage = _MainPage;
        //node.Image = _Image;
        //node.Button = null;
        //node.Pos = _Pos;
        node.ButtonWidth = null;
        node.ButtonHeight = null;
        node.LoadWellDone = false;
        //node.Command = _Command;
        node.Rect = null;
        node.Node = new cc.Node();
        node.ButtonInfo = _ButtonInfo;
        node.ClickType = _ClickType;
        node.MainPage.Node.addChild(node.Node, 4);
        node.SpriteRes = null;
        node.LoadSpriteRes = function () {
            for (var i in GamePublic.g_resources1) {
                if (GamePublic.g_resources1[i].FileName == node.ButtonInfo.ObjInfo.Image) {
                    node.SpriteRes = node.Node.getComponent(cc.Sprite);
                    if (!node.SpriteRes) {
                        node.SpriteRes = node.Node.addComponent(cc.Sprite);
                    }
                    node.SpriteRes.spriteFrame = GamePublic.g_resources1[i].FileData;
                    node.ButtonWidth = node.SpriteRes.spriteFrame._rect.width;
                    node.ButtonHeight = node.SpriteRes.spriteFrame._rect.height;
                    node.Node.setPosition({ x: node.ButtonInfo.Pos.x - node.MainPage.SccenHW.Width * 0.5, y: node.ButtonInfo.Pos.y - node.MainPage.SccenHW.Height * 0.5 });

                    var pos = GamePublic.s_Vec2d(node.ButtonInfo.Pos.x - (node.ButtonWidth / 2), node.ButtonInfo.Pos.y - (node.ButtonHeight / 2));
                    node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.ButtonWidth, pos.y + node.ButtonHeight);
                    node.LoadWellDone = true;
                }
            }
            /* cc.loader.loadRes(node.ButtonInfo.ObjInfo.Image, cc.SpriteFrame, function (err, spriteFrame) {
                let renderer = node.Node.getComponent(cc.Sprite);
                if (!renderer) {
                    renderer = node.Node.addComponent(cc.Sprite);
                }
                renderer.spriteFrame = spriteFrame;
                
                node.Node.setPosition({x:node.ButtonInfo.Pos.x - node.MainPage.SccenHW.Width * 0.5,y:node.ButtonInfo.Pos.y - node.MainPage.SccenHW.Height * 0.5});
                node.ButtonWidth = spriteFrame._rect.width;
                node.ButtonHeight = spriteFrame._rect.height;
                node.LoadWellDone = true;

                var pos = GamePublic.s_Vec2d(node.ButtonInfo.Pos.x - (node.ButtonWidth/2),node.ButtonInfo.Pos.y - (node.ButtonHeight/2));
                node.Rect = GamePublic.s_Rect(pos.x,pos.y,pos.x + node.ButtonWidth,pos.y + node.ButtonHeight);
            }); */
        };

        node.Delete = function () {
            //cc.loader.release(node.SpriteRes.spriteFrame);
            node.SpriteRes = null;
            node.Node.destroy();
            node.MainPage.Node.removeChild(node.Node);
        }

        node.Update = function () {
            //var pos = GamePublic.s_Vec2d(node.ButtonInfo.Pos.x - (node.ButtonWidth/2),node.ButtonInfo.Pos.y - (node.ButtonHeight/2));
            //node.Rect = GamePublic.s_Rect(pos.x,pos.y,pos.x + node.ButtonWidth,pos.y + node.ButtonHeight);
            node.Node.setPosition({ x: node.ButtonInfo.Pos.x - node.MainPage.SccenHW.Width * 0.5, y: node.ButtonInfo.Pos.y - node.MainPage.SccenHW.Height * 0.5 });
        }
        node.LoadSpriteRes();
        return node;
    }
}

module.exports = C_Button;