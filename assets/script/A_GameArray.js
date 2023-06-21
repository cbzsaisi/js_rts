var G_P = require("./F_GamePublic");

var G_GameArray = {
    s_MapTilePassLand :[
        G_P.e_RolePassStatu.land
    ],

    A_Demand :[
        {Type:G_P.e_Demand.Work_Felling,Level:0,S_Num:0,S_Type:0,T_Num:0,T_Type:0,Info:null},
        {Type:G_P.e_Demand.AttackRole,Level:0,S_Num:0,S_Type:0,T_Num:0,T_Type:0,Info:null}
    ],
};

module.exports = G_GameArray;