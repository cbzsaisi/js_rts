/**
 * Created by saisi on 2016/8/20.
 */
var GamePublic = require("./F_GamePublic");

function F_RoleManager() {
};

/* F_RoleManager.SetRoleAction = function (_Role, _ActionName) {
    _Role.GameInfo.v_ActionStage = _ActionName;
    switch (_ActionName) {
        case GamePublic.e_RoleAction.walk:
            var seft = _Role.GameInfo.v_Sprite.getComponent(cc.SkeletonAnimation);
            var model = seft.getAnimationState('Take 001');
            seft.play('Take 001');
            //model.wrapMode = cc.WrapMode.Normal; cc.WrapMode.Normal
            model.repeatCount = 1; //Infinity
            //model.off('finished', function () {console.log("sssss");},this);   
            model.on('finished', this.test, this);
            break;
    }
} */

F_RoleManager.InitRoleRacePropertyData = function (_RoleNumber) {
    var Role = GamePublic.g_GameDataResManger.GetRole(_RoleNumber);
    var RoleRacePropertyData = {};

    switch (Role.Info.v_RoleRaceType) {
        case GamePublic.e_RoleRaceType.Human:
            RoleRacePropertyData.STR = 5; //力量
            RoleRacePropertyData.CON = 5; //体质
            RoleRacePropertyData.DEX = 5; //敏捷
            RoleRacePropertyData.LER = 5; //学识
            RoleRacePropertyData.MEN = 5; //精神
            RoleRacePropertyData.LUK = 5; //运气
            break;
    }
    return RoleRacePropertyData;
}

F_RoleManager.GetRoleHpRatio = function(_RoleNumber){
    var Role = GamePublic.g_GameDataResManger.GetRole(_RoleNumber);
    return Role.Info.v_PropertyData.NowHP / Role.Info.v_PropertyData.HP;
},


F_RoleManager.RoleAttcak = function(_s_Role,_t_Role){
    var s_Role = GamePublic.g_GameDataResManger.GetRole(_s_Role);
    var t_Role = GamePublic.g_GameDataResManger.GetRole(_t_Role);

    switch(s_Role.GameInfo.v_RoleAttackType.AttackType){
        case "hand":
        {
            switch(s_Role.GameInfo.v_RoleAttackType.Skill){
                case "Left":
                console.log(_s_Role+"开始攻击"+_t_Role);
                break;
            }
        }
        break;
    }
    return;
},

F_RoleManager.GetRolePowerValue = function (v_Number,v_attack_type) {
    var Role = GamePublic.g_GameDataResManger.GetRole(v_Number);
    var RolePowerValue = GamePublic.s_RolePowerValue(0,0,{},0,0,{},[]);
    switch(v_attack_type.AttackType){
        case GamePublic.e_RoleAttackType.left_hand:{
            let Equip = Role.Info.v_RoleEquip[GamePublic.e_EquipType.Hand];
            if (Equip == null) break;
            RolePowerValue.p_Attack += Equip.EquipIncreaseValue.Att;
            break;
        }
    }
    //计算角色的攻击防御值

    return RolePowerValue;
},

F_RoleManager.RoleAttackCalc = function (v_s_RoleNumber,v_t_RoleNumber,v_attack_type) {
    var s_Role = GamePublic.g_GameDataResManger.GetRole(v_s_RoleNumber);
    var t_Role = GamePublic.g_GameDataResManger.GetRole(v_t_RoleNumber);
    var s_Role_value = this.GetRolePowerValue(v_s_RoleNumber,v_attack_type);
    var t_Role_value = this.GetRolePowerValue(v_t_RoleNumber,v_attack_type);
    this.RoleValueAlter(v_t_RoleNumber,GamePublic.s_RoleValueAlter(s_Role_value.p_Attack - t_Role_value.p_Defense,0));
    // switch(v_attack_type){

    // }
    //计算攻击结果

    return;
},

// F_RoleManager.RoleAttackInfo = function(v_type) {  //角色攻击信息
//     let Value = {PhsAttact:1,PhsAttactVal:1,Skill:1,SkillVal:1};
//     switch(v_type.AttackType){
//         case GamePublic.e_RoleAttackType.left_hand:{
//             //console.log("GamePublic.e_RoleAttackType.left_hand");
//             break;
//         }
//     }
//     return Value;
// },

F_RoleManager.RoleValueAlter = function (v_Number, v_value) {
    var Role = GamePublic.g_GameDataResManger.GetRole(v_Number);
    Role.Info.v_PropertyData.NowHP -= v_value.Hp;
    Role.Info.v_PropertyData.NowMP -= v_value.Mp;
    if(Role.Info.v_PropertyData.NowHP < 0) Role.Info.v_PropertyData.NowHP = 0;
    if(Role.Info.v_PropertyData.NowMP < 0) Role.Info.v_PropertyData.NowMP = 0;
    return;
},

F_RoleManager.GetCareerSkill = function (v_Type) {
    var SkillArray = [];
    switch(v_Type){
        case GamePublic.e_RoleOccupationType.Worker:{
            SkillArray.push(GamePublic.s_WorkSkillType(GamePublic.e_WorkSkillType.Farming,1,[]));
            SkillArray.push(GamePublic.s_WorkSkillType(GamePublic.e_WorkSkillType.Mining,1,[]));
            SkillArray.push(GamePublic.s_WorkSkillType(GamePublic.e_WorkSkillType.Woodcutter,1,[]));
            break;
        }
        case GamePublic.e_RoleOccupationType.Warrior:{
            SkillArray.push(GamePublic.s_WorkSkillType(GamePublic.e_WorkSkillType.Farming,1,[]));
            SkillArray.push(GamePublic.s_WorkSkillType(GamePublic.e_WorkSkillType.Mining,1,[]));
            SkillArray.push(GamePublic.s_WorkSkillType(GamePublic.e_WorkSkillType.Woodcutter,1,[]));
            break;
        }
    }
    return SkillArray;
},

F_RoleManager.TaskCheck = function (v_src) {
    //console.log(v_src);
    var ret = {res:false,info:null};
    if(v_src.Script.Info.Task == null)return ret;

    let s_get = GamePublic.g_GameDataResManger.GetObj(v_src.Script.Info.Task.Script.Info.Task.SourceType);
    let t_get = GamePublic.g_GameDataResManger.GetObj(v_src.Script.Info.Task.Script.Info.Task.TargetType);
    //console.log(v_src.Script.Info.Task);
    switch(v_src.Script.Info.Task.Script.Name){
        case GamePublic.e_CommandTaskType.RoleAttackRole:{
            //let s_role = s_get(v_src.ScrRole.Num);
            let t_role = t_get(v_src.TarRole.Num);
            if(t_role.Info.v_PropertyData.NowHP <= v_src.Script.Info.Task.Script.Info.Task.TargetValue){
                ret.res = true;
            }
            //var src = new GamePublic.s_RoleScript({Info:{TargetType:_src.Script.Info.TargetType,ComNum:1,ComLevel:GamePublic.e_CommandLevel.Level1,ComWeight:3},Name:GamePublic.e_CommandBaseType.RoleAttacking},{Num:s_role.Info.v_Number,Array:"332111",Pos:123},{Num:_src.TarRole.Num,Array:_src.TarRole.Array,Pos:_src.TarRole.Pos});
            break;
        }
        case GamePublic.e_CommandTaskType.Work_Felling:{
            let s_role = s_get(v_src.ScrRole.Num);
            //let t_role = t_get(v_src.TarRole.Num);
            let ret1 = GamePublic.g_ItemManager.GetItemQuantity(GamePublic.e_ItemName.Wood_Material, s_role.Info.v_Number, "Role");
            if(ret1 >= v_src.Script.Info.Task.Script.Info.Task.TargetValue){
                ret.res = true;
            }
            //console.log(ret1,v_src.Script.Info.Task.TargetValue,ret.res);
            break;
        }
    }
    return ret;
},

module.exports = F_RoleManager;