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
    this.ProcDemand(s_Role);
    

    return null;
}

F_Decision.RoleAiUpDemand = function(v_Role) {
    for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
        let this_role_demand = v_Role.Decision.v_Demand[i];
        switch(this_role_demand.Type){
            case G_P.e_Demand.Work_Felling:{ //如果任务状态是伐木
                this_role_demand.Value += this_role_demand.StepValue;//每次都更新单步值
                if(this_role_demand.Value > 9999){
                    this_role_demand.Value = 0;
                    console.log(this_role_demand.Level)
                    if(this_role_demand.Level < 10){
                        this_role_demand.Level += 1;
                    }else{
                        console.log("StepValue = 0;11111111111111")
                        this_role_demand.StepValue = 0;
                    }
                }else if(this_role_demand.Value < 0){
                    console.log(this_role_demand.Level)
                    this_role_demand.Value = 0;
                    if(this_role_demand.Level > 1){
                        this_role_demand.Level -= 1;
                        this_role_demand.Value = 9999;
                    }else{
                        console.log("StepValue = 0;2222222222222")
                        this_role_demand.StepValue = 0;
                    }
                };
                //console.log("Value:",this_role_demand.Value,"level:",this_role_demand.Level)
                break;
            }
        }
    }
    return null;
}

F_Decision.GetCurDemand = function(v_Role, v_CurDemand) {
    var CurDemand = null;
    for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
        let this_role_demand = v_Role.Decision.v_Demand[i];
        if(this_role_demand.Type == v_CurDemand){
            CurDemand = this_role_demand;
            break;
        }
    }
    return CurDemand;
}

F_Decision.SetCurDemand = function(v_Role, v_CurDemand) {
    for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
        let this_role_demand = v_Role.Decision.v_Demand[i];
        if(this_role_demand.Type == v_CurDemand){
            this_role_demand = v_CurDemand;
            break;
        }
    }
    return;
}

F_Decision.ProcDemand = function(v_Role) {
    //var CurDemand = F_Decision.GetCurDemand(v_Role,v_Role.Decision.v_CurDemand);
    var CurDemand = v_Role.Decision.v_CurDemand;
    switch(CurDemand.Type){
        case G_P.e_Demand.Not:{
            for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
                let this_role_demand = v_Role.Decision.v_Demand[i];
                if(this_role_demand.Level > 5){ //如果任务等级LEVEL大于5 就开始
                    this_role_demand.State = G_P.e_CommandTaskState.Start;
                    v_Role.Decision.v_CurDemand = this_role_demand;
                }
            }
            break;
        }
        case G_P.e_Demand.Work_Felling:{
            switch(CurDemand.State){
                case G_P.e_CommandTaskState.Stop:{
                    for(let i = 0; i < v_Role.Decision.v_Demand.length; i++){
                        let this_role_demand = v_Role.Decision.v_Demand[i];
                        if(this_role_demand.Level > 5){
                            this_role_demand.State = G_P.e_CommandTaskState.Start;
                            v_Role.Decision.v_CurDemand = this_role_demand;
                        }
                    }
                    break;
                }
                case G_P.e_CommandTaskState.Start:{
                    CurDemand.State = G_P.e_CommandTaskState.Gain;
                    break;
                }
                case G_P.e_CommandTaskState.Gain:{
                    if(CurDemand.Level >= 10){
                        CurDemand.State = G_P.e_CommandTaskState.End;
                        CurDemand.StepValue = -500;
                    }
                    break;   
                }
                case G_P.e_CommandTaskState.End:{
                    if(CurDemand.Level <= 1){
                        CurDemand.State = G_P.e_CommandTaskState.Stop;
                        CurDemand.StepValue = 500;
                    }
                    break;
                }
                case G_P.e_CommandTaskState.Fail:{

                    break;
                }
            }
            break;
        }
    }
    //this.SetCurDemand(v_Role,CurDemand);
}
module.exports = F_Decision;