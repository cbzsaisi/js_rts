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
var RoleSpineClass = require("./C_RoleSpine");
var PageManager = require("./C_PageManager");
var MenuManager = require("./C_MenuManager");
var ItemManager = require("./C_ItemManager");
var CursorClass = require("./C_Cursor");
var TipPageClass = require("./C_TipPage");
var ShopManager = require("./C_Shop");
var GameRunUiClass = require("./C_GameRunUi");
var GameResManager = require("./F_GameResManager");
var BuildManager = require("./C_BuildManager");
var Building = require("./C_Building");

//var g_Random = g_MathLib.Random;
var g_temp = 0;
cc.Class({
    extends: cc.Component,

    DrawNode: null,
    Map_sceen_root: null,
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
        //cc.view.enableAntiAlias(false);
        //if (cc.sys.platform === cc.sys.WECHAT_GAME) wx.setPreferredFramesPerSecond(30)
        //if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {}
        cc.view.enableRetina(false);
        //cc.game.canvas.style.cursor = "none";

        let fps = (cc.sys.os == cc.sys.OS_IOS) ? 59 : 59
        cc.game.setFrameRate(fps);
        
        this.GameMoveUpdateNum = 0;
        this.GameMapUpdateNum = 0;
        this.SceenCreate = false;
        GamePublic.g_GameTimeDt = 0;
        GamePublic.g_GameMain = this;
        GamePublic.g_MainCamera = this.mainCamera;
        GamePublic.g_winSize = cc.winSize;
        GamePublic.g_GameRunUi = null;        
        GamePublic.g_UserPicklObj = {Type:GamePublic.e_UserControlType.Non};

        //初始显示节点
        this.Page_sceen_root = new cc.Node();
        this.Page_sceen_root.group = "ui";
        this.node.addChild(this.Page_sceen_root, 9);
        
        // g_DrawRect= new cc.DrawNode();
        // this.addChild(g_DrawRect,10);
        
        this.Draw_sceen_root = new cc.Node();
        this.Draw_sceen_root.group = "ui";
        this.node.addChild(this.Draw_sceen_root, 7); 
        this.DrawNode = this.Draw_sceen_root.addComponent(cc.Graphics);

        this.Map_sceen_root = new cc.Node();
        //this.Map_sceen_root.is3DNode = true;
        this.node.addChild(this.Map_sceen_root, 5);
        // var spineNode = new cc.Node();
        // var skeleton = spineNode.addComponent('sp.Skeleton');
        // //this.Page_sceen_root.addChild(spineNode, 5);

        // cc.resources.load('spineboy', sp.SkeletonData, (error, assets) => {
        //     if (error == null) {
        //         //设置数据
        //         this.Page_sceen_root.addChild(spineNode, 5);
        //         skeleton.skeletonData = assets;
        //         //播放默认动画
        //         skeleton.setAnimation(0, 'walk', true);
                
        //     }
        // });
        //初始指针坐标
        GamePublic.g_MouseLeftFlag = false;
        GamePublic.g_MouseRightFlag = false;
        GamePublic.g_MoveStartPos = GamePublic.s_Vec2d(0, 0);
        GamePublic.g_MoveEndPos = GamePublic.s_Vec2d(0, 0);
        GamePublic.g_MoveOff = GamePublic.s_Vec2d(0, 0);
        GamePublic.g_MoveOffLast = GamePublic.s_Vec2d(0, 0);
        GamePublic.g_GameRandom = g_MathLib.Random.New();
        
        GamePublic.g_SelectRoleArray = [];
        GamePublic.g_RoleSelectStaus = GamePublic.e_SelectStaus.NonSelect;
        // GamePublic.g_ItemManager = ItemManager.New();
        // GamePublic.g_GameLastTime = new Date().getTime();
        //GamePublic.g_UiCamera = this.UiCamera;
        // //var qu = cc.quat(0, 0, 0).fromEuler({ x: -20, y: 0, z: 0 });
        // //this.Map_sceen_root.position={x:-480,y:-320,z:0};
        // //this.node.setRotation(qu);
        // //this.Map_sceen_root.setRotation(qu);
        // //this.Map_sceen_root.setPosition({x:0,y:0});
        // //var camera = this.Map_sceen_root.addComponent(cc.Camera);

        //地图初始化
        var map = MapData.New(GamePublic.s_Vec2d(GamePublic.e_MapSizeType1.width, GamePublic.e_MapSizeType1.height), 1, this.Map_sceen_root);
        GamePublic.g_GameDataResManger = GameDataResManager.New();
        GamePublic.g_GameDataResManger.AddMap(GamePublic.s_ObjInfo("Map", 1, map));
        GamePublic.g_Active_Map = map;
        GameResManager.LoadResToFile(GamePublic.g_resources1, "2d");
        GameResManager.LoadResToFile(GamePublic.g_resources3d1, "3d");
        GameResManager.LoadResToFile(GamePublic.g_resources2DMapTile, "2DMapTile");
        GameResManager.LoadRes("spineboy","spine");
        
        GamePublic.g_GamePageManager = PageManager.New(this.Page_sceen_root);
        GamePublic.g_GameMenuManager = MenuManager.New(this.Page_sceen_root);
        GamePublic.g_TipPage = TipPageClass.New(this.Page_sceen_root);
        // GamePublic.g_ShopManager = ShopManager.New();
        // GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Gold, 1, GamePublic.g_ShopManager.StoreNum, "Shop");
        // GamePublic.g_ShopManager.AddGoldToStore(GamePublic.g_ShopManager.GetStore(1).ItemBar, 200);
        GamePublic.g_BuildManager = BuildManager.New();
        // //GamePublic.g_Build = Building.New();
        // //console.log(GamePublic.g_BuildManager.GetBuildSize(GamePublic.e_BuildName.SmallHumanBuild));
        
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
        };

        // if('touches' in cc.sys.capabilities) {  //判断当前系统是否支持触摸
        //     console.log("当前平台支持触摸");
        //     cc.eventManager.addListener({
        //         event:cc.EventListener.TOUCH_ALL_AT_ONCE,  // 表示监听多点事件
        //         onTouchesBegan : function(touches,event) {     // 触摸开始
        //         },
        //         onTouchesMoved : function(touches,event) {    // 触摸移动
        //         },
        //         onTouchEnded : function (touches,event) {     //  触摸结束
        //         },
        //         onTouchCancelled : function(touches,event){  // 触摸取消
        //         }
        //     },node);
        // } else {
        //     console.log("当前平台不支持触摸");
        // }

        // this.onTouchesBegan = function(touches,event){
        //     var pos = touch.getLocation();
        //     var id = touch.getID();
        //     console.log("onTouchBegan at : " + pos.x+":"+pos.y);
        //     var winSize = cc.director.getWinSize();
        //     if(pos.x < winSize/2){
        //         return true;   // 本次触摸是否生效，如果返回false，后续的moved和ended讲不再触发
        //     }
        //     return false;
        // }
        // onTouchesMoved = function (touches,event) { // touch表示触摸对象
        //     var pos = touch.getLocation();
        //     var id = touch.getID();
        //     console.log("onTouchMoved at : " + pos.x+":"+pos.y);
        // }
        // onTouchEnded = function (touches,event) {
        //     var pos = touch.getLocation();
        //     var id = touch.getID();
        //     console.log("onTouchEnded at : " + pos.x+":"+pos.y);
        // }
        // onTouchCancelled = function (touches,event) {
        //     var pos = touch.getLocation();
        //     var id = touch.getID();
        //     console.log("onTouchCancelled at : " + pos.x+":"+pos.y);
        // }
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_IOS) {
            cc.game.on(cc.game.EVENT_GAME_INITED, () => {
                cc.game.on(cc.game.EVENT_SHOW, () => {
                    console.log("游戏进入前台");
                    //cc.sys.__audioSupport.context.resume();
                });
        
                cc.game.on(cc.game.EVENT_HIDE, () => {
                    console.log("游戏进入后台");
                    //cc.sys.__audioSupport.context.suspend();
                });
            })
        }

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            //console.log("Location:",Math.round(event.getLocation().x),Math.round(event.getLocation().y));
            GameControl.ControlMouseMoveCall(event.getLocation())
        }, this);


    //     let supportTouches = ('touches' in cc.sys.capabilities);
    //     console.log(supportTouches);
    //     if (supportTouches) {
    //         // 事件map
    //         let _touchEventsMap = {
    //           "touchstart": function (touchesToHandle) {
    //             selfPointer.handleTouchesBegin(touchesToHandle);
    //             console.log(supportTouches);
    //             element.focus();
    //           },
    //           "touchmove": function (touchesToHandle) {
    //             console.log(supportTouches);
    //             selfPointer.handleTouchesMove(touchesToHandle);
    //           },
    //           "touchend": function (touchesToHandle) {
    //             console.log(supportTouches);
    //             selfPointer.handleTouchesEnd(touchesToHandle);
    //           },
    //           "touchcancel": function (touchesToHandle) {
    //             console.log(supportTouches);
    //             selfPointer.handleTouchesCancel(touchesToHandle);
    //           }
    //         };
        
    //         // 遍历map注册事件
    //         let registerTouchEvent = function (eventName) {
    //           let handler = _touchEventsMap[eventName];
    //           // 注册事件到canvas上
    //           element.addEventListener(eventName, (function(event) {
    //             if (!event.changedTouches) return;
    //             let body = document.body;
        
    //             // 计算偏移量
    //             canvasBoundingRect.adjustedLeft = canvasBoundingRect.left - (body.scrollLeft || window.scrollX || 0);
    //             canvasBoundingRect.adjustedTop = canvasBoundingRect.top - (body.scrollTop || window.scrollY || 0);
    //             // 从事件中获得触摸点，并调用回调函数
    //             handler(selfPointer.getTouchesByEvent(event, canvasBoundingRect));
    //             // 停止事件冒泡
    //             event.stopPropagation();
    //             event.preventDefault();
    //           }), false);
    //         };
    //         for (let eventName in _touchEventsMap) {
    //           registerTouchEvent(eventName);
    //         }
    //       }
    },

    update(dt) {
        //console.log(cc.view.getCanvasSize());
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
            for (var i in GamePublic.g_resources2DMapTile) {
                if (!GamePublic.g_resources2DMapTile[i].LoadDone) GamePublic.g_GameResLoadFinish = false;
            }
         } else {
            if (!this.SceenCreate) {
                var Rolenum = 0;
                var Buildnum = 0;
                for (let i = 0; i < 1; i++) {
                    for (let j = 0; j < 1; j++) {
                        var role = new RoleSpineClass.New("role2", 1, GamePublic.s_Vec2d(i, j), ++Rolenum);
                    }
                }
                //var build = new Building.New("role1", ++Buildnum, 1, GamePublic.s_Vec2d(10, 5), []);

                GamePublic.g_GameRunUi = GameRunUiClass.New({ x: 20, y: 20 }, "GameRunUi", 0, {}, {}, this.Page_sceen_root, 8);
                this.SceenCreate = true;
            }
        }
        if (GamePublic.g_GameResLoadFinish) {
            if (!GamePublic.g_Cursor) GamePublic.g_Cursor = CursorClass.New(this);
            GamePublic.g_MouseStopTick > 1000 ? GamePublic.g_MouseStopTick = 0 : GamePublic.g_MouseStopTick++;
            this.DrawNode.clear();
            if (GamePublic.g_MouseLeftFlag && GamePublic.g_MouseMoveFlag && GamePublic.g_GameMenuManager && GamePublic.g_GameMenuManager.MenuNumber == 0 && GamePublic.g_GamePageManager && GamePublic.g_GamePageManager.PageNumber == 0) {
                this.DrawNode.lineWidth = 2;
                this.DrawNode.strokeColor = cc.Color.WHITE;
                this.DrawNode.rect(GamePublic.g_MoveStartPos.x, GamePublic.g_MoveStartPos.y,
                    GamePublic.g_MoveEndPos.x - GamePublic.g_MoveStartPos.x, GamePublic.g_MoveEndPos.y - GamePublic.g_MoveStartPos.y);
                this.DrawNode.stroke();
            }
            if (GamePublic.g_Cursor) GamePublic.g_Cursor.Update();
            
            if (++this.GameMoveUpdateNum > 0) {
                this.Map_sceen_root.setPosition(GamePublic.g_MoveOff);
        
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
            //         /* if(GamePublic.g_TipPage.Show && GamePublic.g_MouseStopTick > 50){
            //             GamePublic.g_TipPage.SetShow(false);
            //             //GamePublic.g_MouseStopTick = 0;
            //         } */
            //         if (GamePublic.g_GamePageManager.PageNumber == 0 && GamePublic.g_GameMenuManager.MenuNumber == 0 && GamePublic.g_MouseStopTick > 20) {
            //             var Role = null;
            //             //GamePublic.g_TipPage.Show
            //             for (var i = 0; i < GamePublic.g_GameDataResManger.RoleArray.length; i++) {
            //                 if (GameControl.RoleRayCheck(GamePublic.g_MoveEndPos, GamePublic.g_GameDataResManger.RoleArray[i].obj.GetNumber())) {
            //                     Role = GamePublic.g_GameDataResManger.GetRole(GamePublic.g_GameDataResManger.RoleArray[i].obj.GetNumber());
            //                     break;
            //                 }
            //             }
            //             if (Role) {
            //                 GamePublic.g_TipPage.Setinfo(Role.RoleInfo.v_RoleName,Role.RoleInfo.v_RoleNumber, Role.RoleInfo.v_RoleName,null);
            //             } else {
            //                 GamePublic.g_TipPage.SetShow(false);
            //             }
            //         }
                
                }
                if (GamePublic.g_GamePageManager) GamePublic.g_GamePageManager.Update();
                if (GamePublic.g_GameMenuManager) GamePublic.g_GameMenuManager.Update();
                if (GamePublic.g_TipPage) GamePublic.g_TipPage.Update();
                if (GamePublic.g_GameRunUi) GamePublic.g_GameRunUi.Update();
            }
        }
        // /*g_temp>360?g_temp = 0:g_temp++;
        // var qu = cc.quat(0,0,0).fromEuler({x:g_temp,y:0,z:0});
        // this.WolrdLight.setRotation(qu);*/
        // //this.WolrdLight.angle > 360 ? this.WolrdLight.angle = 0:this.WolrdLight.angle;
    },
});
