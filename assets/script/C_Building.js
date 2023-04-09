var GamePublic = require("./F_GamePublic");
var GameResManager = require("./F_GameResManager");
var g_3dSprite = require("./C_3DSprite");

// var s_BuildingInfo = function(_Name, _Image, _Type, _Size, _ResNeeds, _TechNeeds, _RoomLimit) {
//     var RoleInfo = {};
//     RoleInfo.Name = _Name;
//     RoleInfo.Image = _Image;
//     RoleInfo.Type = _Type;
//     RoleInfo.Size = _Size;
//     RoleInfo.ResNeeds = _ResNeeds; //需要的资源
//     RoleInfo.TechNeeds = _TechNeeds; //需要的科技
//     RoleInfo.RoomLimit = _RoomLimit;
//     return RoleInfo;
// }


var C_Building = {
    New: function (_BuildResName, _BuildNum, _MapNum, _MapPoint, _Room) {
        var node = {};
        node.Room = _Room;

        node.RoleInfo = {  //写入保存数据
            v_BuildNumber: null, //角色编号
            v_BuildOccupationType: null,//职业
            v_BuildRaceType: null,//角色种族
            v_BuildMapPos: null,//在当前地图的坐标
            v_CurrentMapNum: null,
            v_SpriteAngle: null, //角度
        };

        node.RoleGameInfo = { //基本不写入保存数据
            v_BuildSprite: null,
            v_BuildSpriteLoad: false,
            v_BuildSpriteSize: null,
            v_SpriteSize: null,
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
            v_BuildCurActionSpriteNum: null,//当前角色动画累计执行帧数
            //移动相关
            v_MapOffset: null, //移动偏移量？ 
            v_BlockType: null,//阻挡类型
            v_SpriteShow: null,//是否显示
            v_BuildSelectFlag: null,//是否被选中
            v_DrawNode: null,
        },
        node.RoleCommand = { //写入保存数据
            //指令
            v_BuildActionArray: null,
            v_BuildActionCurScriptArray: null,
            v_BuildActionCommandArray: [],
            v_BuildActionCommandState: null,
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
            for (var i in GamePublic.g_resources3d1) {
                if (GamePublic.g_resources3d1[i].FileName == node.RoleGameInfo.v_SpriteData.spritename && GamePublic.g_resources3d1[i].LoadDone) {
                    node.RoleGameInfo.v_BuildSprite = g_3dSprite.New(node, GamePublic.g_resources3d1[i].FileData);
                    if (!node.RoleGameInfo.v_BuildCreate) {
                        node.Create();
                    }
                }
            }
        };

        node.GetNumber = function(){
            return node.RoleInfo.v_BuildNumber;
        }

        node.SetSceenPos = function (_pos) {
            node.RoleInfo.v_BuildMapPos = _pos;
            node.RoleGameInfo.v_SpritePos = GamePublic.s_Vec2d(_pos.x * (node.RoleGameInfo.v_CurrentMap.v_MapTiledSize.x * GamePublic.g_SceenScale),
                _pos.y * (node.RoleGameInfo.v_CurrentMap.v_MapTiledSize.y * GamePublic.g_SceenScale));

            if (node.RoleGameInfo.v_BuildSprite) {
                node.RoleGameInfo.v_BuildSprite.v_Sprite.setPosition(GamePublic.s_Vec2d(0, 0));

                var DistAngle = node.RoleInfo.v_SpriteAngle.Des - node.RoleInfo.v_SpriteAngle.Cur;
                if (DistAngle > 5) {
                    if (DistAngle > 180) {
                        node.RoleInfo.v_SpriteAngle.Cur -= 5;
                        if (node.RoleInfo.v_SpriteAngle.Cur < 0) node.RoleInfo.v_SpriteAngle.Cur = 360;
                    }
                    else {
                        node.RoleInfo.v_SpriteAngle.Cur += 5;
                        if (node.RoleInfo.v_SpriteAngle.Cur > 360) node.RoleInfo.v_SpriteAngle.Cur = 0;
                    }
                }
                else if (DistAngle < -5) {
                    if (DistAngle < -180) {
                        node.RoleInfo.v_SpriteAngle.Cur += 5;
                        if (node.RoleInfo.v_SpriteAngle.Cur > 360) node.RoleInfo.v_SpriteAngle.Cur = 0;
                    }
                    else {
                        node.RoleInfo.v_SpriteAngle.Cur -= 5;
                        if (node.RoleInfo.v_SpriteAngle.Cur < 0) node.RoleInfo.v_SpriteAngle.Cur = 360;
                    }
                }
                var qu = cc.quat(0, 0, 0).fromEuler({ x: 90, y: 0, z: node.RoleInfo.v_SpriteAngle.Cur });
                node.RoleGameInfo.v_BuildSprite.v_Sprite.setRotation(qu);
                node.RoleGameInfo.v_BuildSprite.v_Sprite.setPosition(node.RoleGameInfo.v_SpritePos);
                node.RoleGameInfo.v_DrawNode.setPosition(node.RoleGameInfo.v_SpritePos);
            }
            if (node.RoleGameInfo.v_BuildSprite) node.RoleGameInfo.v_BuildSprite.v_Sprite.setScale(node.RoleGameInfo.v_SpriteScale);
        };

        node.Create = function () {
            var obj = GamePublic.s_ObjInfo("Build", 1, node);
            GamePublic.g_GameDataResManger.AddBuild(obj);
            node.RoleGameInfo.v_BuildSprite.v_Sprite.opacity = 100;
            node.RoleGameInfo.v_SpriteScale = 20;
            node.SetSceenPos(node.RoleInfo.v_BuildMapPos);
            node.RoleGameInfo.v_SpriteShow = true;

            //node.RoleGameInfo.v_CurrentMap.MapRoomArray[node.RoleInfo.v_BuildMapPos.x][node.RoleInfo.v_BuildMapPos.y].MoveInBuild(node.RoleInfo.v_BuildNumber);
            node.RoleGameInfo.v_BuildCreate = true;
        };
        
        node.RoleInfo.v_BuildNumber = _BuildNum;
        node.RoleInfo.v_CurrentMapNum = _MapNum;
        node.RoleInfo.v_BuildMapPos = _MapPoint;
        node.RoleGameInfo.v_CurrentMap = GamePublic.g_GameDataResManger.GetMap(_MapNum); //当前地图实体
        node.RoleGameInfo.v_SpriteData = GameResManager.getSpriteResData(_BuildResName);
        node.RoleInfo.v_RoleMapPos = GamePublic.s_Rect(_MapPoint.x, _MapPoint.y,1,1);
        node.RoleInfo.v_SpriteAngle = { Def: 0, Cur: 0, Des: 0 };//角色朝向角度
        node.RoleGameInfo.v_DrawNode = new cc.Node();
        node.RoleGameInfo.v_DrawNode.is3DNode = false;
        node.RoleGameInfo.v_CurrentMap.v_MapShowNode.addChild(node.RoleGameInfo.v_DrawNode, 2000);
        
        node.LoadSpriteRes();
        //node.SetSceenPos(node.RoleInfo.v_BuildMapPos);
        return node;
    }
}

module.exports = C_Building;