var GamePublic = require("./F_GamePublic");

function F_BuildManager() {
};

var s_BuildInfo = function(_Name, _Image, _Type, _Size, _ResNeeds, _TechNeeds, _RoomLimit) {
    var BuildInfo = {};
    BuildInfo.Name = _Name;
    BuildInfo.Image = _Image;
    BuildInfo.Type = _Type;
    BuildInfo.Size = _Size;
    BuildInfo.ResNeeds = _ResNeeds; //需要的资源
    BuildInfo.TechNeeds = _TechNeeds; //需要的科技
    BuildInfo.RoomLimit = _RoomLimit;
    return BuildInfo;
}

F_BuildManager.C_BuildManager = {
    New: function() {
        var node = {};
        node.InfoArray = [];
        node.BuildButtonArray = [];
        var Button = GamePublic.e_BuildName.SmallHumanBuild;
        node.BuildButtonArray.push(Button);

        node.CreateBuildInfoArray = function() {
            var Image = [
                { Name: GamePublic.e_BuildImage.Building, FileName: "111" }
            ];
            var ResNeeds = [
                { Name: "Wood", Value: "10" }
            ];
            var TechNeeds = [];
            var BuildInfo = s_BuildInfo(GamePublic.e_BuildName.SmallHumanBuild, Image, GamePublic.e_BuildType.House, { x: 2, y: 2 }, ResNeeds, TechNeeds, 2);
            node.InfoArray.push(BuildInfo);
        }
        node.GetBuildSize = function(_BuildingType) {
            for (var i in node.InfoArray) {
                if (node.InfoArray[i].Name == _BuildingType) {
                    return node.InfoArray[i].Size;
                }
            }
            return null;
        }
        node.GetBuildInfo = function(_BuildingType) {
            for (var i in node.InfoArray) {
                if (node.InfoArray[i].Name == _BuildingType) {
                    return node.InfoArray[i];
                }
            }
            return null;
        }

        node.CreateBuildInfoArray();
        return node;
    }
}



F_BuildManager.BuildValueAlter = function (v_Number, v_value) {
    var Build = GamePublic.g_GameDataResManger.GetRole(v_Number);
    Build.Info.v_PropertyData.NowHP -= v_value.Hp;
    Build.Info.v_PropertyData.NowMP -= v_value.Mp;
    if(Build.Info.v_PropertyData.NowHP < 0) Build.Info.v_PropertyData.NowHP = 0;
    if(Build.Info.v_PropertyData.NowMP < 0) Build.Info.v_PropertyData.NowMP = 0;
    return;
},

F_BuildManager.ActionCommandPassiveProc = function (_src) { //被动处理
    var g_gamemangaer = GamePublic.g_GameDataResManger;
    var SrcExeState = GamePublic.e_CommandSrcipt.Fail;
    switch (_src.Script.Name) {
        case GamePublic.e_CommandType.RoleAttackHarm:{
            //console.log("处理被攻击 来自：",_src.ScrRole.Num,"目标：",_src.TarRole.Num,"对方是：",_src.Script.Info.TargetType);
            let t_role = g_gamemangaer.GetBuild(_src.TarRole.Num);
            SrcExeState = GamePublic.e_CommandSrcipt.Success;
            if (t_role.Info.v_State.TypeState == GamePublic.e_TypeState.Death){
                console.log("本角色已经亡 无法反击");
                break;
            }
            //console.log(_src);
            this.AttackCalc(_src.ScrRole.Num,GamePublic.e_BaseObjType.Role,_src.TarRole.Num,GamePublic.e_BaseObjType.Build,_src.Script.Info);
            //t_role.Info.v_PropertyData.NowHP -= 25;

            //反击
            // var res = this.RoleTargetCheck(GamePublic.s_RoleScript({ Info:1, Name:GamePublic.e_RoleTargetCheck.RoleAttack}, { Num: _src.TarRole.Num, Array: [], Pos: 123 }, { Num: _src.ScrRole.Num, Array: [], Pos: 123 }));
            // switch(res){
            //     case GamePublic.e_RoleTargetCheckResult.Success:{
            //         let src = new GamePublic.s_RoleScript({ Info:{TargetType:GamePublic.e_BaseObjType.Role}, Name:GamePublic.e_CommandType.RoleAttack}, { Num: _src.TarRole.Num, Array: "222", Pos: 123 }, { Num: _src.ScrRole.Num, Array: [_src.ScrRole.Num], Pos: 321 });
            //         t_role.Command.v_ActionCommandArray1.push(src);
            //         break;
            //     }
            // }                   
            
            break;
        }
    }
    return SrcExeState;
}

F_BuildManager.AttackCalc = function (v_s_RoleNumber,v_S_Role_Type,v_t_RoleNumber,v_T_Role_Type,v_attack_type) {
    var s_Role = GamePublic.g_GameDataResManger.GetObj(v_S_Role_Type)(v_s_RoleNumber);
    var t_Role = GamePublic.g_GameDataResManger.GetObj(v_T_Role_Type)(v_t_RoleNumber);
    
    var t_Role_value = t_Role.GetPowerValue(v_attack_type);
    var s_Role_value = s_Role.GetPowerValue(v_attack_type);
    //console.log(s_Role_value.p_Attack,t_Role_value.p_Defense);
    this.ValueAlter(v_t_RoleNumber,GamePublic.s_RoleValueAlter(s_Role_value.p_Attack - t_Role_value.p_Defense,0));
    // switch(v_attack_type){
    // }
    //计算攻击结果
    return;
}

F_BuildManager.ValueAlter = function (v_Number, v_value) {
    //console.log(v_value.Hp);
    if(v_value.Hp < 0)v_value.Hp = 0;
    if(v_value.Mp < 0)v_value.Mp = 0;
    var Build = GamePublic.g_GameDataResManger.GetBuild(v_Number);
    Build.Info.v_PropertyData.NowHP -= v_value.Hp;
    Build.Info.v_PropertyData.NowMP -= v_value.Mp;
    if(Build.Info.v_PropertyData.NowHP < 0) Build.Info.v_PropertyData.NowHP = 0;
    if(Build.Info.v_PropertyData.NowMP < 0) Build.Info.v_PropertyData.NowMP = 0;
    return;
},
module.exports = F_BuildManager;