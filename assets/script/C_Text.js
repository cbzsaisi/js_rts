var GamePublic = require("./F_GamePublic");
var PageSprite = require("./C_PageBackDrop");
var ButtonSprite = require("./C_Button");
var PageCommand = require("./F_PageCommand");

var C_Text = {
    New: function (_Rect,_str,_color,_size,_main,_DrawNode,_ClickType) {
        var node = {};

        node.Rect = _Rect;
        node.str = _str;
        node.color = _color;
        node.size = _size;
        node.main = _main;
        node.DrawNode = _DrawNode;
        node.Node = new cc.Node();
        node.LoadWellDone = false;
        node.ClickType = _ClickType;
        //node.node.anchorX = 0;
        //node.node.anchorY = 0;


        node.label = node.Node.addComponent(cc.Label);
        node.label.string  = node.str;

        node.DrawNode.addChild(node.Node,10);
        //node.Rect.x += node.Rect.w/2;
        //node.Rect.y -= node.Rect.h/2;
        node.Node.setPosition(GamePublic.s_Vec2d(node.Rect.x,node.Rect.y));
        node.Node.setContentSize(node.Rect.w,node.Rect.h);

        node.label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;//CENTER LEFT
        node.label.verticalAlign = cc.Label.VerticalAlign.TOP//CENTER TOP ;
        //let aa = label.node.getBoundingBox();
        //cc.Label.Overflow.SHRINK
        node.label.overflow = cc.Label.Overflow.CLAMP;//CLAMP;//SHRINK RESIZE_HEIGHT;
        node.label.node.setContentSize(node.Rect.w,node.Rect.h);
        node.label.fontSize = node.size;
        node.label.node.color = node.color;//new cc.color(112,112,112);
        node.label.lineHeight = 15;

        /*var labelShadow = node.node.addComponent(cc.LabelShadow);
        labelShadow.color = cc.Color.YELLOW;
        labelShadow.offset = new cc.Vec2(2, 2);*/
        
        node.LoadWellDone = true;

        node.Delete = function () {
            node.DrawNode.removeChild(node.Node);
        }
        node.SetStr = function (_str){
            node.str = _str;
            node.label.string = node.str;
        }
        node.Update = function (){
            //node.Node.setPosition(GamePublic.s_Vec2d(node.Rect.x,node.Rect.y));
            node.Node.setPosition(GamePublic.s_Vec2d(node.Rect.x - (node.main.SccenHW.Width - node.Rect.w) * 0.5,node.Rect.y - (node.main.SccenHW.Height + node.Rect.h)* 0.5));        
        }
        return node;
    }
}


module.exports = C_Text;