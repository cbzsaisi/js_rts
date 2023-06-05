var GamePublic = require("./F_GamePublic");
//var GameManager = require("./F_GameManager");
var g_Astar = require("./F_AStar");
var g_RoleManager = require("./F_RoleManager");


function C_SrciptProc() {
};

C_SrciptProc.CommandSrciptProc = function (_src) {

    var g_gamemangaer = GamePublic.g_GameDataResManger;
    var s_role = g_gamemangaer.GetRole(_src.ScrRole.Num);
    s_role.Command.v_ActionConsoleType = 1; //控制类型
    s_role.Command.v_ActionLoop = false;
    switch (_src.Script.Name) {
        case GamePublic.e_CommandBaseType.RoleMove:
            s_role.Command.v_ActionScriptFailType = g_Astar.RoleTargePosPassTest(s_role.Info.v_RolePassStatu, g_gamemangaer.GetMap(s_role.Info.v_CurrentMapNum).MapRoomArray[_src.TarRole.Pos.x][_src.TarRole.Pos.y]);
            if (s_role.Command.v_ActionScriptFailType == GamePublic.e_ActionScriptFailType.Success) {
                s_role.Command.v_ActionWaitTime = (20000 / GamePublic.e_RoleSpeed.scpfps);
                var map = s_role.GameInfo.v_CurrentMap.MapRoomArray;
                var src_pos = s_role.Info.v_MapPos;
                var MapOffset = GamePublic.sub_Vec2d(map[src_pos.x][src_pos.y].v_SpritePos, map[_src.TarRole.Pos.x][_src.TarRole.Pos.y].v_SpritePos);
                s_role.GameInfo.v_MapOffset = GamePublic.s_Vec2d(MapOffset.x / s_role.Command.v_ActionWaitTime, MapOffset.y / s_role.Command.v_ActionWaitTime);
                s_role.SetMapPos(_src.TarRole.Pos);
                s_role.Info.v_SpriteAngle.Des = GamePublic.GetAngle(src_pos,_src.TarRole.Pos);
                s_role.Command.v_ActionConsoleType = 1; //控制类型
                switch (s_role.GameInfo.v_SpriteType) {
                    case GamePublic.e_SpriteType.spine:
                        //C_RoleManager.SetRoleAction(role.v_Sprite, e_SpriteActionName.walk);
                        if (MapOffset.x > 0) { if (s_role.GameInfo.v_SpriteScale.x > 0) s_role.GameInfo.v_SpriteScale.x = s_role.GameInfo.v_SpriteScale.x * -1}
                        else if (MapOffset.x < 0) { if (s_role.GameInfo.v_SpriteScale.x < 0) s_role.GameInfo.v_SpriteScale.x = s_role.GameInfo.v_SpriteScale.x * -1}//转向
                        s_role.Command.v_ActionLoop = true;
                        if(s_role.Command.v_ActionEvent != GamePublic.e_RoleAction.walk){
                            s_role.Command.v_ActionEvent = GamePublic.e_RoleAction.walk;
                            s_role.SetRoleAction(s_role.Command.v_ActionEvent);
                        }
                        break;
                    case GamePublic.e_SpriteType.img:
                        break;
                    case GamePublic.e_SpriteType.model:
                        /*                   var seft = s_role.GameInfo.v_Sprite.getComponent(cc.SkeletonAnimation);
                                          var model = seft.getAnimationState('Take 001');
                                          model.on('finished', function () { console.log("sssss"); }, this);*/
                        //g_RoleManager.SetRoleAction(s_role,GamePublic.e_RoleAction.walk);
                        s_role.Command.v_ActionLoop = true;
                        if(s_role.Command.v_ActionEvent != GamePublic.e_RoleAction.walk){
                            s_role.Command.v_ActionEvent = GamePublic.e_RoleAction.walk;
                            s_role.SetRoleAction(s_role.Command.v_ActionEvent);
                        }
                        break;
                }
            } else {
                s_role.GameInfo.v_MoveBlockPos = GamePublic.s_Vec2d(_src.TarRole.Pos.x, _src.TarRole.Pos.y);
                s_role.Command.v_ActionScriptFail++; //错误次数
                s_role.ClearRoleCommand(GamePublic.e_RoleCommandType.Command);
                //C_MathLibStar.RoleFindWay(role,role.v_ActionMovePos);
            }
            break;
        case GamePublic.e_CommandBaseType.RoleWait:
            //C_RoleManager.SetRoleAction(role.v_Sprite,e_SpriteActionName.jump);
            //role.v_ActionWaitTime=(600 / e_RoleSpeed.scpfps);
            //role.v_ActionScriptFailType = e_ActionScriptFailType.Success;
            break;
        case GamePublic.e_CommandBaseType.RoleAttacking:{
            //console.log("角色开始攻击",_src.TarRole.Array.length);
            for(let i in s_role.Command.v_RoleTrarArray){
                for(let j in _src.TarRole.Array){
                    //console.log(s_role.Command.v_RoleTrarArray[i]);
                    if(s_role.Command.v_RoleTrarArray[i] == _src.TarRole.Array[j]){
                        //console.log("攻击目标编号相同");
                        break;
                    }
                }
            }

            s_role.Command.v_RoleTrarArray.splice(0,s_role.Command.v_RoleTrarArray.length);
            for(var i in _src.TarRole.Array){
                s_role.Command.v_RoleTrarArray.push(_src.TarRole.Array[i]);
            }
            s_role.Command.v_ActionLoop = false;
            s_role.Command.v_RoleTarNum = _src.TarRole.Num;
            s_role.Command.v_ActionWaitTime = 1;
            s_role.Command.v_ActionConsoleType = 2;
            s_role.Command.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
            switch (s_role.GameInfo.v_SpriteType) {
                case GamePublic.e_SpriteType.spine:
                    s_role.Command.v_ActionEvent = GamePublic.e_RoleAction.attack;
                    s_role.Info.v_TargetType = _src.Script.Info.TargetType;
                    s_role.SetRoleAction(GamePublic.e_RoleAction.jump);
                    break;
            }
            //g_RoleManager.RoleAttcak(_src.ScrRole.Num, _src.TarRole.Num);
            break;}
            
        case "Non":
            console.log("空");
            break;
    }
}

C_SrciptProc.CommandSrciptProc1 = function (_src) {
    var g_gamemangaer = GamePublic.g_GameDataResManger;
    var SrcExeState = GamePublic.e_CommandSrcipt.Fail;
    var s_role = g_gamemangaer.GetRole(_src.ScrRole.Num);
    switch (_src.Script.Name) {
        case GamePublic.e_CommandType.RoleGoToPos:{
            var hr = g_Astar.RoleFindWay(s_role, _src.TarRole.Pos);
            if (hr) {
                SrcExeState = GamePublic.e_CommandSrcipt.Success;
            } else {
                //SrcExeState = e_CommandSrcipt.Fail;
                console.log("RoleGoToPos寻路失败");
            }
            break;
        }
        case GamePublic.e_CommandType.RoleAttack:{
            // let Attack_type = null;
            let f_get = null;
            switch(_src.Script.Info.TargetType){
                case GamePublic.e_BaseObjType.Role:{
                    Attack_type = GamePublic.e_BaseObjType.Role;
                    f_get = g_gamemangaer.GetRole;
                    break;
                }
                case GamePublic.e_BaseObjType.Build:{
                    Attack_type = GamePublic.e_BaseObjType.Build;
                    f_get = g_gamemangaer.GetBuild;
                    break;
                }
            }
            let t_role = f_get(_src.TarRole.Num);
            if (t_role) {
                if (Math.abs(s_role.Info.v_MapPos.x - t_role.Info.v_MapPos.x) < 2 && Math.abs(s_role.Info.v_MapPos.y - t_role.Info.v_MapPos.y) < 2) {
                    //console.log("范围内 开始攻击");
                    s_role.GameInfo.v_RoleAttackType = {AttackType:GamePublic.e_RoleAttackType.left_hand,Skill:"Left"};//修改攻击类型
                    var src = new GamePublic.s_RoleScript({Info:{TargetType:Attack_type},Name:GamePublic.e_CommandBaseType.RoleAttacking},{Num:s_role.Info.v_Number,Array:"332111",Pos:123},{Num:_src.TarRole.Num,Array:_src.TarRole.Array,Pos:null});
                    s_role.Command.v_RoleActionCommandArray.push(src);
                    SrcExeState = GamePublic.e_CommandSrcipt.Success;
                } else {
                    //console.log("范围外，要移动",t_role.Info.v_MapPos);
                    // var map = t_role.GameInfo.v_CurrentMap.MapRoomArray;
                    // var ExistRoleArray = map[t_role.Info.v_MapPos.x][t_role.Info.v_MapPos.y].v_ExistRoleArray;
                    // map[t_role.Info.v_MapPos.x][t_role.Info.v_MapPos.y].v_ExistRoleArray = []; //暂时把目标点清空
                    // var ExistBuildArray = map[t_role.Info.v_MapPos.x][t_role.Info.v_MapPos.y].v_ExistBuildArray;
                    // map[t_role.Info.v_MapPos.x][t_role.Info.v_MapPos.y].v_ExistBuildArray = []; //暂时把目标点清空

                    var hr = g_Astar.RoleFindWay2(s_role,t_role.Info.v_MapPos);
                    // map[t_role.Info.v_MapPos.x][t_role.Info.v_MapPos.y].v_ExistRoleArray = ExistRoleArray;
                    // map[t_role.Info.v_MapPos.x][t_role.Info.v_MapPos.y].v_ExistBuildArray = ExistBuildArray;
                    if (hr) {
                        SrcExeState = GamePublic.e_CommandSrcipt.Success;
                        //这个会被 命令栈pop掉
                        console.log("这个会被 命令栈pop掉");
                        //var src = new GamePublic.s_RoleScript({Info:1,Name:"Non"},{Num:_src.ScrRole.Num,Array:"22",Pos:123},{Num:_src.TarRole.Num,Array:"22",Pos:_src.TarRole.Pos});
                        //t_role.Command.v_RoleActionCommandArray1.push(src);
                    } else {
                        console.log("无法移动到攻击目标周围");
                    }
                }
            }
            break;
        }
        case GamePublic.e_CommandType.RoleDeath:{
            s_role.SetRoleStateChange(GamePublic.e_TypeState.Death);
            break;
        }
    }
    return SrcExeState;
}

C_SrciptProc.RoleActionCommandPassiveProc = function (_src) { //被动处理
    var g_gamemangaer = GamePublic.g_GameDataResManger;
    var SrcExeState = GamePublic.e_CommandSrcipt.Fail;
    switch (_src.Script.Name) {
        case GamePublic.e_CommandType.RoleAttackHarm:{
            //console.log("处理被攻击 来自：",_src.ScrRole.Num,"目标：",_src.TarRole.Num);
            let t_role = g_gamemangaer.GetRole(_src.TarRole.Num);
            SrcExeState = GamePublic.e_CommandSrcipt.Success;
            if (t_role.Info.v_State.TypeState == GamePublic.e_TypeState.Death){
                console.log("本角色已经亡 无法反击");
                break;
            }
            g_RoleManager.RoleAttackCalc(_src.ScrRole.Num,_src.TarRole.Num,_src.Script.Info);
            //t_role.Info.v_PropertyData.NowHP -= 5;

            //反击
            var res = this.RoleTargetCheck(GamePublic.s_RoleScript({ Info:1, Name:GamePublic.e_RoleTargetCheck.RoleAttack}, { Num: _src.TarRole.Num, Array: [], Pos: 123 }, { Num: _src.ScrRole.Num, Array: [], Pos: 123 }));
            switch(res){
                case GamePublic.e_RoleTargetCheckResult.Success:{
                    let src = new GamePublic.s_RoleScript({ Info:{TargetType:GamePublic.e_BaseObjType.Role}, Name:GamePublic.e_CommandType.RoleAttack}, { Num: _src.TarRole.Num, Array: "222", Pos: 123 }, { Num: _src.ScrRole.Num, Array: [_src.ScrRole.Num], Pos: 321 });
                    t_role.Command.v_RoleActionCommandArray1.push(src);
                    break;
                }
            }                   
            
            break;
        }
    }
    return SrcExeState;
}

C_SrciptProc.RoleActionSrciptProc = function (v_src) {  //动作处理
    let f_get = null;
    let g_gamemangaer = GamePublic.g_GameDataResManger;
    switch(v_src.Script.Info.TargetType){
        case GamePublic.e_BaseObjType.Role:{
            f_get = g_gamemangaer.GetRole;
            break;
        }
        case GamePublic.e_BaseObjType.Build:{
            f_get = g_gamemangaer.GetBuild;
            break;
        }
    }
    switch (v_src.Script.Name) {
        case GamePublic.e_RoleAction.attack:{
            let role = g_gamemangaer.GetRole(v_src.ScrRole.Num);
            role.Command.v_ActionWaitTime = 0;
            var CommandArray = role.Command.v_RoleActionCommandArray1;
            if(CommandArray.length > 0 && CommandArray[role.Command.v_RoleActionCommandArray1Number].Script.Name == GamePublic.e_CommandType.RoleAttack){
                var t_role = f_get(CommandArray[role.Command.v_RoleActionCommandArray1Number].TarRole.Num);
                //for(var i in CommandArray[CommandArray.length - 1].TarRole.Array){
                var src = new GamePublic.s_RoleScript({Info:role.GameInfo.v_RoleAttackType,Name:GamePublic.e_CommandType.RoleAttackHarm},{Num:role.Info.v_Number, Array:"",Pos:123},{Num:t_role.Info.v_Number, Array:"",Pos:123});
                //console.log(src);
                t_role.Command.v_RoleActionCommandPassive.push(src);
                //}
            }
            break;
        }
    }
}

C_SrciptProc.Command1StateCheckSrciptProc = function (RoleNum) {  //动作处理
    let g_gdrm = GamePublic.g_GameDataResManger;
    let CommandState = GamePublic.e_CommandResultSrcipt.Success;
    let role = g_gdrm.GetRole(RoleNum);
    if(role.Command.v_RoleActionCommandArray1.length < 1) return CommandState;
    let CommandArray = role.Command.v_RoleActionCommandArray1[role.Command.v_RoleActionCommandArray1Number];
    switch (CommandArray.Script.Name) {
        case GamePublic.e_CommandType.RoleAttack:{
            let t_role = null;
            switch(CommandArray.Script.Info.TargetType){
                case GamePublic.e_BaseObjType.Role:{
                    t_role = g_gdrm.GetRole(CommandArray.TarRole.Num);
                    break;
                }
                case GamePublic.e_BaseObjType.Build:{
                    t_role = g_gdrm.GetBuild(CommandArray.TarRole.Num);
                    break;
                }
            }
            //if(t_role.Info.v_State.TypeState != GamePublic.e_TypeState.Death){
            if(t_role.Info.v_PropertyData.NowHP > 0){
                CommandState = GamePublic.e_CommandResultSrcipt.Continue;
            }
            break;
        }
    }
    return CommandState;
}

C_SrciptProc.RoleTargetCheck = function(v_src) {  //角色目标检测
    let g_gamemangaer = GamePublic.g_GameDataResManger;
    let State = GamePublic.e_RoleTargetCheckResult.Success;
    switch (v_src.Script.Name) {
        case GamePublic.e_RoleTargetCheck.RoleAttack:{
            let role = g_gamemangaer.GetRole(v_src.ScrRole.Num);
            let t_role = g_gamemangaer.GetRole(v_src.TarRole.Num);
            if (role.Info.v_State.TypeState == GamePublic.e_TypeState.Death){
                console.log("本角色已经亡 无法反击");
                State = GamePublic.e_RoleTargetCheckResult.Src_Is_Death;
                break;
            }
            if(v_src.ScrRole.Num == v_src.TarRole.Num){
                console.log(v_src.ScrRole.Num,"攻击目标是自己");
                State = GamePublic.e_RoleTargetCheckResult.Is_Self;
                break;
            }
            if(role.Command.v_RoleActionCommandArray1.length){
                let command = role.Command.v_RoleActionCommandArray1[role.Command.v_RoleActionCommandArray1Number];
                //console.log(command);
                if(command.Script.Name == GamePublic.e_CommandType.RoleAttack && command.TarRole.Num == v_src.TarRole.Num){
                    //console.log(v_src.ScrRole.Num,"攻击目标相同");
                    State = GamePublic.e_RoleTargetCheckResult.Is_Self;
                }
            }
            if(t_role.Info.v_PropertyData.NowHP < 1){
                console.log(v_src.ScrRole.Num,"攻击目标已亡:",v_src.TarRole.Num);
                State = GamePublic.e_RoleTargetCheckResult.Tar_Is_Death;
                break;
            }
            break;
        }
    }
    return State;
}

module.exports = C_SrciptProc;