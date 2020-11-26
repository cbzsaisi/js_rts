var GamePublic = require("./F_GamePublic");

var C_PageFront = {
    New: function (_Image,_MainPage,_Pos,_Color,_Size,_PickObjType,_PickObjNum) {
        var node = {};

        node.MainPage = _MainPage;
        node.Image = _Image;
        node.Pos = _Pos;
        node.BackDropWidth = null;
        node.BackDropHeight = null;
        node.LoadWellDone = false;
        node.Node = new cc.Node();
        node.Rect = null;
        node.Size = _Size;
        node.Color = _Color;
        node.PickObjType = _PickObjType;
        node.PickObjNum = _PickObjNum;
        node.MainPage.Node.addChild(node.Node,9);

        node.LoadSpriteRes = function () {
            
            if(node.Color){
                let renderer = node.Node.addComponent(cc.Graphics);
                renderer.fillColor = node.Color;//cc.color(255,255,255,195);
                renderer.rect(0,0,node.Size.w,node.Size.h);
                renderer.fill();
                renderer.stroke();

                node.BackDropWidth = node.Size.w;
                node.BackDropHeight = node.Size.h;
                var pos = GamePublic.s_Vec2d(node.Pos.x - (node.BackDropWidth / 2), node.Pos.y - (node.BackDropHeight / 2));
                node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.BackDropWidth, pos.y + node.BackDropHeight);
                node.Node.setPosition(pos);
                
                node.LoadWellDone = true;

            }else{
                cc.loader.loadRes(node.Image, cc.SpriteFrame, function (err, spriteFrame) {
    
                    let renderer = node.Node.getComponent(cc.Sprite);
                    if (!renderer) {
                        renderer = node.Node.addComponent(cc.Sprite);
                    }
                    renderer.spriteFrame = spriteFrame;
                    //node.SetPos(node.Pos);
                    //node.Node.setPosition(node.Pos);
                    node.Node.setPosition({x:node.Pos.x - node.MainPage.SccenHW.Width * 0.5,y:node.Pos.y - node.MainPage.SccenHW.Height * 0.5});

                    node.BackDropWidth = spriteFrame._rect.width;
                    node.BackDropHeight = spriteFrame._rect.height;
                    node.LoadWellDone = true;
    
                    if(node.Size){
    
                    }else{
                        var pos = GamePublic.s_Vec2d(node.Pos.x - (node.BackDropWidth/2),node.Pos.y - (node.BackDropHeight/2));
                        node.Rect = GamePublic.s_Rect(pos.x,pos.y,pos.x + node.BackDropWidth,pos.y + node.BackDropHeight);
                    }
                });
            }
            
        };

        node.Delete = function () {
            node.MainPage.Node.removeChild(node.Node);// removeAllChildren
            node.Node.destroy();
        }
        node.SetPos = function(_Pos){
            var pos = GamePublic.s_Vec2d(_Pos.x - (node.MainPage.SccenHW.Width / 2), _Pos.y - (node.MainPage.SccenHW.Height / 2));
                node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.BackDropWidth, pos.y + node.BackDropHeight);
                node.Node.setPosition(pos);
        }

        node.LoadSpriteRes();
        
        return node;
    }
}


module.exports = C_PageFront;