var GamePublic = require("./F_GamePublic");
var GameResManager = require("./F_GameResManager");
var BuildFrontDraw = require("./C_BuildFrontDraw");
// var s_BuildingInfo = function(_Name, _Image, _Type, _Size, _ResNeeds, _TechNeeds, _RoomLimit) {
//     var BuildInfo = {};
//     BuildInfo.Name = _Name;
//     BuildInfo.Image = _Image;
//     BuildInfo.Type = _Type;
//     BuildInfo.Size = _Size;
//     BuildInfo.ResNeeds = _ResNeeds; //需要的资源
//     BuildInfo.TechNeeds = _TechNeeds; //需要的科技
//     BuildInfo.RoomLimit = _RoomLimit;
//     return BuildInfo;
// }


var C_Building = {
    New: function (_BuildResName, _MapNum, _MapPoint, _BuildNum) {
        var node = {};
        node.Info = {  //写入保存数据
            v_Number: null, //建筑编号
            v_BuildOccupationType: null,//职业
            v_PropertyData: null, //数值
            v_BuildType: null,//建筑类型
            v_MapPos: null,//在当前地图的坐标
            v_CurrentMapNum: null,
            v_SpriteAngle: null, //角度
            v_Type: GamePublic.e_BaseObjType.Build,
            v_TargetType: GamePublic.e_BaseObjType.Role,
            v_State: null,//角色状态
            v_ShowRemove: false,
        };

        node.GameInfo = { //基本不写入保存数据
            v_BuildSprite: null,
            v_BuildSpriteLoad: false,
            //v_BuildSize: {width:0,height:0},
            v_SpriteSize: {width:0,height:0},
            v_SpriteScale: null,
            v_SpritePos: null,
            v_SpriteType: null,
            v_CurrentMap: null,
            v_SpriteData: null,
            v_ActionStage: null, //动作状态
            v_DtNumber: 0, //帧执行次数
            v_BuildCurAction: null,
            v_ActionNodeNumber: null, //当前动画总帧数
            v_SpriteNumber: null, //当前精灵动画执行到的帧数
            v_BuildCurActionSpriteNum: null,//当前建筑动画累计执行帧数
            //移动相关
            v_MapOffset: null, //移动偏移量？ 
            v_BlockType: null,//阻挡类型
            v_SpriteShow: null,//是否显示
            v_BuildSelectFlag: null,//是否被选中
            v_DrawNode: null,
        },

        node.Command = { //写入保存数据
            //指令
            v_BuildActionArray: null,
            v_BuildActionCurScriptArray: null,
            v_BuildActionCommandArray: [],
            v_BuildActionCommandState: null,
            v_BuildActionCommandArray1: [],
            v_BuildActionCommandState1: null,
            //脚本执行
            v_ActionCommand: null,
            v_ActionScriptFail: null,  //脚本失败次数
            v_ActionScriptFailType: null,//脚本失败原因
            v_ActionEvent: null,//事件
            v_ActionRunStage: null,
            v_ActionLoop: null,
            v_ActionConsoleType: null, //命令控制类型 1：倒计时控制，2：动画播放控制
            v_ActionWaitTime: 0,//动作消耗帧

            v_BuildTarNum: null,
            v_BuildTrarArray: [],
            v_BuildTradeShopNum: 0,//交易商店编号
        }
        
        node.LoadSpriteRes = function () {
            for (var i in GamePublic.g_resources2DMapTile) {
                if (GamePublic.g_resources2DMapTile[i].FileName == node.GameInfo.v_SpriteData.spritename && GamePublic.g_resources2DMapTile[i].LoadDone) {
                    node.GameInfo.v_BuildSprite = cc.instantiate(GamePublic.g_resources2DMapTile[i].FileData);
                    node.GameInfo.v_SpriteSize.width = node.GameInfo.v_BuildSprite.getBoundingBox().width;
                    node.GameInfo.v_SpriteSize.height = node.GameInfo.v_BuildSprite.getBoundingBox().height;
                    node.GameInfo.v_CurrentMap.v_MapShowNode.addChild(node.GameInfo.v_BuildSprite,(node.GameInfo.v_CurrentMap.v_MapSize.x * node.GameInfo.v_CurrentMap.v_MapSize.y) -
                    (node.Info.v_MapPos.x + node.Info.v_MapPos.y * node.GameInfo.v_CurrentMap.v_MapSize.x));
                    node.GameInfo.v_CurrentMap.v_MapShowNode.addChild(node.GameInfo.v_DrawNode, node.GameInfo.v_BuildSprite.zIndex);
                    if (!node.GameInfo.v_BuildCreate) { node.Create(); }
                }
            }
            if(node.GameInfo.v_BuildSprite == null)console.log(node.GameInfo.v_SpriteData.spritename,"资源没有加载");
        };

        node.GetNumber = function(){
            return node.Info.v_Number;
        }

        node.SetSceenPos = function (_pos) {
            node.Info.v_MapPos = _pos;
            node.GameInfo.v_SpritePos = GamePublic.s_Vec2d(_pos.x * (node.GameInfo.v_CurrentMap.v_MapTiledSize.x * GamePublic.g_SceenScale) + node.GameInfo.v_SpriteSize.width * 0.5,
                _pos.y * (node.GameInfo.v_CurrentMap.v_MapTiledSize.y * GamePublic.g_SceenScale) + node.GameInfo.v_SpriteSize.height * 0.5);

            if (node.GameInfo.v_BuildSprite) {
                node.GameInfo.v_BuildSprite.setPosition(node.GameInfo.v_SpritePos);
                node.GameInfo.v_DrawNode.setPosition(node.GameInfo.v_SpritePos);
            }
            if (node.GameInfo.v_BuildSprite) node.GameInfo.v_BuildSprite.setScale(node.GameInfo.v_SpriteScale);
        };

        node.Create = function () {
            var obj = GamePublic.s_ObjInfo("Build", 1, node);
            GamePublic.g_GameDataResManger.AddBuild(obj);
            node.GameInfo.v_SpriteScale = 1;
            node.SetSceenPos(node.Info.v_MapPos);
            node.GameInfo.v_SpriteShow = true;
            node.GameInfo.v_BuildCreate = true;
            node.GameInfo.v_FrontDraw = BuildFrontDraw.New(node, node.GameInfo.v_DrawNode, 1);
            this.Build();
        };

        node.Build = function () {
            this.BuildMapShow();
        };

        node.BuildMapShow = function () {
            for(let i = 0; i < node.GameInfo.v_SpriteData.BuildSize.width; i++){
                for(let j = 0; j < node.GameInfo.v_SpriteData.BuildSize.height; j++){
                    node.GameInfo.v_CurrentMap.MapRoomArray[node.Info.v_MapPos.x + i][node.Info.v_MapPos.y + j].MoveInRole(node.Info.v_Number, node.Info.v_Type);
                }
            }
        };

        node.BuildMapRemove = function () {
            for(let i = 0; i < node.GameInfo.v_SpriteData.BuildSize.width; i++){
                for(let j = 0; j < node.GameInfo.v_SpriteData.BuildSize.height; j++){
                    node.GameInfo.v_CurrentMap.MapRoomArray[node.Info.v_MapPos.x + i][node.Info.v_MapPos.y + j].MoveOutRole(node.Info.v_Number, node.Info.v_Type);
                }
            }
        };

        node.GetBuildPoint = function () {
            var point = []
            for(let i = 0; i < node.GameInfo.v_SpriteData.BuildSize.width; i++){
                for(let j = 0; j < node.GameInfo.v_SpriteData.BuildSize.height; j++){
                    point.push({x: node.Info.v_MapPos.x + i, y: node.Info.v_MapPos.y + j});
                }
            }
            return point;
        };

        node.MyUpdate = function() {
            if (!node.GameInfo.v_BuildCreate) {
                if (!node.GameInfo.v_BuildSprite) {
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

            node.SetSceenPos(node.Info.v_MapPos);
            var sceen = GamePublic.s_Vec2d(node.GameInfo.v_SpritePos.x + GamePublic.g_MoveOff.x, node.GameInfo.v_SpritePos.y + GamePublic.g_MoveOff.y);
            if (node.GameInfo.v_SpriteShow) {
                //console.log('sceen.x = %d sceen.y = %d',sceen.x,sceen.y);
                if (sceen.x > GamePublic.g_winSize.width || sceen.x < 0 || sceen.y > GamePublic.g_winSize.height || sceen.y < 0) {
                    node.ShowSprite(false);
                }
            } else if (sceen.x < GamePublic.g_winSize.width && sceen.x > 0 && sceen.y < GamePublic.g_winSize.height && sceen.y > 0 && node.Info.v_ShowRemove == false) {
                node.ShowSprite(true);
            }
            node.StateCheck();
        };
        
        node.ShowSprite = function(_show) {
           if (_show) {
                if (node.GameInfo.v_BuildSprite && !node.GameInfo.v_BuildSprite.active) node.GameInfo.v_BuildSprite.active = true;
                node.GameInfo.v_SpriteShow = true;
            } else {
                if (node.GameInfo.v_BuildSprite && node.GameInfo.v_BuildSprite.active) node.GameInfo.v_BuildSprite.active = false;
                node.GameInfo.v_SpriteShow = false;
            }
        }

        node.Destroy = function() {
            node.ClearBuildCommand(GamePublic.e_RoleCommandType.Command);
            node.SetMapPos({x:15,y:15});
            node.BuildMapRemove();
            node.BuildMapBuild();
            node.Info.v_ShowRemove = true;
            node.Info.v_State.TypeState = GamePublic.e_TypeState.Death;
            //console.log("e_BuildTypeState.Death",this.Info.v_Number);
        }

        node.StateCheck = function() {
            if (node.Info.v_State.TypeState == GamePublic.e_TypeState.Life && node.Info.v_PropertyData.NowHP <= 0) {
                node.Destroy();
            }
        }

        node.SetMapPos = function(_mappos) {
            node.Info.v_MapPos = _mappos;
        }

        node.ClearBuildCommand = function(v_Type) {
            switch(v_Type){
                case GamePublic.e_RoleCommandType.Command:{
                    //node.GameInfo.v_DtNumber = GamePublic.e_RoleSpeed.fps;
                    node.Command.v_ActionWaitTime = 0;
                    node.Command.v_BuildActionCommandArray.splice(0,node.Command.v_BuildActionCommandArray.length);
                    break;
                }
                case GamePublic.e_RoleCommandType.Command1:{
                    node.Command.v_BuildActionCommandArray1.splice(0, node.Command.v_BuildActionCommandArray1.length);
                    node.Command.v_BuildActionCommandArray1 = GamePublic.e_ActionCommandState.New;
                    node.Command.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
                    node.Command.v_ActionScriptFail = 0;
                    break;
                }
                case GamePublic.e_RoleCommandType.Passive:{
                    break;
                }
            }
        }

        node.Info.v_PropertyData = GamePublic.s_BuildPropertyData(GamePublic.e_BuildType.MilitaryCamp);
        node.Info.v_Number = _BuildNum;
        node.Info.v_CurrentMapNum = _MapNum;
        node.Info.v_MapPos = _MapPoint;
        node.Info.v_State = GamePublic.s_RoleType();
        node.GameInfo.v_CurrentMap = GamePublic.g_GameDataResManger.GetMap(_MapNum); //当前地图实体
        node.GameInfo.v_SpriteData = GameResManager.getSpriteResData(_BuildResName, GamePublic.e_SpriteResType.Build);
        node.Info.v_MapPos = GamePublic.s_Rect(_MapPoint.x, _MapPoint.y,1,1);
        node.Info.v_SpriteAngle = { Def: 0, Cur: 0, Des: 0 };//建筑朝向角度
        node.GameInfo.v_DrawNode = new cc.Node();
        
        node.LoadSpriteRes();
        return node;
    }
}

module.exports = C_Building;