// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
//cc.macro.FIX_ARTIFACTS_BY_STRECHING_TEXEL = 0;


var GamePublic = require("./F_GamePublic");
var MapData = require("./C_MapData");
var GameDataResManager = require("./C_GameDataResManager");
var g_MathLib = require("./C_MathLib");
var GameControl = require("./F_GameControl");
var RoleClass = require("./C_Role");
var PageManager = require("./C_PageManager");
var MenuManager = require("./C_MenuManager");
var ItemManager = require("./C_ItemManager");
var CursorClass = require("./C_Cursor");
var TipPageClass = require("./C_TipPage");
var ShopManager = require("./C_Shop");
var GameRunUiClass = require("./C_GameRunUi");
var GameResManager = require("./F_GameResManager");
var BuildManager = require("./C_BuildManager");
//var g_Random = g_MathLib.Random;
//test
var g_temp = 0;
cc.Class({
    extends: cc.Component,

    DrawNode: null,
    map_sceen_root: null,
    Draw_sceen_root: null,
    Page: null,
    GameMoveUpdateNum: 0,
    GameMapUpdateNum: 0,
    SceenCreate: false,
    properties: {
        canvas: cc.Node,
        WolrdLight: cc.Node,
        mainCamera: {
            default: null,
            type: cc.Node
        },
        UiCamera: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        cc.view.enableAntiAlias(false);
        cc.view.enableRetina(true);
        cc.game.canvas.style.cursor = "none";

        let fps = (cc.sys.os == cc.sys.OS_IOS) ? 30 : 30
        cc.game.setFrameRate(30);
        if (CC_WECHATGAME) wx.setPreferredFramesPerSecond(30)

        var self = this;
        //self.node.is3DNode = true;
        //self.node.angle = 22;
        this.GameMoveUpdateNum = 0;
        this.GameMapUpdateNum = 0;
        this.SceenCreate = false;

        GamePublic.g_MouseLeftFlag = false;
        GamePublic.g_MouseRightFlag = false;
        GamePublic.g_MoveStartPos = GamePublic.s_Vec2d(0, 0);
        GamePublic.g_MoveEndPos = GamePublic.s_Vec2d(0, 0);
        GamePublic.g_MoveOff = GamePublic.s_Vec2d(0, 0);
        GamePublic.g_MoveOffLast = GamePublic.s_Vec2d(0, 0);

        GamePublic.g_winSize = cc.winSize;
        GamePublic.g_SelectRoleArray = [];
        GamePublic.g_RoleSelectStaus = GamePublic.e_SelectStaus.NonSelect;

        GamePublic.g_GameDataResManger = GameDataResManager.New();
        GamePublic.g_GameRandom = g_MathLib.Random.New();
        GamePublic.g_ItemManager = ItemManager.New();
        GamePublic.g_GameLastTime = new Date().getTime();
        GamePublic.g_GameTimeDt = 0;

        GamePublic.g_GameMain = this;
        GamePublic.g_MainCamera = this.mainCamera;
        GamePublic.g_UiCamera = this.UiCamera;
        this.map_sceen_root = new cc.Node();
        var qu = cc.quat(0, 0, 0).fromEuler({ x: -20, y: 0, z: 0 });
        this.node.is3DNode = true;
        this.map_sceen_root.is3DNode = true;
        //this.map_sceen_root.position={x:-480,y:-320,z:0};
        //this.node.setRotation(qu);
        //this.map_sceen_root.setRotation(qu);
        //this.map_sceen_root.setPosition({x:0,y:0});
        //var camera = this.map_sceen_root.addComponent(cc.Camera);
        this.node.addChild(this.map_sceen_root, 5);

        this.Draw_sceen_root = new cc.Node();
        this.DrawNode = this.Draw_sceen_root.addComponent(cc.Graphics);
        this.node.addChild(this.Draw_sceen_root, 7);

        var map = MapData.New(GamePublic.s_Vec2d(GamePublic.e_MapSizeType1.width, GamePublic.e_MapSizeType1.height), 1, this.map_sceen_root);
        GamePublic.g_GameDataResManger.AddMap(GamePublic.s_ObjInfo("Map", 1, map.v_MapNumber, map));
        GamePublic.g_Active_Map = map;

        this.Page_sceen_root = new cc.Node();
        this.node.addChild(this.Page_sceen_root, 9);

        GamePublic.g_GamePageManager = PageManager.New(this.Page_sceen_root);
        //GamePublic.g_GamePageManager.AddPage({x:200,y:300},'type');

        GamePublic.g_GameMenuManager = MenuManager.New(this.Page_sceen_root);
        //GamePublic.g_GameMenuManager.AddMenu({ x: 300, y: 400 }, 'type');
        //GamePublic.g_Cursor = CursorClass.New(this);
        GamePublic.g_TipPage = TipPageClass.New(this.Page_sceen_root);
        GamePublic.g_ShopManager = ShopManager.New();
        GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Gold, 1, GamePublic.g_ShopManager.StoreNum, "Shop");
        GamePublic.g_ShopManager.AddGoldToStore(GamePublic.g_ShopManager.GetStore(1).ItemBar, 200);
        GamePublic.g_BuildManager = BuildManager.New();
        //console.log(GamePublic.g_BuildManager.GetBuildSize(GamePublic.e_BuildName.SmallHumanBuild));

        //GamePublic.g_GameRunUi = GameRunUiClass.New({ x: 20, y: 20 }, "GameRunUi", 0, {}, {}, this.Page_sceen_root, 8);
        //this.Page_sceen_root.group ="default";
        this.Page_sceen_root.group = "ui";
        this.Draw_sceen_root.group = "ui";

        GamePublic.g_UserControlType = GamePublic.e_UserControlType.Non;

        GameResManager.LoadResToFile(GamePublic.g_resources1, "2d");
        GameResManager.LoadResToFile(GamePublic.g_resources3d1, "3d");
        if (cc.sys.capabilities.mouse) {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
                switch (event.getButton()) {
                    case cc.Event.EventMouse.BUTTON_LEFT:
                        GameControl.ControlMouseLeftDownCall(event.getLocation());
                        break;
                    case cc.Event.EventMouse.BUTTON_RIGHT:
                        GameControl.ControlMouseRightDownCall(event.getLocation());
                        break;
                    case cc.Event.EventMouse.BUTTON_MIDDLE:
                        break;
                }
            }, this);

            this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
                switch (event.getButton()) {
                    case cc.Event.EventMouse.BUTTON_LEFT:
                        GameControl.ControlMouseLeftUpCall(event.getLocation());
                        break;
                    case cc.Event.EventMouse.BUTTON_RIGHT:
                        GameControl.ControlMouseRightUpCall(event.getLocation());
                        break;
                    case cc.Event.EventMouse.BUTTON_MIDDLE:
                        GameControl.ControlMouseMiddleUpCall(event.getLocation());
                        break;
                }
            }, this);

            this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
                GameControl.ControlMouseMoveCall(event.getLocation());
            }, this);
        }
    },

    update(dt) {
        var self = this;
        var CurTime = new Date().getTime();
        GamePublic.g_GameTimeDt = CurTime - GamePublic.g_GameLastTime;
        GamePublic.g_GameLastTime = CurTime;
        if (GamePublic.g_GameTimeDt > 60) GamePublic.g_GameTimeDt = 60;

        if (!GamePublic.g_GameResLoadFinish) {
            GamePublic.g_GameResLoadFinish = true;
            for (var i in GamePublic.g_resources1) {
                if (!GamePublic.g_resources1[i].LoadDone) GamePublic.g_GameResLoadFinish = false;
            }
            for (var i in GamePublic.g_resources3d1) {
                if (!GamePublic.g_resources3d1[i].LoadDone) GamePublic.g_GameResLoadFinish = false;
            }
        } else {
            if (!this.SceenCreate) {
                var Rolenum = 0;
                for (let i = 0; i < 1; i++) {
                    for (let j = 0; j < 2; j++) {
                        var role = new RoleClass.New("role1", 1, GamePublic.s_Vec2d(i, j), ++Rolenum);
                    }
                }
                GamePublic.g_GameRunUi = GameRunUiClass.New({ x: 20, y: 20 }, "GameRunUi", 0, {}, {}, this.Page_sceen_root, 8);
                this.SceenCreate = true;
            }
        }

        if (GamePublic.g_GameResLoadFinish) {
            if (!GamePublic.g_Cursor) GamePublic.g_Cursor = CursorClass.New(this);
            GamePublic.g_MouseStopTick > 1000 ? GamePublic.g_MouseStopTick = 0 : GamePublic.g_MouseStopTick++;
            this.DrawNode.clear();
            if (GamePublic.g_MouseLeftFlag && GamePublic.g_MouseMoveFlag && GamePublic.g_GameMenuManager && GamePublic.g_GameMenuManager.MenuNumber == 0 && GamePublic.g_GamePageManager && GamePublic.g_GamePageManager.PageNumber == 0) {
                this.DrawNode.lineWidth = 1;
                this.DrawNode.strokeColor = cc.Color.WHITE;
                this.DrawNode.rect(GamePublic.g_MoveStartPos.x, GamePublic.g_MoveStartPos.y,
                    GamePublic.g_MoveEndPos.x - GamePublic.g_MoveStartPos.x, GamePublic.g_MoveEndPos.y - GamePublic.g_MoveStartPos.y);
                this.DrawNode.stroke();
            }
            if (GamePublic.g_Cursor) GamePublic.g_Cursor.Update();

            if (++this.GameMoveUpdateNum > 0) {
                this.map_sceen_root.setPosition(GamePublic.g_MoveOff);
                this.GameMoveUpdateNum = 0;

                if (GamePublic.g_Active_Map && ++this.GameMapUpdateNum > 1) {
                    for (var i = 0; i < GamePublic.e_MapSizeType1.height; i++) {
                        for (var j = 0; j < GamePublic.e_MapSizeType1.width; j++) {
                            GamePublic.g_Active_Map.MapRoomArray[i][j].MyUpdate();
                        }
                    }
                    for (var i = 0; i < GamePublic.g_GameDataResManger.RoleArray.length; i++) {
                        GamePublic.g_GameDataResManger.RoleArray[i].obj.MyUpdate();
                    }
                    this.GameMapUpdateNum = 0;
                    /* if(GamePublic.g_TipPage.Show && GamePublic.g_MouseStopTick > 50){
                        GamePublic.g_TipPage.SetShow(false);
                        //GamePublic.g_MouseStopTick = 0;
                    } */
                    if (GamePublic.g_GamePageManager.PageNumber == 0 && GamePublic.g_GameMenuManager.MenuNumber == 0 && GamePublic.g_MouseStopTick > 20) {
                        var Role = null;
                        //GamePublic.g_TipPage.Show
                        for (var i = 0; i < GamePublic.g_GameDataResManger.RoleArray.length; i++) {
                            if (GameControl.RoleRayCheck(GamePublic.g_MoveEndPos, GamePublic.g_GameDataResManger.RoleArray[i].number)) {
                                Role = GamePublic.g_GameDataResManger.GetRole(GamePublic.g_GameDataResManger.RoleArray[i].number);
                                break;
                            }
                        }
                        if (Role) {
                            GamePublic.g_TipPage.Setinfo(Role.RoleInfo.v_RoleName,Role.RoleInfo.v_RoleNumber, Role.RoleInfo.v_RoleName,null);
                        } else {
                            GamePublic.g_TipPage.SetShow(false);
                        }
                    }
                    if (GamePublic.g_GamePageManager) GamePublic.g_GamePageManager.Update();
                    if (GamePublic.g_GameMenuManager) GamePublic.g_GameMenuManager.Update();
                    if (GamePublic.g_TipPage) GamePublic.g_TipPage.Update();
                    if (GamePublic.g_GameRunUi) GamePublic.g_GameRunUi.Update();
                }
            }
        }
        /*g_temp>360?g_temp = 0:g_temp++;
        var qu = cc.quat(0,0,0).fromEuler({x:g_temp,y:0,z:0});
        this.WolrdLight.setRotation(qu);*/
        //this.WolrdLight.angle > 360 ? this.WolrdLight.angle = 0:this.WolrdLight.angle;
    },
});
