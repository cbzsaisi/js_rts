var GamePublic = require("./F_GamePublic");
//var MapTileSprite = require("./script/C_MapTileSprite");

function C_MapTileAdditional() {
};

C_MapTileAdditional.New = function (v_TileType){
    var node = {};

    node.Info = { //写入保存数据
        v_Number: null, //角色编号
        v_PropertyData: {}, //属性数据
        v_MapPos: null, //在当前地图的坐标
        v_State: null,//状态
        v_RolePassStatu: null, //穿透类型
        v_SpriteDirection: null, //朝向
        v_SpriteAngle: null, //角度
        v_RoleGroupNum: null, //分组编号
        v_RoleName: "无名",
        v_RoleColor: cc.color(255, 255, 255, 255),
        v_RoleOpacity: 255,
        v_Type: GamePublic.e_BaseObjType.MaptileAdditional,
    },

    node.GameInfo = { //基本不写入保存数据
        v_Sprite: null,
        v_SpriteLoad: false,
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
        v_MoveBlockPos: null, //被阻挡的移动点
        v_BlockType: null, //阻挡类型
        v_SpriteShow: null, //是否显示
        v_RoleSelectFlag: null, //是否被选中
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
    }
    node.Info.v_RaceType = v_TileType;
    node.Info.v_PropertyData = GamePublic.s_MaterialData(node.Info.v_RaceType,10000,10000,1,1,10,[],0);

    node.PropertyDataValueRecast = function(v_type) {
        let ret = 0;
        if(node.Info.v_PropertyData.ProgressCount > 9){
            node.Info.v_PropertyData.ProgressCount = 0;
            if(node.Info.v_PropertyData.NowValue > 0){
                node.Info.v_PropertyData.NowValue -= 1;
                ret = 1
            }
        }
        return ret;
    }
    node.MyUpdate = function() {
        //node.PropertyDataValueRecast(1);
    }

    return node;

}

module.exports = C_MapTileAdditional;