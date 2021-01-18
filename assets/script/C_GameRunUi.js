var GamePublic = require("./F_GamePublic");
var PageSprite = require("./C_PageBackDrop");
var ButtonSprite = require("./C_Button");
var PageCommand = require("./F_PageCommand");
var C_Text = require("./C_Text");
var PageFront = require("./C_PageFront");


var C_GameRunUi = {
    New: function (_Pos, _PageType, _RoleNumber, _SRcArray, _DesArray, _MainNode, _PageNumber) {
        var node = {};

        node.SccenPoint = GamePublic.s_Vec2d(_Pos.x, _Pos.y);//GamePublic.s_Vec2d(0,0);//起点坐标
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
            case 'GameRunUi':{
                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 150, y: 150 }, GamePublic.s_ButtonObjInfo("Itemimage001", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.UiStaticButton, GamePublic.e_ButtonCommand.CallMainMenu, [], null), node, { Button: true, Move: false });
                node.StaticButton.push(Button);
                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 750, y: 150 }, GamePublic.s_ButtonObjInfo("Itemimage001", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.UiStaticButton, GamePublic.e_ButtonCommand.BuildPlace,GamePublic.e_BuildName.SmallHumanBuild, null), node, { Button: true, Move: false });
                node.DynamicButton.push(Button);
                break;
            }
        }

        node.CreatePage = function () {
            GamePublic.AddChild(node.MainNode, node.Node, node.PageNumber);
            node.SccenHW.Width = 0;//node.PageBackDrop.BackDropWidth;
            node.SccenHW.Height = 0;//node.PageBackDrop.BackDropHeight;
            //修正坐标

            var pos = GamePublic.s_Vec2d(node.SccenPoint.x - (node.SccenHW.Width / 2), node.SccenPoint.y - (node.SccenHW.Height / 2));
            node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.SccenHW.Width, pos.y + node.SccenHW.Height);
        }
        node.FixPos = function () {
            if (node.SccenPoint.x < node.SccenHW.Width * 0.5) node.SccenPoint.x = node.SccenHW.Width * 0.5;
            if (node.SccenPoint.y < node.SccenHW.Height * 0.5) node.SccenPoint.y = node.SccenHW.Height * 0.5;

            if (node.SccenPoint.x > GamePublic.g_winSize.width - node.SccenHW.Width * 0.5) node.SccenPoint.x = GamePublic.g_winSize.width - node.SccenHW.Width * 0.5;
            if (node.SccenPoint.y > GamePublic.g_winSize.height - node.SccenHW.Height * 0.5) node.SccenPoint.y = GamePublic.g_winSize.height - node.SccenHW.Height * 0.5;
        }

        node.Delete = function () {
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

        node.Update = function () {
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

        node.CleanPick = function () {
            //GamePublic.g_PickObj = false;
            node.PickObj = null;
            if (node.PickObjPage) {
                node.PickObjPage.Delete();
                node.PickObjPage = null;
            }
        }
        node.ShowRoleItemArray = function () {
            var Role = GamePublic.g_GameDataResManger.GetRole(node.RoleNumber);
            for (var i = 0; i < node.StaticButton.length; i++) {
                node.StaticButton[i].Delete();
            }
            node.StaticButton.splice(0, node.StaticButton.length);
            for (var i = 0; i < node.DynamicButton.length; i++) {
                node.DynamicButton[i].Delete();
            }
            node.DynamicButton.splice(0, node.DynamicButton.length);

            for (var i = 0; i < node.TextArray.length; i++) {
                node.TextArray[i].Delete();
            }
            node.TextArray.splice(0, node.TextArray.length);
            switch (node.PageType) {
                case 'GameRunUi':{
                    var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 50, y: 50 }, GamePublic.s_ButtonObjInfo("Itemimage001", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.UiStaticButton, GamePublic.e_ButtonCommand.ClosePage, [], null), node, { Button: true, Move: false });
                    node.StaticButton.push(Button);
                    break;
                }
            }
        }

        node.ClickCheck = function (_pos, _ClickType) {
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
                    /* for (var i = 0; i < node.RoleItemArray.length; i++) {
                        if (node.RoleItemArray[i].ClickType.Button && GamePublic.CollideRect(pos, node.RoleItemArray[i].Rect)) {
                            if (node.PickObj && node.PickObj.PickNum != i) {
                                var Role = GamePublic.g_GameDataResManger.GetRole(node.RoleNumber);
                                var BarNum = node.RoleItemArray[i].ButtonInfo.BarNum;
                                var PickBarNum = node.RoleItemArray[node.PickObj.PickNum].ButtonInfo.BarNum;
                                var item = null;
                                switch (node.PageType) {
                                    case 'RoleItemPage': {
                                        switch (node.RoleItemArray[i].ButtonInfo.BarType) {
                                            case GamePublic.e_BarType.ItemBar:
                                                if (node.PickObj.PickType == GamePublic.e_BarType.ItemBar) {
                                                    if (Role.RoleInfo.v_RoleBag[BarNum]) {
                                                        item = Role.RoleInfo.v_RoleBag[BarNum];
                                                        if (item.Name == Role.RoleInfo.v_RoleBag[PickBarNum].Name) { //相同物品合并
                                                            item.ItemNum += Role.RoleInfo.v_RoleBag[PickBarNum].ItemNum;
                                                            Role.RoleInfo.v_RoleBag[PickBarNum].ItemNum = null;
                                                        } else {
                                                            Role.RoleInfo.v_RoleBag[BarNum] = Role.RoleInfo.v_RoleBag[PickBarNum];
                                                            Role.RoleInfo.v_RoleBag[PickBarNum] = item;
                                                        }

                                                    } else {
                                                        Role.RoleInfo.v_RoleBag[BarNum] = Role.RoleInfo.v_RoleBag[PickBarNum];
                                                        Role.RoleInfo.v_RoleBag[PickBarNum] = null;
                                                    }

                                                }
                                                if (node.PickObj.PickType == GamePublic.e_BarType.EquipBar) {
                                                    if (!Role.RoleInfo.v_RoleBag[BarNum]) {
                                                        GamePublic.g_ItemManager.RoleUnEquip(Role.RoleInfo.v_RoleNumber, PickBarNum, BarNum);
                                                    }
                                                    console.log("卸装备");
                                                }
                                                break;
                                            case GamePublic.e_BarType.EquipBar:
                                                if (node.PickObj.PickType == GamePublic.e_BarType.ItemBar) {
                                                    item = Role.RoleInfo.v_RoleBag[PickBarNum];
                                                    if (item.EquipType == BarNum) { //匹配格子
                                                        console.log("装备");
                                                        GamePublic.g_ItemManager.RoleEquip(Role.RoleInfo.v_RoleNumber, PickBarNum);
                                                    } else {
                                                        console.log("不匹配格子");
                                                    }
                                                }
                                                if (node.PickObj.PickType == GamePublic.e_BarType.EquipBar) {
                                                    console.log("无法移动装备");
                                                }
                                                break;
                                        }
                                        break;
                                    }
                                    case 'RoleAndShopTradePage': {
                                        var Bag = null;
                                        var PickBag = null;
                                        //var BagNum = 0;
                                        switch (node.RoleItemArray[i].ButtonInfo.BarType) {
                                            case GamePublic.e_BarType.ItemBar:
                                                Bag = Role.RoleInfo.v_RoleBag;
                                                switch (node.PickObj.PickType) {
                                                    case GamePublic.e_BarType.ItemBar:
                                                        PickBag = Bag;
                                                        if (Bag[BarNum]) {
                                                            item = Bag[BarNum];
                                                            if (item.Name == PickBag[PickBarNum].Name) {
                                                                item.ItemNum += PickBag[PickBarNum].ItemNum;
                                                                PickBag[PickBarNum].ItemNum = null;
                                                            } else {
                                                                Bag[BarNum] = PickBag[PickBarNum];
                                                                PickBag[PickBarNum] = item;
                                                            }

                                                        } else {
                                                            Bag[BarNum] = PickBag[PickBarNum];
                                                            PickBag[PickBarNum] = null;
                                                        }
                                                        break;
                                                    case GamePublic.e_BarType.ShopStoreBar: {
                                                        PickBag = GamePublic.g_ShopManager.GetStore(Role.RoleCommand.v_RoleTradeShopNum).ItemBar;
                                                        GamePublic.g_ShopManager.ShopTradeCalc(PickBag, PickBarNum, Bag, BarNum, 1);
                                                        break;
                                                    }
                                                }
                                                break;
                                            case GamePublic.e_BarType.ShopStoreBar:
                                                Bag = GamePublic.g_ShopManager.GetStore(Role.RoleCommand.v_RoleTradeShopNum).ItemBar;
                                                switch (node.PickObj.PickType) {
                                                    case GamePublic.e_BarType.ItemBar:
                                                        PickBag = Role.RoleInfo.v_RoleBag;
                                                        GamePublic.g_ShopManager.ShopTradeCalc(PickBag, PickBarNum, Bag, BarNum, 1);
                                                        break;
                                                    case GamePublic.e_BarType.ShopStoreBar:
                                                        PickBag = GamePublic.g_ShopManager.GetStore(Role.RoleCommand.v_RoleTradeShopNum).ItemBar;
                                                        if (Bag[BarNum]) item = Bag[BarNum];
                                                        Bag[BarNum] = PickBag[PickBarNum];
                                                        PickBag[PickBarNum] = item;
                                                        break;
                                                }
                                                break;
                                        }
                                    }
                                }

                                node.ShowRoleItemArray();
                            }
                            return true;
                        }
                    } */
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
                            break;
                    }
                }
            }
            for (var i = 0; i < node.DynamicButton.length; i++) {
                if (node.DynamicButton[i].ClickType.Button && !GamePublic.g_MouseMoveFlag && GamePublic.CollideRect(pos, node.DynamicButton[i].Rect)) {
                    switch (_ClickType) {
                        case GamePublic.e_ClickType.LeftUp:
                            PageCommand.PageCommandProc(node.DynamicButton[i].ButtonInfo);
                            return true;
                            break;
                    }
                }
            }
            return false;
        }

        return node;
    }
}

module.exports = C_GameRunUi;