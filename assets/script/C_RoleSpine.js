var GamePublic = require("./F_GamePublic");
var GameResManager = require("./F_GameResManager");
var RoleSrcipt = require("./F_RoleSrcipt");
var RoleFrontDraw = require("./C_RoleFrontDraw");
var g_RoleManager = require("./F_RoleManager");
//var g_3dSprite = require("./C_3DSprite");
var g_Spine = require("./C_Spine");

var C_RoleSpine = {
    New: function(_RoleResName, _MapNum, _MapPoint, _RoleNumber) {
        var node = {};

        node.RoleInfo = { //写入保存数据
                v_RoleNumber: null, //角色编号
                v_RoleOccupationType: null, //职业
                v_RoleRaceType: null, //角色种族
                v_RoleRacePropertyData: {}, //种族属性数据
                v_RolePropertyData: {}, //角色属性数据
                v_RoleMapPos: null, //在当前地图的坐标
                v_RoleType: null,//角色状态
                v_ActionMovePos: null,
                v_CurrentMapNum: null,
                v_RolePassStatu: null, //穿透类型
                v_SpriteDirection: null, //朝向
                v_SpriteAngle: null, //角度
                v_RoleGroupNum: null, //分组编号
                v_RoleBagSize: null,
                v_RoleBag: null, //背包
                v_RoleName: "无名",
                v_RoleEquip: null,
                v_RoleColor: cc.color(255, 255, 255, 255),
                v_RoleOpacity: 255,
            },

            node.RoleGameInfo = { //基本不写入保存数据
                v_RoleSprite: null,
                v_RoleSpriteLoad: false,
                v_SpriteSize:  {width:0,height:0},
                v_SpriteScale: null,
                v_SpritePos: null,
                v_SpriteType: null,
                v_CurrentMap: null,
                v_SpriteData: null,
                v_ActionStage: null, //动作状态
                v_DtNumber: 0, //帧执行次数
                v_RoleCurAction: null,
                v_ActionNodeNumber: null, //当前动画总帧数
                v_SpriteNumber: null, //当前精灵动画执行到的帧数
                v_RoleCurActionSpriteNum: null, //当前角色动画累计执行帧数
                //移动相关
                v_MapOffset: null, //移动偏移量？ 
                v_SpriteBoundingBox: null,
                //记录遇到的阻碍点
                v_MoveBlockPos: null, //被阻挡的移动点
                v_BlockType: null, //阻挡类型
                v_SpriteShow: null, //是否显示
                v_RoleSelectFlag: null, //是否被选中
                v_RoleAttackType: null, //攻击类型
                v_FrontDraw: null,
                v_FrontDrawFlag: null,
                v_DrawNode: null,
                v_RoleCreate: false,
            },
            node.RoleCommand = { //写入保存数据
                //指令
                v_RoleActionArray: null,
                v_RoleActionCurScriptArray: null,
                v_RoleActionCommandArray: [],
                v_RoleActionCommandState: null,
                v_RoleActionCommandArray1: [],
                v_RoleActionCommandState1: null,
                v_RoleActionCommandArray1Number: null,
                v_RoleActionCommandArray2: [],
                v_RoleActionCommandState2: null,
                v_RoleActionCommandArray2Number: null,
                v_RoleActionCommandPassive: [],
                v_RoleActionCommandPassiveState: null,
                //脚本执行
                v_ActionCommand: null,
                v_ActionScriptFail: null, //脚本失败次数
                v_ActionScriptFailType: null, //脚本失败原因
                v_ActionEvent: null, //事件
                v_ActionRunStage: null,
                v_ActionLoop: null,
                v_ActionConsoleType: null, //命令控制类型 1：倒计时控制，2：动画播放控制
                v_ActionWaitTime: 0, //动作消耗帧

                v_RoleTarNum: null,
                v_RoleTrarArray: [],
                v_RoleTradeShopNum: 0, //交易商店编号
            },

            //初始化
        node.RoleInfo.v_RoleNumber = _RoleNumber;
        node.RoleInfo.v_RoleMapPos = GamePublic.s_Vec2d(_MapPoint.x, _MapPoint.y);
        //node.RoleInfo.v_RoleMapPos = GamePublic.s_Rect(_MapPoint.x, _MapPoint.y, 1, 1);
        node.RoleInfo.v_RoleBagSize = 20, //当前背包大小
        node.RoleInfo.v_CurrentMapNum = _MapNum;
        node.RoleInfo.v_RoleBag = Array(50), //背包
        node.RoleInfo.v_RolePassStatu = "land";
        node.RoleInfo.v_RoleEquip = Array(7), //装备背包
        node.RoleInfo.v_RoleType = GamePublic.s_RoleType();

        node.RoleGameInfo.v_SpriteType = GamePublic.e_SpriteType.spine;
        node.RoleGameInfo.v_RoleAttackType = { AttackType: "hand", Skill: "Left" };
        node.RoleGameInfo.v_SpriteData = GameResManager.getSpriteResData(_RoleResName, GamePublic.e_SpriteResType.Role);
        node.RoleGameInfo.v_CurrentMap = GamePublic.g_GameDataResManger.GetMap(_MapNum); //当前地图实体
        node.RoleGameInfo.v_SpriteShow = false;
        node.RoleGameInfo.v_MapOffset = GamePublic.s_Vec2d(0, 0);

        node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.New;
        node.RoleCommand.v_ActionConsoleType = 1;
        node.RoleCommand.v_ActionLoop = false;
        node.RoleCommand.v_RoleTradeShopNum = 1;
        node.RoleCommand.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.play;

        node.RoleGameInfo.v_DrawNode = new cc.Node();
        node.RoleGameInfo.v_DrawNode.is3DNode = false;
        //var qu = cc.quat(0, 0, 0).fromEuler({ x: -15, y: 0, z: 0 });
        //node.RoleGameInfo.v_DrawNode.setRotation(qu);
        node.RoleGameInfo.v_CurrentMap.v_MapShowNode.addChild(node.RoleGameInfo.v_DrawNode, 2000);

        node.RoleInfo.v_SpriteAngle = { Def: 0, Cur: 0, Des: 0 }; //角色朝向角度
        //node.RoleInfo.v_RoleBag[3] = GamePublic.g_ItemManager.CreateItem(GamePublic.e_ItemName.Sword1);
        //node.RoleInfo.v_RoleBag[2] = GamePublic.g_ItemManager.CreateItem(GamePublic.e_ItemName.Gold);
        node.Create = function() {
            var obj = GamePublic.s_ObjInfo("Role", node.RoleInfo.v_RoleNumber, node);
            GamePublic.g_GameDataResManger.AddRole(obj);
            //node.RoleGameInfo.v_RoleSprite.v_Sprite.opacity = 100;
            //node.RoleGameInfo.v_CurrentMap.v_MapShowNode.addChild(node.RoleGameInfo.v_RoleSprite.v_Sprite, 2);
            node.SetSceenPos(node.RoleInfo.v_RoleMapPos);
            node.RoleGameInfo.v_SpriteShow = true;
            node.RoleGameInfo.v_SpriteScale = {x:node.RoleGameInfo.v_SpriteData.SpriteScale, y:node.RoleGameInfo.v_SpriteData.SpriteScale};
            node.RoleGameInfo.v_CurrentMap.MapRoomArray[node.RoleInfo.v_RoleMapPos.x][node.RoleInfo.v_RoleMapPos.y].MoveInRole(node.RoleInfo.v_RoleNumber, GamePublic.e_BaseObjType.Role);
            //var src = new GamePublic.s_RoleScript({Info:1,Name:"RoleMove"},{Num:node.RoleInfo.v_RoleNumber,Array:"22",Pos:123},{Num:0,Array:"22",Pos:GamePublic.s_Vec2d(1,1)});
            //node.RoleCommand.v_RoleActionCommandArray.push(src);

            //node.RoleGameInfo.v_FrontDrawFlag = true;
            node.RoleGameInfo.v_FrontDraw = RoleFrontDraw.New(node, node.RoleGameInfo.v_DrawNode, 1);

            node.RoleInfo.v_RoleRaceType = GamePublic.e_RoleRaceType.Human;
            node.RoleInfo.v_RoleRacePropertyData = g_RoleManager.InitRoleRacePropertyData(node.RoleInfo.v_RoleNumber);
            node.RoleInfo.v_RolePropertyData = GamePublic.s_RolePropertyData('');
            node.CalcRolePropertyData();
            // GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Sword1, 1, node.RoleInfo.v_RoleNumber, "Role");
            // GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Gold, 10, node.RoleInfo.v_RoleNumber, "Role");
            // GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Gold, 2, node.RoleInfo.v_RoleNumber, "Role");
            //GamePublic.g_ItemManager.RoleEquip(node.RoleInfo.v_RoleNumber,3); //装备
            //this.SetRoleAction(GamePublic.e_RoleAction.walk);
            node.RoleGameInfo.v_RoleCreate = true;
        };

        node.LoadSpriteRes = function() {
            for (var i in GamePublic.g_resourcesSpineboy) {
                if (GamePublic.g_resourcesSpineboy[i].FileName == node.RoleGameInfo.v_SpriteData.spritename && GamePublic.g_resourcesSpineboy[i].LoadDone) {
                    node.RoleGameInfo.v_RoleSprite = g_Spine.New(node, GamePublic.g_resourcesSpineboy[i].FileData);
                    //node.RoleGameInfo.v_RoleSprite.v_Sprite.color = cc.color(100, 100, 100, 255);
                    node.SetRoleColor(90);
                    if (!node.RoleGameInfo.v_RoleCreate) {
                        node.Create();
                    }
                }
            }
            /* if(!node.RoleGameInfo.v_RoleSprite){
                cc.loader.loadRes(node.RoleGameInfo.v_SpriteData.spritename, function (err, prefab) {
                    node.RoleGameInfo.v_RoleSprite = g_3dSprite.New(node,prefab);
                    if(!node.RoleGameInfo.v_RoleCreate){
                        node.Create();
                    }
                });
            } */
        };
        node.GetNumber = function() {
            return node.RoleInfo.v_RoleNumber;
        }
        node.SetSceenPos = function(_pos) {
            node.RoleInfo.v_RoleMapPos = _pos;
            /*node.RoleGameInfo.v_SpritePos = GamePublic.s_Vec2d(Math.round((_pos.x - _pos.y + 1) * (node.RoleGameInfo.v_CurrentMap.v_MapTiledSize.x * 0.5) * GamePublic.g_SceenScale),
            Math.round((_pos.y + _pos.x + 1) * (node.RoleGameInfo.v_CurrentMap.v_MapTiledSize.y * 0.5) * GamePublic.g_SceenScale));*/
            // node.RoleGameInfo.v_SpritePos = GamePublic.s_Vec2d(_pos.x * (node.RoleGameInfo.v_CurrentMap.v_MapTiledSize.x * GamePublic.g_SceenScale),
            //     _pos.y * (node.RoleGameInfo.v_CurrentMap.v_MapTiledSize.y * GamePublic.g_SceenScale));// + node.RoleGameInfo.v_SpriteSize.height * 0.5);
            node.RoleGameInfo.v_SpritePos = node.RoleGameInfo.v_CurrentMap.MapRoomArray[_pos.x][_pos.y].v_SpritePos;
            //node.RoleGameInfo.v_SpritePos.y += 12;
            if (node.RoleCommand.v_ActionEvent == GamePublic.e_RoleAction.walk) {
                node.RoleGameInfo.v_SpritePos.x += node.RoleCommand.v_ActionWaitTime * node.RoleGameInfo.v_MapOffset.x;
                node.RoleGameInfo.v_SpritePos.y += node.RoleCommand.v_ActionWaitTime * node.RoleGameInfo.v_MapOffset.y;
            }
            if (node.RoleGameInfo.v_RoleSprite) {
                //node.RoleGameInfo.v_RoleSprite.v_Sprite.setPosition(GamePublic.s_Vec2d(0, 0));
                node.RoleGameInfo.v_RoleSprite.v_Sprite.setPosition(node.RoleGameInfo.v_SpritePos);
                node.RoleGameInfo.v_DrawNode.setPosition(node.RoleGameInfo.v_SpritePos);
            }

            var zindex = (node.RoleGameInfo.v_CurrentMap.v_MapSize.x * node.RoleGameInfo.v_CurrentMap.v_MapSize.y) -
                (node.RoleInfo.v_RoleMapPos.x + node.RoleInfo.v_RoleMapPos.y * node.RoleGameInfo.v_CurrentMap.v_MapSize.x);
            if (node.RoleGameInfo.v_RoleSprite) node.RoleGameInfo.v_RoleSprite.v_Sprite.zIndex = zindex + 1;
            if (node.RoleGameInfo.v_SpriteScale) node.RoleGameInfo.v_RoleSprite.v_Sprite.scaleX = node.RoleGameInfo.v_SpriteScale.x;
            if (node.RoleGameInfo.v_SpriteScale) node.RoleGameInfo.v_RoleSprite.v_Sprite.scaleY = node.RoleGameInfo.v_SpriteScale.y;
            //if (this.v_TileSprite) this.v_TileSprite.setScale(g_SceenScale);
        };

        node.SetMapPos = function(_mappos) {
            node.RoleGameInfo.v_CurrentMap.MapRoomArray[node.RoleInfo.v_RoleMapPos.x][node.RoleInfo.v_RoleMapPos.y].MoveOutRole(node.RoleInfo.v_RoleNumber, GamePublic.e_BaseObjType.Role);
            node.RoleInfo.v_RoleMapPos = _mappos;
            node.RoleGameInfo.v_CurrentMap.MapRoomArray[node.RoleInfo.v_RoleMapPos.x][node.RoleInfo.v_RoleMapPos.y].MoveInRole(node.RoleInfo.v_RoleNumber, GamePublic.e_BaseObjType.Role);
        }

        node.StopCommand = function(_Type) {
            node.RoleGameInfo.v_DtNumber = GamePublic.e_RoleSpeed.fps;
            node.RoleCommand.v_ActionWaitTime = 0;
            node.RoleCommand.v_RoleActionCommandArray.splice(0, node.RoleCommand.v_RoleActionCommandArray.length);
        }

        node.ShowSprite = function(_show) {
            if (_show) {
                if (node.RoleGameInfo.v_RoleSprite && !node.RoleGameInfo.v_RoleSprite.v_Sprite.active) node.RoleGameInfo.v_RoleSprite.v_Sprite.active = true;
                node.RoleGameInfo.v_SpriteShow = true;
            } else {
                if (node.RoleGameInfo.v_RoleSprite && node.RoleGameInfo.v_RoleSprite.v_Sprite.active) node.RoleGameInfo.v_RoleSprite.v_Sprite.active = false;
                node.RoleGameInfo.v_SpriteShow = false;
            }
        }

        node.MyUpdate = function() {
            if (!node.RoleGameInfo.v_RoleCreate) {
                if (!node.RoleGameInfo.v_RoleSprite) {
                    node.LoadSpriteRes();
                }
                return;
            }
            node.RoleGameInfo.v_DtNumber++;
            if (node.RoleGameInfo.v_DtNumber >= (GamePublic.e_RoleSpeed.fps)) {
                node.RoleGameInfo.v_DtNumber = 0;
                if (node.RoleCommand.v_ActionConsoleType == 1 && node.RoleCommand.v_ActionWaitTime > 0) { //当前动作总耗时帧
                    node.RoleCommand.v_ActionWaitTime -= GamePublic.g_GameTimeDt;
                }
                if (node.RoleGameInfo.v_FrontDraw) node.RoleGameInfo.v_FrontDraw.update();
            }
            //console.log(node.RoleCommand.v_ActionWaitTime);
            // console.log(node.RoleCommand.v_ActionLoop);
            // console.log(node.RoleCommand.v_ActionRunStage);
            if (node.RoleCommand.v_ActionWaitTime < 1) {
                if (node.RoleCommand.v_RoleActionCommandArray.length) {
                    node.RoleCommand.v_ActionCommand = node.RoleCommand.v_RoleActionCommandArray.splice(node.RoleCommand.v_RoleActionCommandArray.length - 1, 1);
                    RoleSrcipt.RoleCommandSrciptProc(node.RoleCommand.v_ActionCommand[0]);
                }
                else if (node.RoleCommand.v_ActionEvent != GamePublic.e_RoleAction.def && node.RoleGameInfo.v_RoleSprite) {
                    // var seft = node.RoleGameInfo.v_RoleSprite.v_Sprite.getComponent(cc.SkeletonAnimation);
                    // seft.stop();
                    node.RoleCommand.v_ActionEvent = GamePublic.e_RoleAction.def;
                    node.RoleCommand.v_ActionLoop = false;
                    //if(this.v_NodeActionCommandState1 == e_ActionCommandState.Run)this.v_NodeActionCommandState1 = e_ActionCommandState.End;
                    //空闲
                    this.v_ActionCommand = 0;
                    //if(this.v_Sprite.v_ActionStage != e_SpriteActionName.jump){C_RoleManager.SetRoleAction(this.v_Sprite,e_SpriteActionName.jump);}
                }
            }
            else if(node.RoleCommand.v_ActionLoop == true && node.RoleCommand.v_ActionRunStage == GamePublic.e_SpriteActionRunStage.stop){
                this.SetRoleAction(node.RoleCommand.v_ActionEvent);
            }

            node.StateCheck();

            if (node.RoleCommand.v_RoleActionCommandPassive.length) {
                var Command = node.RoleCommand.v_RoleActionCommandPassive.splice(0, 1);
                var SrcExeState = RoleSrcipt.RoleActionCommandPassiveProc(Command[0]);
                if (SrcExeState == GamePublic.e_CommandSrcipt.Success) {
                    //node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.Run;
                } else {
                    //node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.End;
                }
            }

            if (node.RoleCommand.v_RoleActionCommandArray1.length) {
                switch (node.RoleCommand.v_RoleActionCommandState1) {
                    case GamePublic.e_ActionCommandState.New:
                        var Command = node.RoleCommand.v_RoleActionCommandArray1[node.RoleCommand.v_RoleActionCommandArray1.length - 1];
                        //if(this.RoleInfo.v_RoleNumber == 2)console.log(Command,);
                        var SrcExeState = RoleSrcipt.RoleCommandSrciptProc1(Command);
                        if (SrcExeState == GamePublic.e_CommandSrcipt.Success) {
                            node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.Run;
                        } else {
                            node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.End;
                        }
                        node.RoleCommand.v_RoleActionCommandArray1Number = node.RoleCommand.v_RoleActionCommandArray1.length - 1;
                        break;
                    case GamePublic.e_ActionCommandState.Run:
                        if (node.RoleCommand.v_ActionScriptFailType != GamePublic.e_ActionScriptFailType.Success) { //如果未成功 但错误次数未到 重新跑
                            if (node.RoleCommand.v_ActionScriptFail < 3) {
                                console.log("失败一次");
                                node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.New;
                                node.RoleCommand.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
                            } else {
                                node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.End;
                            }
                        } else { //执行未报错  检查执行情况 如果时间结束 并且当前动作指令为空就执行以下
                            if (node.RoleCommand.v_ActionWaitTime < 1 && node.RoleCommand.v_RoleActionCommandArray.length == 0) {
                                node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.End;
                            }
                        }
                        break;
                    case GamePublic.e_ActionCommandState.Stop:
                        //console.log("e_ActionCommandState.Stop");
                        break;
                    case GamePublic.e_ActionCommandState.End:
                        //console.log("e_ActionCommandState.End");
                        //if(this.RoleInfo.v_RoleNumber == 2)console.log(node.RoleCommand.v_RoleActionCommandArray1);
                        node.RoleCommand.v_RoleActionCommandArray1.splice(node.RoleCommand.v_RoleActionCommandArray1Number, 1);
                        node.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.New;
                        node.RoleCommand.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
                        node.RoleCommand.v_ActionScriptFail = 0;
                        //if(this.RoleInfo.v_RoleNumber == 2)console.log(node.RoleCommand.v_RoleActionCommandArray1);
                        break;
                }
            }

            node.SetSceenPos(node.RoleInfo.v_RoleMapPos);
            var sceen = GamePublic.s_Vec2d(node.RoleGameInfo.v_SpritePos.x + GamePublic.g_MoveOff.x, node.RoleGameInfo.v_SpritePos.y + GamePublic.g_MoveOff.y);
            if (node.RoleGameInfo.v_SpriteShow) {
                //console.log('sceen.x = %d sceen.y = %d',sceen.x,sceen.y);
                if (sceen.x > GamePublic.g_winSize.width || sceen.x < 0 || sceen.y > GamePublic.g_winSize.height || sceen.y < 0) {
                    node.ShowSprite(false);
                }
            } else if (sceen.x < GamePublic.g_winSize.width && sceen.x > 0 && sceen.y < GamePublic.g_winSize.height && sceen.y > 0) {
                node.ShowSprite(true);
            }
        };

        //-----------------------------------------------------------------------------
        // Desc: 设置切换动画
        //-----------------------------------------------------------------------------

        node.SetRoleAction = function(_ActionName) {
            if (node.RoleGameInfo.v_RoleSprite) node.RoleGameInfo.v_RoleSprite.SetRoleAction(_ActionName);
            // switch (_ActionName) {
            //     /* case e_RoleAction.def:
            //         break; */
            //     case GamePublic.e_RoleAction.walk:{
            //         if (node.RoleGameInfo.v_RoleSprite) node.RoleGameInfo.v_RoleSprite.SetRoleAction(_ActionName);
            //         break;
            //     }
            //     case GamePublic.e_RoleAction.jump:{
            //         if (node.RoleGameInfo.v_RoleSprite) node.RoleGameInfo.v_RoleSprite.SetRoleAction(_ActionName);
            //         break;
            //     }
            // }
        }

        node.CalcRolePropertyData = function() {
            node.RoleInfo.v_RolePropertyData.HP = node.RoleInfo.v_RoleRacePropertyData.CON * 3;
            node.RoleInfo.v_RolePropertyData.NowHP = node.RoleInfo.v_RolePropertyData.HP;
            node.RoleInfo.v_RolePropertyData.MP = node.RoleInfo.v_RoleRacePropertyData.LER * 3;
            node.RoleInfo.v_RolePropertyData.NowMP = node.RoleInfo.v_RolePropertyData.MP;
            if (!node.RoleInfo.v_RolePropertyData.ATT) node.RoleInfo.v_RolePropertyData.ATT = 10;
            if (!node.RoleInfo.v_RolePropertyData.DEF) node.RoleInfo.v_RolePropertyData.DEF = 10;
            if (!node.RoleInfo.v_RolePropertyData.LEVEL) node.RoleInfo.v_RolePropertyData.LEVEL = 1;
            if (!node.RoleInfo.v_RolePropertyData.EXP) node.RoleInfo.v_RolePropertyData.EXP = 0;
        }

        node.SetRoleColor = function(i_brightness) {
            var bri = i_brightness * 0.01;
            if(node.RoleGameInfo.v_RoleSprite)node.RoleGameInfo.v_RoleSprite.v_Sprite.color = cc.color(255 * bri, 255 * bri, 255 * bri, node.RoleInfo.v_RoleOpacity);
        }

        node.StateCheck = function() {
            if (node.RoleInfo.v_RolePropertyData.NowHP <= 0 && node.RoleInfo.v_RoleType.RoleType == GamePublic.e_RoleTypeState.Life) {
                this.StopCommand("");
                this.RoleCommand.v_RoleActionCommandArray1.splice(node.RoleCommand.v_RoleActionCommandArray1.length - 1, node.RoleCommand.v_RoleActionCommandArray1.length);
                var src = new GamePublic.s_RoleScript({ Type:1, Name:GamePublic.e_CommandType.RoleDeath}, { Num: this.RoleInfo.v_RoleNumber, Array: "22", Pos: 123 }, {});
                this.RoleCommand.v_RoleActionCommandArray1.push(src);
                this.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.New;
                //node.RoleInfo.v_RoleType.RoleType = GamePublic.e_RoleTypeState.Death;
            }
        }

        node.SetRoleStateChange = function(v_State) {
            switch(v_State){
                case GamePublic.e_RoleTypeState.Death:{
                    this.SetMapPos({x:5,y:5});
                    this.ShowSprite(false);
                    this.RoleInfo.v_RoleType.RoleType = v_State;
                    console.log("e_RoleTypeState.Death");
                }
                case GamePublic.e_RoleTypeState.Life:{
                    this.SetMapPos(node.RoleInfo.v_RoleMapPos);
                    this.ShowSprite(true);
                    this.RoleInfo.v_RoleType.RoleType = v_State;
                }
            }
        }

        node.LoadSpriteRes();
        //node.MyUpdate();
        return node;
    }
};


module.exports = C_RoleSpine;