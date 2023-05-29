var GamePublic = require("./F_GamePublic");
var PageSprite = require("./C_PageBackDrop");
var ButtonSprite = require("./C_Button");
var PageCommand = require("./F_PageCommand");
var C_Text = require("./C_Text");
var PageFront = require("./C_PageFront");

var C_Page = {
    New: function (_Pos, _PageType, _RoleNumber, _SRcArray, _DesArray, _MainNode, _PageNumber) {
        var node = {};
        node.SccenPoint = GamePublic.s_Vec2d(_Pos.x, _Pos.y);//GamePublic.s_Vec2d(0,0);//起点坐标
        node.SccenHW = {};//GamePublic.s_Vec2d(0,0);//页面长宽
        node.MainNode = _MainNode;
        node.PageType = _PageType;
        node.PageNumber = _PageNumber;
        node.CreateDone = false;
        node.Rect = null;
        for (var i = 0; i < _RoleNumber.length; i++){
            node.RoleNumber = _RoleNumber[i];
        }
        node.SRcArray = _SRcArray;
        node.DesArray = _DesArray;
        node.Node = new cc.Node();
        node.PageBackDrop = null;
        node.ButtonArray = [];
        node.RoleItemArray = [];
        node.TextArray = [];
        node.PickObj = false;
        node.PickObjPage = null;
        var CloseButton = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 0, y: 0 }, GamePublic.s_ButtonObjInfo("close", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], null), node, { Button: true, Move: false });

        switch (node.PageType) {
            case 'RoleItemPage': {
                var Role = GamePublic.g_GameDataResManger.GetRole(node.RoleNumber);
                if (!Role) return null;
                node.PageBackDrop = PageSprite.New("StatePage", node, { x: 0, y: 0 }, cc.color(215, 215, 215, 255), { w: 400, h: 400 });
                node.ButtonArray.push(CloseButton);
                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: 200, y: 0 }, GamePublic.s_ButtonObjInfo("close", "关闭", 0, "关闭"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.CallInputValuePage, [1], null), node, { Button: true, Move: false });
                node.ButtonArray.push(Button);
                var offx = 100; var offy = 150; var offw = 50; var offh = 40;
                for (var i = 0; i < Role.Info.v_RoleBagSize / 5; i++) {
                    for (var j = 0; j < 5; j++) {
                        var roleitem = Role.Info.v_RoleBag[i * 5 + j];
                        if (roleitem) {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo(roleitem.ImgName, roleitem.ItemName, roleitem.ItemNum, roleitem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button);
                        } else {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button); //node.RoleItemArray[i]= Button;
                        }
                    }
                }
                var offx = 50; var offy = 250; var offw = 50; var offh = 40;
                for (var i = 0; i < 7; i++) {
                    var roleitem = Role.Info.v_RoleEquip[i];
                    if (roleitem) {
                        var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * i, y: offy + offh }, GamePublic.s_ButtonObjInfo(roleitem.ImgName, roleitem.ItemName, roleitem.ItemNum, roleitem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.EquipBar, i), node, { Button: true, Move: true });
                        node.RoleItemArray.push(Button);
                    } else {
                        var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * i, y: offy + offh }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.EquipBar, i), node, { Button: true, Move: true });
                        node.RoleItemArray.push(Button); //node.RoleItemArray[i]= Button;
                    }
                }
                break;
            }
            case 'RoleAndShopTradePage': {
                var Role = GamePublic.g_GameDataResManger.GetRole(node.RoleNumber);
                if (!Role) return null;
                node.PageBackDrop = PageSprite.New("StatePage", node, { x: 0, y: 0 }, cc.color(215, 215, 215, 255), { w: 400, h: 400 });
                node.ButtonArray.push(CloseButton);
                var offx = 100; var offy = 150; var offw = 50; var offh = 40;
                for (var i = 0; i < Role.Info.v_RoleBagSize / 5; i++) {
                    for (var j = 0; j < 5; j++) {
                        var roleitem = Role.Info.v_RoleBag[i * 5 + j];
                        if (roleitem) {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo(roleitem.ImgName, roleitem.ItemName, roleitem.ItemNum, roleitem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button);
                        } else {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button); //node.RoleItemArray[i]= Button;
                        }
                    }
                }
                var offx = 100; var offy = 350; var offw = 50; var offh = 40;
                var Store = GamePublic.g_ShopManager.GetStore(Role.Command.v_RoleTradeShopNum);
                for (var i = 0; i < Store.ItemBar.length / 5; i++) {
                    for (var j = 0; j < 5; j++) {
                        var StoreItem = Store.ItemBar[i * 5 + j];
                        if (StoreItem) {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo(StoreItem.ImgName, StoreItem.ItemName, StoreItem.ItemNum, StoreItem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ShopStoreBar, i * 5 + j), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button);
                        } else {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ShopStoreBar, i * 5 + j), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button); //node.RoleItemArray[i]= Button;
                        }
                    }
                }
                break;
            }
            case 'RoleStatePage': {
                node.PageBackDrop = PageSprite.New("StatePage", node, { x: 0, y: 0 }, null, null);
                node.ButtonArray.push(CloseButton);
                var Text = C_Text.New(GamePublic.s_Rect(50, 200, 200, 120), "1test 测试 2test 测试 3test 测试 4test 测试 5test 测试 6test 测试", cc.Color.WHITE, 13, node, node.Node, false);
                node.ButtonArray.push(Text);
                break;
            }
            case 'InputValuePage': {
                GamePublic.g_InputNumber = 0;
                node.PageBackDrop = PageSprite.New("StatePage", node, { x: 0, y: 0 }, cc.color(215, 215, 215, 255), { w: 300, h: 200 });
                node.ButtonArray.push(CloseButton);
                var offx = 80; var offy = 80; var offw = 100; var offh = 50;
                for (var i = 0; i < 2; i++) {
                    for (var j = 0; j < 5; j++) {
                    var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo("maptile003", "0", 0, "0"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.InputNumber0 + (i * 5 + j), [], null), node, { Button: true, Move: false });
                    node.ButtonArray.push(Button);
                    }
                }
                var Text = C_Text.New(GamePublic.s_Rect(100, 200, 200, 120),GamePublic.g_InputNumber, cc.Color.WHITE, 18, node, node.Node, false);
                node.TextArray.push(Text);
                break;
            }
        }
        if (!node.PageBackDrop) console.log(node.PageType + "无对应页面背景");

        node.CreatePage = function () {
            //node.MainNode.addChild(node.Node,node.PageNumber);
            GamePublic.AddChild(node.MainNode, node.Node, node.PageNumber);
            node.SccenHW.Width = node.PageBackDrop.BackDropWidth;
            node.SccenHW.Height = node.PageBackDrop.BackDropHeight;
            //修正坐标
            var pos = GamePublic.s_Vec2d(node.SccenPoint.x - (node.SccenHW.Width / 2), node.SccenPoint.y - (node.SccenHW.Height / 2));
            node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.SccenHW.Width, pos.y + node.SccenHW.Height);
            //let txt = new cc.Node;
            //let label = txt.addComponent(cc.Label);
            //let label = node.Node.addComponent(cc.Label);
            //label.string = "test测试";
            //label.node.zIndex = 10;
            //node.MainNode.addChild(txt,30);
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
            for (var i = 0; i < node.ButtonArray.length; i++) {
                node.ButtonArray[i].Delete();
            }
            for (var i = 0; i < node.RoleItemArray.length; i++) {
                node.RoleItemArray[i].Delete();
            }
            for (var i = 0; i < node.TextArray.length; i++) {
                node.TextArray[i].Delete();
            }
            node.PageBackDrop.Delete();
            node.ButtonArray.splice(0, node.ButtonArray.length);
            node.RoleItemArray.splice(0, node.RoleItemArray.length);
            node.TextArray.splice(0, node.TextArray.length);
            node.Node.removeAllChildren();
            node.MainNode.removeChild(node.Node);
            node.Node.destroy();
        }

        node.Update = function () {
            if (!node.PageBackDrop.LoadWellDone) return;
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

            for (var i = 0; i < node.ButtonArray.length; i++) {
                node.ButtonArray[i].Update();
            }
            for (var i = 0; i < node.RoleItemArray.length; i++) {
                node.RoleItemArray[i].Update();
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
            for (var i = 0; i < node.RoleItemArray.length; i++) {
                node.RoleItemArray[i].Delete();
            }
            node.RoleItemArray.splice(0, node.RoleItemArray.length);

            for (var i = 0; i < node.TextArray.length; i++) {
                node.TextArray[i].Delete();
            }
            node.TextArray.splice(0, node.TextArray.length);

            switch (node.PageType) {
                case 'RoleItemPage': {
                    var offx = 100; var offy = 150; var offw = 50; var offh = 40;
                    for (var i = 0; i < Role.Info.v_RoleBagSize / 5; i++) {
                        for (var j = 0; j < 5; j++) {
                            var roleitem = Role.Info.v_RoleBag[i * 5 + j];
                            if (roleitem) {
                                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo(roleitem.ImgName, roleitem.ItemName, roleitem.ItemNum, roleitem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                                node.RoleItemArray.push(Button);
                            } else {
                                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                                node.RoleItemArray.push(Button);
                            }
                        }
                    }
                    var offx = 50; var offy = 250; var offw = 50; var offh = 40;
                    for (var i = 0; i < 7; i++) {
                        var roleitem = Role.Info.v_RoleEquip[i];
                        if (roleitem) {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * i, y: offy + offh }, GamePublic.s_ButtonObjInfo(roleitem.ImgName, roleitem.ItemName, roleitem.ItemNum, roleitem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.EquipBar, i), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button);
                        } else {
                            var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * i, y: offy + offh }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.EquipBar, i), node, { Button: true, Move: true });
                            node.RoleItemArray.push(Button);
                        }
                    }
                    break;
                }
                case 'RoleAndShopTradePage': {
                    var offx = 100; var offy = 150; var offw = 50; var offh = 40;
                    for (var i = 0; i < Role.Info.v_RoleBagSize / 5; i++) {
                        for (var j = 0; j < 5; j++) {
                            var roleitem = Role.Info.v_RoleBag[i * 5 + j];
                            if (roleitem) {
                                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo(roleitem.ImgName, roleitem.ItemName, roleitem.ItemNum, roleitem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                                node.RoleItemArray.push(Button);
                            } else {
                                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ItemBar, i * 5 + j), node, { Button: true, Move: true });
                                node.RoleItemArray.push(Button); //node.RoleItemArray[i]= Button;
                            }
                        }
                    }
                    var offx = 100; var offy = 350; var offw = 50; var offh = 40;
                    var Store = GamePublic.g_ShopManager.GetStore(Role.Command.v_RoleTradeShopNum);
                    for (var i = 0; i < Store.ItemBar.length / 5; i++) {
                        for (var j = 0; j < 5; j++) {
                            var StoreItem = Store.ItemBar[i * 5 + j];
                            if (StoreItem) {
                                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo(StoreItem.ImgName, StoreItem.ItemName, StoreItem.ItemNum, StoreItem.Describe), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ShopStoreBar, i * 5 + j), node, { Button: true, Move: true });
                                node.RoleItemArray.push(Button);
                            } else {
                                var Button = ButtonSprite.New(GamePublic.s_ButtonInfo({ x: offx + offw * j, y: offy + offh * -i }, GamePublic.s_ButtonObjInfo("Itemimage000", "空", 0, "空"), node.PageNumber, GamePublic.e_Buttontype.PageButton, GamePublic.e_ButtonCommand.ClosePage, [], GamePublic.e_BarType.ShopStoreBar, i * 5 + j), node, { Button: true, Move: true });
                                node.RoleItemArray.push(Button); //node.RoleItemArray[i]= Button;
                            }
                        }
                    }
                    break;
                }
                case 'InputValuePage': {
                    var offx = 80; var offy = 80; var offw = 100; var offh = 50;
                    var Text = C_Text.New(GamePublic.s_Rect(100, 200, 200, 120),GamePublic.g_InputNumber, cc.Color.WHITE, 18, node, node.Node, false);
                    node.TextArray.push(Text);
                    Text.Update();
                    break;
                }
            }
        }

        node.ClickCheck = function (_pos, _ClickType) {
            var pos = GamePublic.s_Vec2d(_pos.x - node.Rect.x, _pos.y - node.Rect.y);
            /* if (node.PickObjPage && _ClickType == GamePublic.e_ClickType.Move) {
                node.PickObjPage.SetPos(pos); //拖放物品
                return true;
            } */
            switch (_ClickType) {
                case GamePublic.e_ClickType.LeftDown:{
                    for (var i = 0; i < node.RoleItemArray.length; i++) {
                        if (node.RoleItemArray[i].ClickType.Button && node.RoleItemArray[i].ButtonInfo.ObjInfo.Image != "Itemimage000" && GamePublic.CollideRect(pos, node.RoleItemArray[i].Rect)) {
                            if (node.RoleItemArray[i].ClickType.Move) { //支持拖放
                                //node.PickObj = GamePublic.PickObj(GamePublic.e_PickType.BagItem, i);
                                node.PickObj = GamePublic.PickObj(node.RoleItemArray[i].ButtonInfo.BarType, i);
                                //GamePublic.g_PickObj = true;
                                if (node.PickObjPage) node.PickObjPage.Delete();
                                node.PickObjPage = PageFront.New(node.RoleItemArray[i].ButtonInfo.ObjInfo.Image, node, pos, null, null, null, null);
                            }
                            return true;
                        }
                    }
                    break;
                }
                case GamePublic.e_ClickType.LeftUp:{
                    for (var i = 0; i < node.RoleItemArray.length; i++) {
                        if (node.RoleItemArray[i].ClickType.Button && GamePublic.CollideRect(pos, node.RoleItemArray[i].Rect)) {
                            if (node.PickObj && node.PickObj.PickNum != i) {
                                var BarNum = node.RoleItemArray[i].ButtonInfo.BarNum;
                                var PickBarNum = node.RoleItemArray[node.PickObj.PickNum].ButtonInfo.BarNum;
                                var item = null;
                                var Role = GamePublic.g_GameDataResManger.GetRole(node.RoleNumber);
                                switch (node.PageType) {
                                    case 'RoleItemPage': {
                                        switch (node.RoleItemArray[i].ButtonInfo.BarType) {
                                            case GamePublic.e_BarType.ItemBar:
                                                if (node.PickObj.PickType == GamePublic.e_BarType.ItemBar) {
                                                    if (Role.Info.v_RoleBag[BarNum]) {
                                                        item = Role.Info.v_RoleBag[BarNum];
                                                        if (item.Name == Role.Info.v_RoleBag[PickBarNum].Name) { //相同物品合并
                                                            item.ItemNum += Role.Info.v_RoleBag[PickBarNum].ItemNum;
                                                            Role.Info.v_RoleBag[PickBarNum].ItemNum = null;
                                                        } else {
                                                            Role.Info.v_RoleBag[BarNum] = Role.Info.v_RoleBag[PickBarNum];
                                                            Role.Info.v_RoleBag[PickBarNum] = item;
                                                        }

                                                    } else {
                                                        Role.Info.v_RoleBag[BarNum] = Role.Info.v_RoleBag[PickBarNum];
                                                        Role.Info.v_RoleBag[PickBarNum] = null;
                                                    }
                                                }
                                                if (node.PickObj.PickType == GamePublic.e_BarType.EquipBar) {
                                                    if (!Role.Info.v_RoleBag[BarNum]) {
                                                        GamePublic.g_ItemManager.RoleUnEquip(Role.Info.v_RoleNumber, PickBarNum, BarNum);
                                                    }
                                                    console.log("卸装备");
                                                }
                                                break;
                                            case GamePublic.e_BarType.EquipBar:
                                                if (node.PickObj.PickType == GamePublic.e_BarType.ItemBar) {
                                                    item = Role.Info.v_RoleBag[PickBarNum];
                                                    if (item.EquipType == BarNum) { //匹配格子
                                                        console.log("装备");
                                                        GamePublic.g_ItemManager.RoleEquip(Role.Info.v_RoleNumber, PickBarNum);
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
                                                Bag = Role.Info.v_RoleBag;
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
                                                        PickBag = GamePublic.g_ShopManager.GetStore(Role.Command.v_RoleTradeShopNum).ItemBar;
                                                        GamePublic.g_ShopManager.ShopTradeCalc(PickBag, PickBarNum, Bag, BarNum, 1);
                                                        break;
                                                    }
                                                }
                                                break;
                                            case GamePublic.e_BarType.ShopStoreBar:
                                                Bag = GamePublic.g_ShopManager.GetStore(Role.Command.v_RoleTradeShopNum).ItemBar;
                                                switch (node.PickObj.PickType) {
                                                    case GamePublic.e_BarType.ItemBar:
                                                        PickBag = Role.Info.v_RoleBag;
                                                        GamePublic.g_ShopManager.ShopTradeCalc(PickBag, PickBarNum, Bag, BarNum, 1);
                                                        break;
                                                    case GamePublic.e_BarType.ShopStoreBar:
                                                        PickBag = GamePublic.g_ShopManager.GetStore(Role.Command.v_RoleTradeShopNum).ItemBar;
                                                        if (Bag[BarNum]) item = Bag[BarNum];
                                                        Bag[BarNum] = PickBag[PickBarNum];
                                                        PickBag[PickBarNum] = item;
                                                        break;
                                                }
                                                break;
                                        }
                                        /* if (node.PickObj.PickType == GamePublic.e_BarType.ItemBar) {
                                            GamePublic.g_ShopManager.ShopTradeCalc();
                                        }
                                        if (node.PickObj.PickType == GamePublic.e_BarType.ShopStoreBar) {
                                            GamePublic.g_ShopManager.ShopTradeCalc();
                                        }
                                        break; */
                                    }
                                }
                                node.ShowRoleItemArray();
                            }
                            return true;
                        }
                    }
                    break;
                }
                case GamePublic.e_ClickType.Move:{
                    var CheckButtonFlag = false;
                    if (node.PickObjPage) {
                        node.PickObjPage.SetPos(pos); //拖放物品
                    } else if (!GamePublic.g_MouseLeftFlag) {
                        for (var i = 0; i < node.RoleItemArray.length; i++) {
                            //console.log(node.RoleItemArray[i]);
                            //console.log(pos);
                            if (!node.RoleItemArray[i].LoadWellDone) {
                                break;
                            }
                            if (node.RoleItemArray[i].ClickType.Button && GamePublic.CollideRect(pos, node.RoleItemArray[i].Rect)) {
                                CheckButtonFlag = true;
                                if (GamePublic.g_TipPage && !GamePublic.g_TipPage.Show) {
                                    GamePublic.g_TipPage.Setinfo(node.RoleItemArray[i].ButtonInfo.ObjInfo.ObjName, node.RoleItemArray[i].ButtonInfo.ObjInfo.ObjNum, node.RoleItemArray[i].ButtonInfo.ObjInfo.ObjDescribe, node.RoleItemArray[i].ButtonInfo.ObjInfo.Image);
                                }
                            }
                        }
                    }
                    if (GamePublic.g_TipPage && GamePublic.g_TipPage.Show && !CheckButtonFlag) {
                        GamePublic.g_TipPage.SetShow(false);
                    }
                    break;
                }
            }
            for (var i = 0; i < node.ButtonArray.length; i++) {
                if (node.ButtonArray[i].ClickType.Button && !GamePublic.g_MouseMoveFlag && GamePublic.CollideRect(pos, node.ButtonArray[i].Rect)) {
                    switch (_ClickType) {
                        case GamePublic.e_ClickType.LeftUp:
                            PageCommand.PageCommandProc(node.ButtonArray[i].ButtonInfo);
                            //node.ShowRoleItemArray();
                            return true;
                        };
                    break;
                }
            }
            return false;
        }
        return node;    
    }
}
    
module.exports = C_Page;