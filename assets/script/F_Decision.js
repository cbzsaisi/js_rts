var G_P = require("./F_GamePublic");
var g_GameArray = require("./A_GameArray");

function F_Decision() {};

F_Decision.RoleAi = function(v_RoleNum,v_D_Time) {

    var Demand = []
    var s_Role = G_P.g_GameDataResManger.GetRole(v_RoleNum);

    this.RoleAiWorkDemand(s_Role,Demand);
    //console.log(s_Role.Decision.v_Health,s_Role.Decision.v_WorkDemand,v_D_Time);
   
    return null;
}

F_Decision.RoleAiWorkDemand = function(v_Role, v_Demand) {
    for(let i = 0; i < v_Role.Decision.v_WorkDemand.length; i++){
        switch(v_Role.Decision.v_WorkDemand[i].Type){
            case G_P.e_WorkDemand.Work_Felling:{
                //console.log("e_WorkDemand.Work_Felling")
                break;
            }
        }
    }
    return null;
}

F_Decision.RoleAiFightDemand = function(v_Role, v_Demand) {
    for(let i = 0; i < v_Role.Decision.v_FightDemand.length; i++){
        switch(v_Role.Decision.v_FightDemand[i].Type){
            case G_P.e_FightDemand.AttackRole:{
                //console.log("e_WorkDemand.Work_Felling")
                break;
            }
        }
    }
    return null;
}
module.exports = F_Decision;