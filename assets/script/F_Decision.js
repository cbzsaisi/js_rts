var G_P = require("./F_GamePublic");
var g_GameArray = require("./A_GameArray");

function F_Decision() {};

F_Decision.RoleAi = function(v_RoleNum,v_D_Time) {

    var Demand = []
    var s_Role = G_P.g_GameDataResManger.GetRole(v_RoleNum);

    this.RoleAiWorkDemand(s_Role,Demand);
    //console.log(s_Role.Decision.v_Health,s_Role.Decision.v_Demand,v_D_Time);
   
    return null;
}

F_Decision.RoleAiWorkDemand = function(v_Role, v_Demand) {
    for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
        switch(v_Role.Decision.v_Demand[i].Type){
            case G_P.e_Demand.Work_Felling:{
                v_Role.Decision.v_Demand[i].Value += v_Role.Decision.v_Demand[i].StepValue;
                if(v_Role.Decision.v_Demand[i].Value > 9999){
                    v_Role.Decision.v_Demand[i].Value = 0;
                    if(v_Role.Decision.v_Demand[i].Level < 10){
                        v_Role.Decision.v_Demand[i].Level += 1;
                    }else{
                        v_Role.Decision.v_Demand[i].StepValue = 0;
                    }
                }else if(v_Role.Decision.v_Demand[i].Value < 0){
                    v_Role.Decision.v_Demand[i].Value = 0;
                    if(v_Role.Decision.v_Demand[i].Level > 1){
                        v_Role.Decision.v_Demand[i].Level -= 1;
                    }else{
                        v_Role.Decision.v_Demand[i].StepValue = 0;
                    }
                };
                console.log("Value:",v_Role.Decision.v_Demand[i].Value,"level:",v_Role.Decision.v_Demand[i].Level)
                break;
            }
        }
    }
    return null;
}

F_Decision.RoleAiFightDemand = function(v_Role, v_Demand) {
    for(let i = 0; i < v_Role.Decision.v_FightDemand.length; i++){
        switch(v_Role.Decision.v_FightDemand[i].Type){
            case G_P.e_Demand.AttackRole:{
                //console.log("e_WorkDemand.Work_Felling")
                break;
            }
        }
    }
    return null;
}
module.exports = F_Decision;