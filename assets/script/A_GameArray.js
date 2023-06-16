var G_P = require("./F_GamePublic");

var G_GameArray = {
    s_MapTilePassLand :[
        G_P.e_RolePassStatu.land
    ],

    A_SelfDemand :[
        {Type:0,Level:0,S_Num:0,S_Type:0,T_Num:0,T_Type:0,Info:null}
    ],
    A_WorkDemand :[
        {Type:G_P.e_WorkDemand.Work_Felling,Level:0,S_Num:0,S_Type:0,T_Num:0,T_Type:0,Info:null}
    ],
    A_SocialDemand :[
        {Type:0,Level:0,S_Num:0,S_Type:0,T_Num:0,T_Type:0,Info:null}
    ],
    A_FightDemand :[
        {Type:G_P.e_FightDemand.AttackRole,Level:0,S_Num:0,S_Type:0,T_Num:0,T_Type:0,Info:null}
    ]
};

module.exports = G_GameArray;