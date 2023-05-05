var GamePublic = require("./F_GamePublic");
var GameResManager = require("./F_GameResManager");
//var C_MapTile = require("./C_MapTile");

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
        node.BuildInfo = {  //写入保存数据
            v_BuildNumber: null, //建筑编号
            v_BuildOccupationType: null,//职业
            v_BuildType: null,//建筑类型
            v_BuildMapPos: null,//在当前地图的坐标
            v_CurrentMapNum: null,
            v_SpriteAngle: null, //角度
        };

        node.BuildGameInfo = { //基本不写入保存数据
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

        node.BuildCommand = { //写入保存数据
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
            for (var i in GamePublic.g_resources2DMapTile) {
                if (GamePublic.g_resources2DMapTile[i].FileName == node.BuildGameInfo.v_SpriteData.spritename && GamePublic.g_resources2DMapTile[i].LoadDone) {
                    node.BuildGameInfo.v_BuildSprite = cc.instantiate(GamePublic.g_resources2DMapTile[i].FileData);
                    node.BuildGameInfo.v_SpriteSize.width = node.BuildGameInfo.v_BuildSprite.getBoundingBox().width;
                    node.BuildGameInfo.v_SpriteSize.height = node.BuildGameInfo.v_BuildSprite.getBoundingBox().height;
                    node.BuildGameInfo.v_CurrentMap.v_MapShowNode.addChild(node.BuildGameInfo.v_BuildSprite,(node.BuildGameInfo.v_CurrentMap.v_MapSize.x * node.BuildGameInfo.v_CurrentMap.v_MapSize.y) -
                    (node.BuildInfo.v_BuildMapPos.x + node.BuildInfo.v_BuildMapPos.y * node.BuildGameInfo.v_CurrentMap.v_MapSize.x));
                    if (!node.BuildGameInfo.v_BuildCreate) { node.Create(); }
                }
            }
            if(node.BuildGameInfo.v_BuildSprite == null)console.log(node.BuildGameInfo.v_SpriteData.spritename,"资源没有加载");
        };

        node.GetNumber = function(){
            return node.BuildInfo.v_BuildNumber;
        }

        node.SetSceenPos = function (_pos) {
            node.BuildInfo.v_BuildMapPos = _pos;
            node.BuildGameInfo.v_SpritePos = GamePublic.s_Vec2d(_pos.x * (node.BuildGameInfo.v_CurrentMap.v_MapTiledSize.x * GamePublic.g_SceenScale) + node.BuildGameInfo.v_SpriteSize.width * 0.5,
                _pos.y * (node.BuildGameInfo.v_CurrentMap.v_MapTiledSize.y * GamePublic.g_SceenScale) + node.BuildGameInfo.v_SpriteSize.height * 0.5);

            if (node.BuildGameInfo.v_BuildSprite) {
                node.BuildGameInfo.v_BuildSprite.setPosition(node.BuildGameInfo.v_SpritePos);
                node.BuildGameInfo.v_DrawNode.setPosition(node.BuildGameInfo.v_SpritePos);
            }
            if (node.BuildGameInfo.v_BuildSprite) node.BuildGameInfo.v_BuildSprite.setScale(node.BuildGameInfo.v_SpriteScale);
        };

        node.Create = function () {
            var obj = GamePublic.s_ObjInfo("Build", 1, node);
            GamePublic.g_GameDataResManger.AddBuild(obj);
            node.BuildGameInfo.v_SpriteScale = 1;
            node.SetSceenPos(node.BuildInfo.v_BuildMapPos);
            node.BuildGameInfo.v_SpriteShow = true;
            node.BuildGameInfo.v_BuildCreate = true;
            this.Build();
        };

        node.Build = function () {
            for(let i = 0; i < node.BuildGameInfo.v_SpriteData.BuildSize.width; i++){
                for(let j = 0; j < node.BuildGameInfo.v_SpriteData.BuildSize.height; j++){
                    //console.log(i,"-",j);
                    node.BuildGameInfo.v_CurrentMap.MapRoomArray[node.BuildInfo.v_BuildMapPos.x + i][node.BuildInfo.v_BuildMapPos.y + j].MoveInRole(node.BuildInfo.v_BuildNumber, GamePublic.e_BaseObjType.Build);
                }
            }
        };

        node.BuildRemove = function () {
            for(let i = 0; i < node.BuildGameInfo.v_SpriteData.BuildSize.width; i++){
                for(let j = 0; j < node.BuildGameInfo.v_SpriteData.BuildSize.height; j++){
                    node.BuildGameInfo.v_CurrentMap.MapRoomArray[node.BuildInfo.v_BuildMapPos.x + i][node.BuildInfo.v_BuildMapPos.y + j].MoveOutRole(node.BuildInfo.v_BuildNumber, GamePublic.e_BaseObjType.Build);
                }
            }
        };

        node.MyUpdate = function() {
            if (!node.BuildGameInfo.v_BuildCreate) {
                if (!node.BuildGameInfo.v_BuildSprite) {
                    node.LoadSpriteRes();
                }
                return;
            }
            node.BuildGameInfo.v_DtNumber++;
            if (node.BuildGameInfo.v_DtNumber >= (GamePublic.e_RoleSpeed.fps)) {
                node.BuildGameInfo.v_DtNumber = 0;
                if (node.BuildCommand.v_ActionConsoleType == 1 && node.BuildCommand.v_ActionWaitTime > 0) { //当前动作总耗时帧
                    node.BuildCommand.v_ActionWaitTime -= GamePublic.g_GameTimeDt;
                }
                if (node.BuildGameInfo.v_FrontDraw) node.BuildGameInfo.v_FrontDraw.update();
            }

            node.SetSceenPos(node.BuildInfo.v_BuildMapPos);
            var sceen = GamePublic.s_Vec2d(node.BuildGameInfo.v_SpritePos.x + GamePublic.g_MoveOff.x, node.BuildGameInfo.v_SpritePos.y + GamePublic.g_MoveOff.y);
            if (node.BuildGameInfo.v_SpriteShow) {
                //console.log('sceen.x = %d sceen.y = %d',sceen.x,sceen.y);
                if (sceen.x > GamePublic.g_winSize.width || sceen.x < 0 || sceen.y > GamePublic.g_winSize.height || sceen.y < 0) {
                    node.ShowSprite(false);
                }
            } else if (sceen.x < GamePublic.g_winSize.width && sceen.x > 0 && sceen.y < GamePublic.g_winSize.height && sceen.y > 0) {
                node.ShowSprite(true);
            }
        };
        
        node.ShowSprite = function(_show) {
            console.log(_show);
            if (_show) {
                if (node.BuildGameInfo.v_BuildSprite && !node.BuildGameInfo.v_BuildSprite.active) node.BuildGameInfo.v_BuildSprite.active = true;
                node.BuildGameInfo.v_SpriteShow = true;
            } else {
                if (node.BuildGameInfo.v_BuildSprite && node.BuildGameInfo.v_BuildSprite.active) node.BuildGameInfo.v_BuildSprite.active = false;
                node.BuildGameInfo.v_SpriteShow = false;
            }
        }
        node.BuildInfo.v_BuildNumber = _BuildNum;
        node.BuildInfo.v_CurrentMapNum = _MapNum;
        node.BuildInfo.v_BuildMapPos = _MapPoint;
        node.BuildGameInfo.v_CurrentMap = GamePublic.g_GameDataResManger.GetMap(_MapNum); //当前地图实体
        node.BuildGameInfo.v_SpriteData = GameResManager.getSpriteResData(_BuildResName, GamePublic.e_SpriteResType.Build);
        node.BuildInfo.v_BuildMapPos = GamePublic.s_Rect(_MapPoint.x, _MapPoint.y,1,1);
        node.BuildInfo.v_SpriteAngle = { Def: 0, Cur: 0, Des: 0 };//建筑朝向角度
        node.BuildGameInfo.v_DrawNode = new cc.Node();
        var Img = node.BuildGameInfo.v_DrawNode.addComponent(cc.Graphics);
                Img.clear();
                Img.lineWidth = 1;
                Img.fillColor = cc.color(255, 25, 22, 222);
                Img.rect(0, 0, 10, 10);
                Img.fill();
        node.BuildGameInfo.v_CurrentMap.v_MapShowNode.addChild(node.BuildGameInfo.v_DrawNode, 2000);
        
        node.LoadSpriteRes();
        return node;
    }
}

module.exports = C_Building;