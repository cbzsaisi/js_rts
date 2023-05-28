/**
 * Created by saisi on 2016/8/20.
 */
var GamePublic = require("./F_GamePublic");

function F_RoleManager() {
};

/* F_RoleManager.SetRoleAction = function (_Role, _ActionName) {
    _Role.RoleGameInfo.v_ActionStage = _ActionName;
    switch (_ActionName) {
        case GamePublic.e_RoleAction.walk:
            var seft = _Role.RoleGameInfo.v_Sprite.getComponent(cc.SkeletonAnimation);
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

    switch (Role.RoleInfo.v_RoleRaceType) {
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
    return Role.RoleInfo.v_RolePropertyData.NowHP / Role.RoleInfo.v_RolePropertyData.HP;
},


F_RoleManager.RoleAttcak = function(_s_Role,_t_Role){
    var s_Role = GamePublic.g_GameDataResManger.GetRole(_s_Role);
    var t_Role = GamePublic.g_GameDataResManger.GetRole(_t_Role);

    switch(s_Role.RoleGameInfo.v_RoleAttackType.AttackType){
        case "hand":
        {
            switch(s_Role.RoleGameInfo.v_RoleAttackType.Skill){
                case "Left":
                console.log(_s_Role+"开始攻击"+_t_Role);
                break;
            }
        }
        break;
    }
    return;
},

F_RoleManager.GetRolePowerValue = function (v_RoleNumber,v_attack_type) {
    var Role = GamePublic.g_GameDataResManger.GetRole(v_RoleNumber);
    var RolePowerValue = GamePublic.s_RolePowerValue(0,0,{},0,0,{},[]);
    switch(v_attack_type.AttackType){
        case GamePublic.e_RoleAttackType.left_hand:{
            let Equip = Role.RoleInfo.v_RoleEquip[GamePublic.e_EquipType.Hand];
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


F_RoleManager.RoleAttackInfo = function(v_type) {  //角色攻击信息
    let Value = {PhsAttact:1,PhsAttactVal:1,Skill:1,SkillVal:1};
    switch(v_type.AttackType){
        case GamePublic.e_RoleAttackType.left_hand:{
            //console.log("GamePublic.e_RoleAttackType.left_hand");
            break;
        }
    }
    return Value;
},

F_RoleManager.RoleValueAlter = function (v_RoleNumber, v_value) {
    var Role = GamePublic.g_GameDataResManger.GetRole(v_RoleNumber);
    Role.RoleInfo.v_RolePropertyData.NowHP -= v_value.Hp;
    if(Role.RoleInfo.v_RolePropertyData.NowHP < 0) Role.RoleInfo.v_RolePropertyData.NowHP = 0;
    
    return;
},

module.exports = F_RoleManager;