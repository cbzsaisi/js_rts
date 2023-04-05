var GamePublic = require("./F_GamePublic");

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
    New: function (_BuildName,_BuildNum,_MapNum,_Room,p_Pos) {
        var node = {};
        node.Room = _Room;

        node.BulidInfo = {  //写入保存数据
            v_BulidNumber: null, //角色编号
            v_BulidOccupationType: null,//职业
            v_BulidRaceType: null,//角色种族
            v_BulidMapPos: null,//在当前地图的坐标
            v_CurrentMapNum: null,
        };

        node.BulidGameInfo = { //基本不写入保存数据
            v_BulidSprite: null,
            v_BulidSpriteLoad: false,
            v_BulidSpriteSize: null,
            v_SpriteSize: null,
            v_SpriteScale: null,
            v_SpritePos: null,
            v_SpriteType: null,
            v_CurrentMap: null,
            v_SpriteData: null,
            v_ActionStage: null, //动作状态
            v_DtNumber: 0, //帧执行次数
            v_BulidCurAction: null,
            v_ActionNodeNumber: null, //当前动画总帧数
            v_SpriteNumber: null, //当前精灵动画执行到的帧数
            v_BulidCurActionSpriteNum: null,//当前角色动画累计执行帧数
            //移动相关
            v_MapOffset: null, //移动偏移量？ 
            v_BlockType: null,//阻挡类型
            v_SpriteShow: null,//是否显示
            v_BulidSelectFlag: null,//是否被选中
        },
        node.BulidCommand = { //写入保存数据
            //指令
            v_BulidActionArray: null,
            v_BulidActionCurScriptArray: null,
            v_BulidActionCommandArray: [],
            v_BulidActionCommandState: null,
            //脚本执行
            v_ActionCommand: null,
            v_ActionScriptFail: null,  //脚本失败次数
            v_ActionScriptFailType: null,//脚本失败原因
            v_ActionEvent: null,//事件
            v_ActionRunStage: null,
            v_ActionLoop: null,
            v_ActionConsoleType: null, //命令控制类型 1：倒计时控制，2：动画播放控制
            v_ActionWaitTime: 0,//动作消耗帧

            v_BulidTarNum: null,
            v_BulidTrarArray: [],
            v_BulidTradeShopNum: 0,//交易商店编号
        }
        node.BulidInfo.v_BulidNumber = _BuildNum;
        node.BulidInfo.v_BulidNumber = _MapNum;
        node.BulidInfo.v_BulidMapPos = p_Pos;
        return node;
    }
}

module.exports = C_Building;