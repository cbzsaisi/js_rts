var GamePublic = require("./F_GamePublic");
var PageSprite = require("./C_PageBackDrop");
var ButtonSprite = require("./C_Button");
var MenuCommand = require("./F_MenuCommand");
//var C_Text = require("./C_Text");



var C_MenuButton = {
    New: function (_MenuInfo, _MainPage) {
        var node = {};

        node.MainPage = _MainPage;
        node.ButtonWidth = null;
        node.ButtonHeight = null;
        node.LoadWellDone = false;
        node.Node = new cc.Node();
        node.ShowSelectNode = new cc.Node();
        node.ShowSelectFlag = false;
        node.ShowSelect = node.ShowSelectNode.addComponent(cc.Graphics);
        node.MenuInfo = _MenuInfo;
        //node.ClickType = _ClickType;
        node.Rect = GamePublic.s_Rect(node.MenuInfo.Pos.x, node.MenuInfo.Pos.y, node.MainPage.MenuButtonWidth, node.MainPage.MenuButtonHeight);

        node.Delete = function () {
            node.ShowSelectNode.removeChild(node.Node);
            node.MainPage.Node.removeChild(node.ShowSelectNode);
            node.Node.destroy();
        }
        node.Update = function () {
            node.Rect.x = node.MenuInfo.Pos.x;
            node.Rect.y = node.MenuInfo.Pos.y - node.MainPage.SccenHW.Height / 2 + ((node.MainPage.MenuButtonNumber - node.MenuInfo.number - 0.5) * node.MainPage.MenuButtonHeight);
            //node.Rect.y = node.MenuInfo.Pos.y + ((node.MainPage.MenuButtonHeight) * (node.MainPage.MenuButtonNumber / 2 - 0.5)) - (node.MenuInfo.number * node.MainPage.MenuButtonHeight);
            node.Rect.w = node.Rect.x + node.MainPage.MenuButtonWidth;
            node.Rect.h = node.Rect.y + node.MainPage.MenuButtonHeight+1;
            node.ShowSelectNode.setPosition(node.Rect.x, node.Rect.y);//(node.MainPage.MenuButtonNumber/2)));

            node.ShowSelect.clear();
            if (node.ShowSelectFlag) {
                //node.ShowSelect.lineWidth = 1;
                //node.ShowSelect.strokeColor = cc.Color.RED;
                node.ShowSelect.fillColor = cc.color(255, 255, 255, 95);
                node.ShowSelect.rect(-node.MainPage.MenuButtonWidth / 2, -node.MainPage.MenuButtonHeight / 2, node.MainPage.MenuButtonWidth, node.MainPage.MenuButtonHeight);
                node.ShowSelect.fill();
                node.ShowSelect.stroke();
            }
        }

        var label = node.Node.addComponent(cc.Label);
        label.string = node.MenuInfo.Str;
        //label.verticalAlign = cc.Label.VerticalAlign.TOP;
        //label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        label.fontSize = 13;
        label.node.color = cc.color(255, 255, 255, 255);//new cc.color(112,112,112);
        label.lineHeight = 13;
        //var labelShadow = node.Node.addComponent(cc.LabelShadow);
        //var outline = node.Node.addComponent(cc.LabelOutline);

        node.ShowSelectNode.addChild(node.Node);
        node.MainPage.Node.addChild(node.ShowSelectNode, 10);

        node.LoadWellDone = true;
        return node;
    }
}


var C_Menu = {
    New: function (_Pos, _MenuType, _ObjArray, _MainNode, _MenuNumber) {
        var node = {};

        node.SccenPoint = GamePublic.s_Vec2d(_Pos.x, _Pos.y);//GamePublic.s_Vec2d(0,0);//起点坐标
        node.SccenHW = {};//GamePublic.s_Vec2d(0,0);//页面长宽
        node.MainNode = _MainNode;
        node.MenuType = _MenuType;
        node.MenuNumber = _MenuNumber;
        node.CreateDone = false;
        node.Rect = null;
        node.MenuButtonNumber = 0;
        node.MenuButtonHeight = 20;
        node.MenuButtonWidth = 100;

        node.Node = new cc.Node();

        //node.MenuBackDrop = PageSprite.New("StatePage",node.Node,{x:0,y:0});
        node.MenuBackDrop = node.Node.addComponent(cc.Graphics);

        node.ObjArray = [];

        node.CreatePage = function () {
            node.MainNode.addChild(node.Node, node.MenuNumber);

            //node.SccenHW.Width = node.MenuBackDrop.BackDropWidth = node.MenuBackDrop.Node.height;
            //node.SccenHW.Height = node.MenuBackDrop.BackDropHeight = node.MenuBackDrop.Node.width;

            //var Text = C_Text.New(GamePublic.s_Rect(0,0,100,20),"1test",cc.Color.WHITE,13,node,false);
            //node.ObjArray.push(Text);

            var MenuButton = C_MenuButton.New(GamePublic.s_MenuInfo({ x: 0, y: 0 }, "物品栏", "close", node.MenuNumber, node.MenuButtonNumber++, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.CallRoleItemPage, [1], [], [], false), node);
            node.ObjArray.push(MenuButton);

            var MenuButton2 = C_MenuButton.New(GamePublic.s_MenuInfo({ x: 0, y: 0 }, "角色属性", "close", node.MenuNumber, node.MenuButtonNumber++, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.CallRoleStatePage, [1], [], [], false), node);
            node.ObjArray.push(MenuButton2);

            var MenuButton3 = C_MenuButton.New(GamePublic.s_MenuInfo({ x: 0, y: 0 }, "商店交易", "close", node.MenuNumber, node.MenuButtonNumber++, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.CallRoleAndShopTradePage, [1], [], [], false), node);
            node.ObjArray.push(MenuButton3);
            var MenuButton4 = C_MenuButton.New(GamePublic.s_MenuInfo({ x: 0, y: 0 }, "测试测试测试测试", "close", node.MenuNumber, node.MenuButtonNumber++, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.CloseMenu, [1], [], [], false), node);
            node.ObjArray.push(MenuButton4);


            //修正坐标

            //node.SccenHW.Height = node.MenuBackDrop.Node.height = node.MenuButtonHeight * node.MenuButtonNumber;
            //node.SccenHW.Width = node.MenuBackDrop.Node.width = node.MenuButtonWidth;

            node.SccenHW.Height = node.MenuButtonHeight * node.MenuButtonNumber;
            node.SccenHW.Width = node.MenuButtonWidth;

            var pos = GamePublic.s_Vec2d(node.SccenPoint.x - (node.SccenHW.Width / 2), node.SccenPoint.y - (node.SccenHW.Height / 2));
            node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.SccenHW.Width, pos.y + node.SccenHW.Height);

        }
        node.FixPos = function () {
        }

        node.Delete = function () {
            for (var i = 0; i < node.ObjArray.length; i++) {
                node.ObjArray[i].Delete();
            }
            node.MainNode.removeChild(node.Node);
            node.Node.destroy();
        }

        node.Update = function () {
            //if(!node.MenuBackDrop.LoadWellDone)return;
            for (var i = 0; i < node.ObjArray.length; i++) {
                if (!node.ObjArray[i].LoadWellDone) return;
            }

            if (!node.CreateDone) {
                node.CreatePage();
                node.CreateDone = true;
            }

            //node.FixPos();
            node.Node.setPosition(node.SccenPoint);

            for (var i = 0; i < node.ObjArray.length; i++) {
                node.ObjArray[i].Update();
            }
            node.MenuBackDrop.clear();
            node.MenuBackDrop.fillColor = cc.color(155, 25, 155, 255);
            node.MenuBackDrop.rect(-node.MenuButtonWidth / 2, -node.MenuButtonHeight * node.MenuButtonNumber / 2, node.MenuButtonWidth, node.MenuButtonHeight * node.MenuButtonNumber);
            node.MenuBackDrop.fill();
            node.MenuBackDrop.stroke();
        }

        node.ClickCheck = function (_pos,_ClickType) {
            var flag = false;
            var pos = GamePublic.s_Vec2d(_pos.x - node.Rect.x, _pos.y - node.Rect.y - node.SccenHW.Height / 2 + node.MenuButtonHeight / 2);
            for (var i = 0; i < node.ObjArray.length; i++) {
                if (node.ObjArray[i].MenuInfo.Menutype == GamePublic.e_Buttontype.PageButton && GamePublic.CollideRect(pos, node.ObjArray[i].Rect)) {
                    switch(_ClickType){
                        case GamePublic.e_ClickType.LeftUp:
                        MenuCommand.MenuCommandProc(node.ObjArray[i].MenuInfo);
                        break;
                        case GamePublic.e_ClickType.Move:
                        node.ObjArray[i].ShowSelectFlag = true;
                        break;
                    }
                    flag = true;
                } else {
                    node.ObjArray[i].ShowSelectFlag = false;
                }
            }
            return flag;
        }

        /* node.MoveCheck = function (_pos) {
            var flag = false;
            var pos = GamePublic.s_Vec2d(_pos.x - node.Rect.x, _pos.y - node.Rect.y - node.SccenHW.Height / 2 + node.MenuButtonHeight / 2);
            for (var i = 0; i < node.ObjArray.length; i++) {
                if (node.ObjArray[i].ClickType.Button && GamePublic.CollideRect(pos, node.ObjArray[i].Rect)) {
                    node.ObjArray[i].ShowSelectFlag = true;
                    //PageCommand.PageCommandProc(node.ObjArray[i].MenuInfo);
                    flag = true;
                } else {
                    node.ObjArray[i].ShowSelectFlag = false;
                }
            }
            return flag;
        } */

        return node;
    }
}

module.exports = C_Menu;