var GamePublic = require("./F_GamePublic");
var C_Text = require("./C_Text");

var C_TipPage = {
    New: function (_MainNode) {
        var node = {};

        node.MainNode = _MainNode;
        node.Image = null;
        node.ButtonWidth = 150;
        node.ButtonHeight = 180;
        node.Pos = GamePublic.s_Vec2d(0, 0);;
        node.LoadWellDone = false;
        node.Node = new cc.Node();
        node.MainNode.addChild(node.Node, 9);
        node.Backdrop = new cc.Node();
        node.TextNode = new cc.Node();
        node.ImgNode = new cc.Node();
        node.ImgNode.setPosition({ x:100, y:150});
        node.Node.addChild(node.Backdrop,4);
        node.Node.addChild(node.ImgNode,6);
        node.Node.addChild(node.TextNode,7);
        node.Show = false;

        node.Graphics = node.Backdrop.addComponent(cc.Graphics);
        node.Graphics.fillColor = cc.color(55,215,215,195);
        node.Graphics.rect(0,0,node.ButtonWidth,node.ButtonHeight);
        node.Graphics.fill();
        node.Graphics.stroke();
        node.Node.setPosition({ x: node.Pos.x, y: node.Pos.y });

        node.ObjName = C_Text.New(GamePublic.s_Rect(3 + node.ButtonWidth/2, -20+ node.ButtonHeight, 130, 20), "namenamenamename", cc.Color.WHITE, 14,node ,node.TextNode, false);
        var num = 11;
        node.ObjNum = C_Text.New(GamePublic.s_Rect(3 + node.ButtonWidth/2, -40+ node.ButtonHeight, 130, 20),"x "+num, cc.Color.WHITE, 14,node ,node.TextNode, false);
        node.ObjDescribe = C_Text.New(GamePublic.s_Rect(3 + node.ButtonWidth/2, -320+ node.ButtonHeight, 130, 500), "namenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamename", cc.Color.WHITE, 14,node ,node.TextNode, false);

        
        node.LoadSpriteRes = function () {
            for (var i in GamePublic.g_resources1) {
                if (GamePublic.g_resources1[i].FileName == node.Image) {
                    var Res = node.ImgNode.getComponent(cc.Sprite);
                    if (!Res) {
                        Res = node.ImgNode.addComponent(cc.Sprite);
                    }
                    Res.spriteFrame = GamePublic.g_resources1[i].FileData;
                    //node.ButtonWidth = spriteFrame._rect.width;
                    //node.ButtonHeight = spriteFrame._rect.height;
                }
            }
            /* if(){
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
            } */
            
            node.LoadWellDone = false;
        };

        node.Delete = function () {
            node.Node.destroy();
            node.MainNode.removeChild(node.Node);
        }
        node.SetPos = function (_Pos) {
            node.Pos.x = _Pos.x;
            node.Pos.y = _Pos.y;
            node.Node.setPosition({x:node.Pos.x + 10,y:node.Pos.y - 10 - node.ButtonHeight});
        }
        node.SetImage = function (_Image) {
            if(_Image){
                node.Image = _Image;
                node.LoadSpriteRes();
            }else{
                var Res = node.ImgNode.getComponent(cc.Sprite);
                    if (!Res) {
                        Res = node.ImgNode.addComponent(cc.Sprite);
                    }
                Res.spriteFrame = null;
            }
            
        }
        node.SetShow = function(_Show){
            if(_Show){
                //node.Node.active = true;
                node.Show = _Show;
            }else{
                node.Node.active = false;
                node.Show = _Show;
            }
        }
        node.Setinfo = function (_ObjName, _ObjNum, _ObjDescribe, _Image) {
            if (_Image) {
                node.SetImage(_Image);
            }else{
                node.SetImage(null);
            }
            if(_ObjName)node.ObjName.SetStr(_ObjName);
            if(_ObjNum){
                node.ObjNum.SetStr(_ObjNum);
                node.ObjNum.Node.active = true;
            }else{
                node.ObjNum.SetStr(0);
                node.ObjNum.Node.active = false;
            }
            if(_ObjDescribe)node.ObjDescribe.SetStr(_ObjDescribe);
            GamePublic.g_MouseStopTick = 0;
            node.SetShow(true);
        }
        node.Update = function () {
            if(node.Show && !node.Node.active && GamePublic.g_MouseStopTick > 10){
                node.Node.active = true;
            }

            //node.Node.setPosition({ x: node.Pos.x + node.ButtonWidth * 0.5, y: node.Pos.y - node.ButtonHeight * 0.5, });
        }
        node.SetShow (false);
        return node;
    }
}


module.exports = C_TipPage;