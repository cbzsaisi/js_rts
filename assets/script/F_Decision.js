var G_P = require("./F_GamePublic");
var g_GameArray = require("./A_GameArray");

function F_Decision() {};

// case G_P.e_CommandTaskState.Stop:{
//     break;   
// }
// case G_P.e_CommandTaskState.Start:{

//     break;
// }
// case G_P.e_CommandTaskState.Gain:{
    
//     break;   
// }
// case G_P.e_CommandTaskState.Stop:{
//     break;
// }

F_Decision.RoleAi = function(v_RoleNum,v_D_Time) {

    var Demand = []
    var s_Role = G_P.g_GameDataResManger.GetRole(v_RoleNum);

    this.RoleAiUpDemand(s_Role);
    this.DealDemand(s_Role);
    

    return null;
}

F_Decision.RoleAiUpDemand = function(v_Role) {
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
                //console.log("Value:",v_Role.Decision.v_Demand[i].Value,"level:",v_Role.Decision.v_Demand[i].Level)
                break;
            }
        }
    }
    return null;
}

F_Decision.GetCurDemand = function(v_Role, v_CurDemand) {
    var CurDemand = null;
    for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
        if(v_Role.Decision.v_Demand[i].Type == v_CurDemand){
            CurDemand = v_Role.Decision.v_Demand[i];
            break;
        }
    }
    return CurDemand;
}

F_Decision.SetCurDemand = function(v_Role, v_CurDemand) {
    for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
        if(v_Role.Decision.v_Demand[i].Type == v_CurDemand){
            v_Role.Decision.v_Demand[i] = v_CurDemand;
            break;
        }
    }
    return;
}

F_Decision.DealDemand = function(v_Role) {
    //var CurDemand = F_Decision.GetCurDemand(v_Role,v_Role.Decision.v_CurDemand);
    var CurDemand = v_Role.Decision.v_CurDemand;
    switch(CurDemand.Type){
        case G_P.e_Demand.Not:{
            for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
                if(v_Role.Decision.v_Demand[i].Level > 5){
                    v_Role.Decision.v_Demand[i].State = G_P.e_CommandTaskState.Start;
                    v_Role.Decision.v_CurDemand = v_Role.Decision.v_Demand[i];
                    console.log("G_P.e_Demand.Not",v_Role.Decision.v_Demand[i].Type,v_Role.Info.v_Number)
                }
            }
            break;
        }
        case G_P.e_Demand.Work_Felling:{
            switch(CurDemand.State){
                case G_P.e_CommandTaskState.Stop:{
                    break;   
                }
                case G_P.e_CommandTaskState.Start:{
                    CurDemand.State = G_P.e_CommandTaskState.Gain;
                    break;
                }
                case G_P.e_CommandTaskState.Gain:{
                    console.log("G_P.e_Demand.Work_Felling Gain",v_Role.Info.v_Number)
                    CurDemand.State = G_P.e_CommandTaskState.Stop;
                    break;   
                }
                case G_P.e_CommandTaskState.Stop:{

                    break;
                }
                
            }
            break;
        }
    }
    //this.SetCurDemand(v_Role,CurDemand);
}
module.exports = F_Decision;