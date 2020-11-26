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
module.exports = F_RoleManager;