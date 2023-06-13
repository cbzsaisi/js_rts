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

        node.Info = { //写入保存数据
                v_Number: null, //角色编号
                v_RoleRaceType: null, //角色种族
                v_RoleRacePropertyData: {}, //种族属性数据
                v_PropertyData: {}, //角色属性数据
                v_Occupation: null, //角色职业
                v_WorkSkill: [], //角色工作技能
                v_MapPos: null, //在当前地图的坐标
                v_State: null,//角色状态
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
                v_Type: GamePublic.e_BaseObjType.Role,
                v_TargetType: GamePublic.e_BaseObjType.Role,
            },

            node.GameInfo = { //基本不写入保存数据
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
                v_SpriteActionCommandIs: false,//动画动作事件是否开始
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
            node.Command = { //写入保存数据
                //指令
                v_ActionArray: null,
                v_ActionCurScriptArray: null,
                v_ActionCommandArray: [],
                v_ActionCommandState: null,
                v_ActionCommandArray1: [],
                v_ActionCommandState1: null,
                v_ActionCommandArray1Number: null,
                v_ActionCommandArray2: [],
                v_ActionCommandState2: null,
                v_ActionCommandArray2Number: null,
                v_ActionCommandPassive: [],
                v_ActionCommandPassiveState: null,
                //脚本执行
                v_ActionCommand: null,
                v_ActionScriptFail: null, //脚本失败次数
                v_ActionScriptFailType: null, //脚本失败原因
                v_ActionEvent: null, //事件
                v_ActionRunStage: null,
                v_ActionLoop: null,
                v_ActionConsoleType: null, //命令控制类型 1：倒计时控制，2：动画播放控制
                v_ActionWaitTime: 0, //动作消耗帧

                v_TarNum: null,
                v_TrarArray: [],
                v_TradeShopNum: 0, //交易商店编号
            },

            //初始化
        node.Info.v_Number = _RoleNumber;
        node.Info.v_MapPos = GamePublic.s_Vec2d(_MapPoint.x, _MapPoint.y);
        //node.Info.v_MapPos = GamePublic.s_Rect(_MapPoint.x, _MapPoint.y, 1, 1);
        node.Info.v_RoleBagSize = 20, //当前背包大小
        node.Info.v_CurrentMapNum = _MapNum;
        node.Info.v_RoleBag = Array(50), //背包
        node.Info.v_RolePassStatu = GamePublic.e_RolePassStatu.land;
        node.Info.v_RoleEquip = Array(10), //装备背包
        node.Info.v_State = GamePublic.s_RoleType();

        node.GameInfo.v_SpriteType = GamePublic.e_SpriteType.spine;
        node.GameInfo.v_RoleAttackType = { AttackType: GamePublic.e_RoleAttackType.left_hand, Skill: "Left" };
        node.GameInfo.v_SpriteData = GameResManager.getSpriteResData(_RoleResName, GamePublic.e_SpriteResType.Role);
        node.GameInfo.v_CurrentMap = GamePublic.g_GameDataResManger.GetMap(_MapNum); //当前地图实体
        node.GameInfo.v_SpriteShow = false;
        node.GameInfo.v_MapOffset = GamePublic.s_Vec2d(0, 0);

        node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.New;
        node.Command.v_ActionConsoleType = 1;
        node.Command.v_ActionLoop = false;
        node.Command.v_TradeShopNum = 1;
        node.Command.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.play;

        node.GameInfo.v_DrawNode = new cc.Node();
        node.GameInfo.v_DrawNode.is3DNode = false;
        //var qu = cc.quat(0, 0, 0).fromEuler({ x: -15, y: 0, z: 0 });
        //node.GameInfo.v_DrawNode.setRotation(qu);
        node.GameInfo.v_CurrentMap.v_MapShowNode.addChild(node.GameInfo.v_DrawNode, 2000);

        node.Info.v_SpriteAngle = { Def: 0, Cur: 0, Des: 0 }; //角色朝向角度
        //node.Info.v_RoleBag[3] = GamePublic.g_ItemManager.CreateItem(GamePublic.e_ItemName.Sword1);
        //node.Info.v_RoleBag[2] = GamePublic.g_ItemManager.CreateItem(GamePublic.e_ItemName.Gold);
        node.Create = function() {
            var obj = GamePublic.s_ObjInfo("Role", node.Info.v_Number, node);
            GamePublic.g_GameDataResManger.AddRole(obj);
            //node.GameInfo.v_RoleSprite.v_Sprite.opacity = 100;
            //node.GameInfo.v_CurrentMap.v_MapShowNode.addChild(node.GameInfo.v_RoleSprite.v_Sprite, 2);
            node.SetSceenPos(node.Info.v_MapPos);
            node.GameInfo.v_SpriteShow = true;
            node.GameInfo.v_SpriteScale = {x:node.GameInfo.v_SpriteData.SpriteScale, y:node.GameInfo.v_SpriteData.SpriteScale};
            node.GameInfo.v_CurrentMap.MapRoomArray[node.Info.v_MapPos.x][node.Info.v_MapPos.y].MoveInRole(node.Info.v_Number, node.Info.v_Type);

            //node.GameInfo.v_FrontDrawFlag = true;
            node.GameInfo.v_FrontDraw = RoleFrontDraw.New(node, node.GameInfo.v_DrawNode, 1);

            node.Info.v_RoleRaceType = GamePublic.e_RoleRaceType.Human;
            node.Info.v_RoleRacePropertyData = g_RoleManager.InitRoleRacePropertyData(node.Info.v_Number);
            node.Info.v_PropertyData = GamePublic.s_RolePropertyData("");
            node.CalcRolePropertyData();

            node.Info.v_Occupation = GamePublic.e_RoleOccupationType.Warrior;
            node.Info.v_WorkSkill.push(g_RoleManager.GetCareerSkill(node.Info.v_Occupation));

            GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Sword1, 1, node.Info.v_Number, "Role");
            GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Gold, 10, node.Info.v_Number, "Role");
            GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Gold, 2, node.Info.v_Number, "Role");
            //GamePublic.g_ItemManager.RoleEquip(node.Info.v_Number,3); //装备
            //this.SetRoleAction(GamePublic.e_RoleAction.walk);
            node.GameInfo.v_RoleCreate = true;
        };

        node.LoadSpriteRes = function() {
            for (var i in GamePublic.g_resourcesSpineboy) {
                if (GamePublic.g_resourcesSpineboy[i].FileName == node.GameInfo.v_SpriteData.spritename && GamePublic.g_resourcesSpineboy[i].LoadDone) {
                    node.GameInfo.v_RoleSprite = g_Spine.New(node, GamePublic.g_resourcesSpineboy[i].FileData);
                    //node.GameInfo.v_RoleSprite.v_Sprite.color = cc.color(100, 100, 100, 255);
                    node.SetRoleColor(90);
                    if (!node.GameInfo.v_RoleCreate) {
                        node.Create();
                    }
                }
            }
            /* if(!node.GameInfo.v_RoleSprite){
                cc.loader.loadRes(node.GameInfo.v_SpriteData.spritename, function (err, prefab) {
                    node.GameInfo.v_RoleSprite = g_3dSprite.New(node,prefab);
                    if(!node.GameInfo.v_RoleCreate){
                        node.Create();
                    }
                });
            } */
        };
        node.GetNumber = function() {
            return node.Info.v_Number;
        }
        node.SetSceenPos = function(_pos) {
            node.Info.v_MapPos = _pos;
            /*node.GameInfo.v_SpritePos = GamePublic.s_Vec2d(Math.round((_pos.x - _pos.y + 1) * (node.GameInfo.v_CurrentMap.v_MapTiledSize.x * 0.5) * GamePublic.g_SceenScale),
            Math.round((_pos.y + _pos.x + 1) * (node.GameInfo.v_CurrentMap.v_MapTiledSize.y * 0.5) * GamePublic.g_SceenScale));*/
            // node.GameInfo.v_SpritePos = GamePublic.s_Vec2d(_pos.x * (node.GameInfo.v_CurrentMap.v_MapTiledSize.x * GamePublic.g_SceenScale),
            //     _pos.y * (node.GameInfo.v_CurrentMap.v_MapTiledSize.y * GamePublic.g_SceenScale));// + node.GameInfo.v_SpriteSize.height * 0.5);
            node.GameInfo.v_SpritePos = node.GameInfo.v_CurrentMap.MapRoomArray[_pos.x][_pos.y].v_SpritePos;
            //node.GameInfo.v_SpritePos.y += 12;
            if (node.Command.v_ActionEvent == GamePublic.e_RoleAction.walk) {
                node.GameInfo.v_SpritePos.x += node.Command.v_ActionWaitTime * node.GameInfo.v_MapOffset.x;
                node.GameInfo.v_SpritePos.y += node.Command.v_ActionWaitTime * node.GameInfo.v_MapOffset.y;
            }
            if (node.GameInfo.v_RoleSprite) {
                //node.GameInfo.v_RoleSprite.v_Sprite.setPosition(GamePublic.s_Vec2d(0, 0));
                node.GameInfo.v_RoleSprite.v_Sprite.setPosition(node.GameInfo.v_SpritePos);
                node.GameInfo.v_DrawNode.setPosition(node.GameInfo.v_SpritePos);
            }

            var zindex = (node.GameInfo.v_CurrentMap.v_MapSize.x * node.GameInfo.v_CurrentMap.v_MapSize.y) -
                (node.Info.v_MapPos.x + node.Info.v_MapPos.y * node.GameInfo.v_CurrentMap.v_MapSize.x);
            if (node.GameInfo.v_RoleSprite) node.GameInfo.v_RoleSprite.v_Sprite.zIndex = zindex + 1;
            if (node.GameInfo.v_SpriteScale) node.GameInfo.v_RoleSprite.v_Sprite.scaleX = node.GameInfo.v_SpriteScale.x;
            if (node.GameInfo.v_SpriteScale) node.GameInfo.v_RoleSprite.v_Sprite.scaleY = node.GameInfo.v_SpriteScale.y;
            //if (this.v_TileSprite) this.v_TileSprite.setScale(g_SceenScale);
        };

        node.SetMapPos = function(_mappos) {
            node.GameInfo.v_CurrentMap.MapRoomArray[node.Info.v_MapPos.x][node.Info.v_MapPos.y].MoveOutRole(node.Info.v_Number, node.Info.v_Type);
            node.Info.v_MapPos = _mappos;
            node.GameInfo.v_CurrentMap.MapRoomArray[node.Info.v_MapPos.x][node.Info.v_MapPos.y].MoveInRole(node.Info.v_Number, node.Info.v_Type);
        }

        node.StopCommand = function(_Type) {
            node.GameInfo.v_DtNumber = GamePublic.e_RoleSpeed.fps;
            node.Command.v_ActionWaitTime = 0;
            node.Command.v_ActionCommandArray.splice(0, node.Command.v_ActionCommandArray.length);
        }

        node.ShowSprite = function(_show) {
            if (_show) {
                if (node.GameInfo.v_RoleSprite && !node.GameInfo.v_RoleSprite.v_Sprite.active) node.GameInfo.v_RoleSprite.v_Sprite.active = true;
                node.GameInfo.v_SpriteShow = true;
            } else {
                if (node.GameInfo.v_RoleSprite && node.GameInfo.v_RoleSprite.v_Sprite.active) node.GameInfo.v_RoleSprite.v_Sprite.active = false;
                node.GameInfo.v_SpriteShow = false;
            }
        }

        node.MyUpdate = function() {
            if (!node.GameInfo.v_RoleCreate) {
                if (!node.GameInfo.v_RoleSprite) {
                    node.LoadSpriteRes();
                }
                return;
            }
            node.GameInfo.v_DtNumber++;
            if (node.GameInfo.v_DtNumber >= (GamePublic.e_RoleSpeed.fps)) {
                node.GameInfo.v_DtNumber = 0;
                if (node.Command.v_ActionConsoleType == 1 && node.Command.v_ActionWaitTime > 0) { //当前动作总耗时帧
                    node.Command.v_ActionWaitTime -= GamePublic.g_GameTimeDt;
                }
                if (node.GameInfo.v_FrontDraw) node.GameInfo.v_FrontDraw.update();
            }
            
            if (node.Command.v_ActionWaitTime < 1) {
                //if(this.Info.v_Number == 1)console.log("命令数量",node.Command.v_ActionCommandArray.length);
                if (node.Command.v_ActionCommandArray.length) {
                    let level = 1;
                    let ComNum = 0;
                    let res = node.GetCommandNum(level,ComNum,node.Command.v_ActionCommandArray);
                    ComNum = res.Num;
                    level = res.level;
                    //console.log("**************",level,ComNum);
                    // node.Command.v_ActionCommand = node.Command.v_ActionCommandArray.splice(node.Command.v_ActionCommandArray.length - 1, 1);
                    
                    // RoleSrcipt.CommandSrciptProc(node.Command.v_ActionCommand[0]);
                }
                else if (node.Command.v_ActionEvent != GamePublic.e_RoleAction.def && node.GameInfo.v_RoleSprite) {
                    // 无指令 停止动作
                    // var seft = node.GameInfo.v_RoleSprite.v_Sprite.getComponent(cc.SkeletonAnimation);
                    // seft.stop(); 
                    node.Command.v_ActionEvent = GamePublic.e_RoleAction.def;
                    node.Command.v_ActionLoop = false;
                    //if(this.v_NodeActionCommandState1 == e_ActionCommandState.Run)this.v_NodeActionCommandState1 = e_ActionCommandState.End;
                    //空闲
                    this.v_ActionCommand = 0;
                    node.Command.v_ActionWaitTime = 0;
                    node.Command.v_ActionCommand = null;
                    //if(this.v_Sprite.v_ActionStage != e_SpriteActionName.jump){C_RoleManager.SetRoleAction(this.v_Sprite,e_SpriteActionName.jump);}
                }
            }else if(node.Command.v_ActionLoop == true && node.Command.v_ActionRunStage == GamePublic.e_SpriteActionRunStage.stop){
                //循环执行动作 直到v_ActionWaitTime 为0以下
                //this.SetRoleAction(node.Command.v_ActionEvent);
            }

            node.StateCheck();

            if (node.Command.v_ActionCommandPassive.length) {
                var Command = node.Command.v_ActionCommandPassive.splice(0, 1);
                var SrcExeState = RoleSrcipt.RoleActionCommandPassiveProc(Command[0]);
                if (SrcExeState == GamePublic.e_CommandSrcipt.Success) {
                    //node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.Run;
                } else {
                    //node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.End;
                }
            }

            // if (node.Command.v_ActionCommandArray1.length) {
            //     switch (node.Command.v_ActionCommandState1) {
            //         case GamePublic.e_ActionCommandState.New:
            //             var Command = node.Command.v_ActionCommandArray1[node.Command.v_ActionCommandArray1.length - 1];
            //             //if(this.Info.v_Number == 1)console.log("命令数量",node.Command.v_ActionCommandArray1.length);
            //             var SrcExeState = RoleSrcipt.CommandSrciptProc1(Command);
            //             if (SrcExeState == GamePublic.e_CommandSrcipt.Success) {
            //                 node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.Run;
            //             } else {
            //                 node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.End;
            //             }
            //             node.Command.v_ActionCommandArray1Number = node.Command.v_ActionCommandArray1.length;
            //             break;
            //         case GamePublic.e_ActionCommandState.Run:
            //             if (node.Command.v_ActionScriptFailType != GamePublic.e_ActionScriptFailType.Success) { //如果未成功 但错误次数未到 重新跑
            //                 if (node.Command.v_ActionScriptFail < 3) {
            //                     console.log("失败一次");
            //                     node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.New;
            //                     node.Command.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
            //                 } else {
            //                     node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.End;
            //                 }
            //             } else { //执行未报错  检查执行情况 如果时间结束 并且当前动作指令为空就执行以下
            //                 if (node.Command.v_ActionWaitTime < 1 && node.Command.v_ActionCommandArray.length == 0) {
            //                     node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.End;
            //                 }
            //             }
            //             break;
            //         case GamePublic.e_ActionCommandState.Stop:
            //             //console.log("e_ActionCommandState.Stop");
            //             break;
            //         case GamePublic.e_ActionCommandState.End:
            //             //if(this.Info.v_Number == 1)console.log(node.Command.v_ActionCommandArray1.length);
            //             if(RoleSrcipt.Command1StateCheckSrciptProc(this.Info.v_Number) == GamePublic.e_CommandResultSrcipt.Success){
            //                 node.Command.v_ActionCommandArray1.splice(node.Command.v_ActionCommandArray1Number - 1, 1);
            //                 node.Command.v_ActionCommandArray1Number = node.Command.v_ActionCommandArray1.length;
            //                 //if(this.Info.v_Number == 1)console.log(node.Command.v_ActionCommandArray1.length);
            //             }
            //             node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.New;
            //             node.Command.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
            //             node.Command.v_ActionScriptFail = 0;
            //             //if(this.Info.v_Number == 1)console.log(node.Command.v_ActionCommandArray1.length);
            //             break;
            //     }
            // }

            node.SetSceenPos(node.Info.v_MapPos);
            var sceen = GamePublic.s_Vec2d(node.GameInfo.v_SpritePos.x + GamePublic.g_MoveOff.x, node.GameInfo.v_SpritePos.y + GamePublic.g_MoveOff.y);
            if (node.GameInfo.v_SpriteShow) {
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

        node.SetRoleAction = function(v_ActionName) {
            //if (node.GameInfo.v_RoleSprite) node.GameInfo.v_RoleSprite.SetRoleAction(_ActionName);
            switch (v_ActionName) {
                /* case e_RoleAction.def:
                    break; */
                case GamePublic.e_RoleAction.walk:{
                    if (node.GameInfo.v_RoleSprite) node.GameInfo.v_RoleSprite.SetRoleAction(v_ActionName);
                    break;
                }
                case GamePublic.e_RoleAction.jump:{
                    if (node.GameInfo.v_RoleSprite) node.GameInfo.v_RoleSprite.SetRoleAction(v_ActionName);
                    break;
                }
            }
        }

        node.CalcRolePropertyData = function() {
            node.Info.v_PropertyData.HP = node.Info.v_RoleRacePropertyData.CON * 3;
            node.Info.v_PropertyData.NowHP = node.Info.v_PropertyData.HP;
            node.Info.v_PropertyData.MP = node.Info.v_RoleRacePropertyData.LER * 3;
            node.Info.v_PropertyData.NowMP = node.Info.v_PropertyData.MP;
            if (!node.Info.v_PropertyData.ATT) node.Info.v_PropertyData.ATT = 10;
            if (!node.Info.v_PropertyData.DEF) node.Info.v_PropertyData.DEF = 10;
            if (!node.Info.v_PropertyData.LEVEL) node.Info.v_PropertyData.LEVEL = 1;
            if (!node.Info.v_PropertyData.EXP) node.Info.v_PropertyData.EXP = 0;
        }

        node.SetRoleColor = function(i_brightness) {
            var bri = i_brightness * 0.01;
            if(node.GameInfo.v_RoleSprite)node.GameInfo.v_RoleSprite.v_Sprite.color = cc.color(255 * bri, 255 * bri, 255 * bri, node.Info.v_RoleOpacity);
        }

        node.StateCheck = function() {
            if (node.Info.v_PropertyData.NowHP <= 0 && node.Info.v_State.TypeState == GamePublic.e_TypeState.Life) {
                //this.StopCommand(""); //角色亡
                node.Destroy();
                //node.Info.v_State.TypeState = GamePublic.e_TypeState.Death;
            }
        }

        node.Destroy = function() {
            this.ClearRoleCommand(GamePublic.e_RoleCommandType.Command);
            this.Command.v_ActionCommandArray1.splice(0, node.Command.v_ActionCommandArray1.length);
            node.Command.v_ActionCommandArray1Number = 0;
            var src = new GamePublic.s_RoleScript({ Info:{ComNum:1,ComLevel:2,ComWeight:10}, Name:GamePublic.e_CommandType.RoleDeath}, { Num: this.Info.v_Number, Array: "22", Pos: 123 }, {});
            this.Command.v_ActionCommandArray1.push(src);
            this.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.New;
        }

        node.SetRoleStateChange = function(v_State) {
            switch(v_State){
                case GamePublic.e_TypeState.Death:{
                    this.SetMapPos({x:5,y:5});
                    this.ShowSprite(false);
                    this.Info.v_State.TypeState = v_State;
                    console.log("e_TypeState.Death",this.Info.v_Number);
                    break;
                }
                case GamePublic.e_TypeState.Life:{
                    this.SetMapPos(node.Info.v_MapPos);
                    this.ShowSprite(true);
                    this.Info.v_State.TypeState = v_State;
                    break;
                }
            }
        }

        node.ClearRoleCommand = function(v_Type) {
            switch(v_Type){
                case GamePublic.e_RoleCommandType.Command:{
                    node.GameInfo.v_DtNumber = GamePublic.e_RoleSpeed.fps;
                    //node.Command.v_ActionWaitTime = 0;
                    node.Command.v_ActionCommandArray.splice(0,node.Command.v_ActionCommandArray.length);
                    break;
                }
                case GamePublic.e_RoleCommandType.Command1:{
                    node.Command.v_ActionCommandArray1.splice(0, node.Command.v_ActionCommandArray1.length);
                    node.Command.v_ActionCommandArray1Number = 0;
                    node.Command.v_ActionCommandState1 = GamePublic.e_ActionCommandState.New;
                    node.Command.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
                    node.Command.v_ActionScriptFail = 0;
                    //if(node.Info.v_Number == 1)console.log(node.Command.v_ActionCommandArray1.length);
                    break;
                }
                case GamePublic.e_RoleCommandType.Passive:{
                    break;
                }
            }
        }

        node.GetPowerValue = function (v_attack_type) {
            var RolePowerValue = GamePublic.s_RolePowerValue(0,0,{},0,0,{},[]);
            switch(v_attack_type.Type.AttackType){
                case GamePublic.e_RoleAttackType.left_hand:{
                    let Equip = node.Info.v_RoleEquip[GamePublic.e_EquipType.Hand];
                    if (Equip == null) break;
                    RolePowerValue.p_Attack += Equip.EquipIncreaseValue.Att;
                    break;
                }
            }
            //计算角色的攻击防御值
            return RolePowerValue;
        }

        node.GetCommandNum = function(v_Level, v_Number, v_Array){
            for(let i = 0; i < v_Array.length; i++){
                if(v_Array[i].Script.Info.ComLevel == v_Level){
                    if(v_Number == 0){
                        v_Number = v_Array[i].Script.Info.ComNum;
                    }else if(v_Number > v_Array[i].Script.Info.ComNum){
                        v_Number = v_Array[i].Script.Info.ComNum;
                    }
                }
            }
            if(v_Number == 0){
                v_Level += 1;
                node.GetCommandNum(v_Level, v_Number, v_Array);
            }else{
                //console.log("找到",v_Level, v_Number);
                return {level:v_Level, Num:v_Number};
            }
            console.log("结束寻找");
        }
        node.LoadSpriteRes();
        //node.MyUpdate();
        return node;
    }
};


module.exports = C_RoleSpine;