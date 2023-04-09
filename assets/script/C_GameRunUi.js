var GamePublic = require("./F_GamePublic");
var PageSprite = require("./C_PageBackDrop");
var ButtonSprite = require("./C_Button");
var PageCommand = require("./F_PageCommand");
var C_Text = require("./C_Text");
var PageFront = require("./C_PageFront");


var C_GameRunUi = {
    New: function(_Pos, _PageType, _RoleNumber, _SRcArray, _DesArray, _MainNode, _PageNumber) {
        var node = {};

        node.SccenPoint = GamePublic.s_Vec2d(_Pos.x, _Pos.y); //GamePublic.s_Vec2d(0,0);//起点坐标
        node.SccenHW = {};
        node.MainNode = _MainNode;
        node.PageType = _PageType;
        node.CreateDone = false;
        node.Rect = null;
        node.RoleNumber = _RoleNumber;
        node.SRcArray = _SRcArray;
        node.DesArray = _DesArray;

        node.Node = new cc.Node();
        node.PageBackDrop = null;
        node.ButtonArray = [];
        node.RoleItemArray = [];
        node.TextArray = [];
        node.PickObj = false;
        node.PickObjPage = null;
        node.StaticButton = [];
        node.DynamicButton = [];

        switch (node.PageType) {
            case 'GameRunUi':
                {
                    var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 150, y: 150 }, GamePublic.s_ButtonObjInfo("Itemimage001", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.UiStaticButton, GamePublic.e_ButtonCommand.CallMainMenu, [], null), node, { Button: true, Move: false });
                    node.StaticButton.push(Button);
                    // var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 750, y: 150 }, GamePublic.s_ButtonObjInfo("Itemimage001", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.UiStaticButton, GamePublic.e_ButtonCommand.BuildPlace, GamePublic.e_BuildName.SmallHumanBuild, null), node, { Button: true, Move: false });
                    // node.DynamicButton.push(Button);
                    break;
                }
        }

        node.CreatePage = function() {
            GamePublic.AddChild(node.MainNode, node.Node, node.PageNumber);
            node.SccenHW.Width = 0; //node.PageBackDrop.BackDropWidth;
            node.SccenHW.Height = 0; //node.PageBackDrop.BackDropHeight;
            //修正坐标

            var pos = GamePublic.s_Vec2d(node.SccenPoint.x - (node.SccenHW.Width / 2), node.SccenPoint.y - (node.SccenHW.Height / 2));
            node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.SccenHW.Width, pos.y + node.SccenHW.Height);
        }
        node.FixPos = function() {
            if (node.SccenPoint.x < node.SccenHW.Width * 0.5) node.SccenPoint.x = node.SccenHW.Width * 0.5;
            if (node.SccenPoint.y < node.SccenHW.Height * 0.5) node.SccenPoint.y = node.SccenHW.Height * 0.5;

            if (node.SccenPoint.x > GamePublic.g_winSize.width - node.SccenHW.Width * 0.5) node.SccenPoint.x = GamePublic.g_winSize.width - node.SccenHW.Width * 0.5;
            if (node.SccenPoint.y > GamePublic.g_winSize.height - node.SccenHW.Height * 0.5) node.SccenPoint.y = GamePublic.g_winSize.height - node.SccenHW.Height * 0.5;
        }

        node.Delete = function() {
            if (!node.CreateDone) return;
            node.CleanPick();
            for (var i = 0; i < node.StaticButton.length; i++) {
                node.StaticButton[i].Delete();
            }
            for (var i = 0; i < node.DynamicButton.length; i++) {
                node.DynamicButton[i].Delete();
            }
            for (var i = 0; i < node.TextArray.length; i++) {
                node.TextArray[i].Delete();
            }
            //node.PageBackDrop.Delete();
            node.StaticButton.splice(0, node.StaticButton.length);
            node.DynamicButton.splice(0, node.DynamicButton.length);
            node.TextArray.splice(0, node.TextArray.length);
            node.Node.removeAllChildren();
            node.MainNode.removeChild(node.Node);
            node.Node.destroy();
        }

        node.Update = function() {
            //if (!node.PageBackDrop.LoadWellDone) return;
            for (var i = 0; i < node.ButtonArray.length; i++) {
                if (!node.ButtonArray[i].LoadWellDone) return;
            }
            for (var i = 0; i < node.RoleItemArray.length; i++) {
                if (!node.RoleItemArray[i].LoadWellDone) return;
            }

            if (!node.CreateDone) {
                node.CreatePage();
                node.CreateDone = true;
            }

            node.FixPos();
            node.Node.setPosition(node.SccenPoint);

            for (var i = 0; i < node.StaticButton.length; i++) {
                node.StaticButton[i].Update();
            }
            for (var i = 0; i < node.DynamicButton.length; i++) {
                node.DynamicButton[i].Update();
            }
            for (var i = 0; i < node.TextArray.length; i++) {
                node.TextArray[i].Update();
            }
        }

        node.CleanPick = function() {
            //GamePublic.g_PickObj = false;
            node.PickObj = null;
            if (node.PickObjPage) {
                node.PickObjPage.Delete();
                node.PickObjPage = null;
            }
        }
        // node.ShowRoleItemArray = function() {
        //     var Role = GamePublic.g_GameDataResManger.GetRole(node.RoleNumber);
        //     for (var i = 0; i < node.StaticButton.length; i++) {
        //         node.StaticButton[i].Delete();
        //     }
        //     node.StaticButton.splice(0, node.StaticButton.length);
        //     for (var i = 0; i < node.DynamicButton.length; i++) {
        //         node.DynamicButton[i].Delete();
        //     }
        //     node.DynamicButton.splice(0, node.DynamicButton.length);

        //     for (var i = 0; i < node.TextArray.length; i++) {
        //         node.TextArray[i].Delete();
        //     }
        //     node.TextArray.splice(0, node.TextArray.length);
        //     switch (node.PageType) {
        //         case 'GameRunUi':
        //             {
        //                 var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 50, y: 50 }, GamePublic.s_ButtonObjInfo("Itemimage001", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.UiStaticButton, GamePublic.e_ButtonCommand.ClosePage, [], null), node, { Button: true, Move: false });
        //                 node.StaticButton.push(Button);
        //                 break;
        //             }
        //     }
        // }

        node.ClickCheck = function(_pos, _ClickType) {
            var pos = GamePublic.s_Vec2d(_pos.x - node.Rect.x, _pos.y - node.Rect.y);
            switch (_ClickType) {
                case GamePublic.e_ClickType.LeftDown:
                    /* for (var i = 0; i < node.RoleItemArray.length; i++) {
                        if (node.RoleItemArray[i].ClickType.Button && node.RoleItemArray[i].ButtonInfo.ObjInfo.Image != "Itemimage000" && GamePublic.CollideRect(pos, node.RoleItemArray[i].Rect)) {
                            if (node.RoleItemArray[i].ClickType.Move) { //支持拖放
                                //node.PickObj = GamePublic.PickObj(GamePublic.e_PickType.BagItem, i);
                                node.PickObj = GamePublic.PickObj(node.RoleItemArray[i].ButtonInfo.BarType, i);
                                GamePublic.g_PickObj = true;
                                if (node.PickObjPage) node.PickObjPage.Delete();
                                node.PickObjPage = PageFront.New(node.RoleItemArray[i].ButtonInfo.ObjInfo.Image, node, pos, null, null, null, null);
                            }
                            return true;
                        }
                    } */
                    break;
                case GamePublic.e_ClickType.LeftUp:

                    break;
                case GamePublic.e_ClickType.Move:

                    break;
            }

            for (var i = 0; i < node.StaticButton.length; i++) {
                if (node.StaticButton[i].ClickType.Button && !GamePublic.g_MouseMoveFlag && GamePublic.CollideRect(pos, node.StaticButton[i].Rect)) {
                    switch (_ClickType) {
                        case GamePublic.e_ClickType.LeftUp:
                            PageCommand.PageCommandProc(node.StaticButton[i].ButtonInfo);
                            return true;
                    }
                }
            }
            for (var i = 0; i < node.DynamicButton.length; i++) {
                if (node.DynamicButton[i].ClickType.Button && !GamePublic.g_MouseMoveFlag && GamePublic.CollideRect(pos, node.DynamicButton[i].Rect)) {
                    switch (_ClickType) {
                        case GamePublic.e_ClickType.LeftUp:
                            PageCommand.PageCommandProc(node.DynamicButton[i].ButtonInfo);
                            return true;
                    }
                }
            }
            return false;
        }

        return node;
    }
}

module.exports = C_GameRunUi;