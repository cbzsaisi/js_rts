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
            for(let i in s_role.Command.v_TrarArray){
                for(let j in _src.TarRole.Array){
                    //console.log(s_role.Command.v_TrarArray[i]);
                    if(s_role.Command.v_TrarArray[i] == _src.TarRole.Array[j]){
                        //console.log("攻击目标编号相同");
                        break;
                    }
                }
            }
            s_role.Command.v_TrarArray.splice(0,s_role.Command.v_TrarArray.length);
            for(var i in _src.TarRole.Array){
                s_role.Command.v_TrarArray.push(_src.TarRole.Array[i]);
            }
            s_role.SwitchRoleCommand(GamePublic.e_RoleCommandType.Command1,1);
            s_role.Command.v_TarNum = _src.TarRole.Num;
            switch (s_role.GameInfo.v_SpriteType) {
                case GamePublic.e_SpriteType.spine:
                    s_role.Command.v_ActionEvent = GamePublic.e_RoleAction.attack;
                    s_role.Info.v_TargetType = _src.Script.Info.TargetType;
                    s_role.SetRoleAction(GamePublic.e_RoleAction.jump);
                    break;
            }
            //g_RoleManager.RoleAttcak(_src.ScrRole.Num, _src.TarRole.Num);
            break;
        }
        case GamePublic.e_CommandBaseType.Work_Felling:{
            //console.log("范围内 开始伐木",_src.TarRole.Pos,_src.Script.Info);
            s_role.SwitchRoleCommand(GamePublic.e_RoleCommandType.Command1,1);
            s_role.Command.v_TarNum = _src.TarRole.Num;
            switch (s_role.GameInfo.v_SpriteType) {
                case GamePublic.e_SpriteType.spine:
                    s_role.Command.v_ActionEvent = GamePublic.e_RoleAction.Work_Felling;
                    s_role.Info.v_TargetType = _src.Script.Info.TargetType;
                    s_role.SetRoleAction(GamePublic.e_RoleAction.jump);
                    break;
            }
            break;
        }
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
            var hr = g_Astar.RoleFindWay(s_role, _src.TarRole.Pos,GamePublic.e_FindWayType.Move);
            if (hr) {
                SrcExeState = GamePublic.e_CommandSrcipt.Success;
            } else {
                //SrcExeState = e_CommandSrcipt.Fail;
                console.log("RoleGoToPos寻路失败");
            }
            break;
        }
        case GamePublic.e_CommandType.RoleAttack:{
            let f_get = g_gamemangaer.GetObj(_src.Script.Info.TargetType);
            // switch(_src.Script.Info.TargetType){
            //     case GamePublic.e_BaseObjType.Role:{
            //         f_get = g_gamemangaer.GetRole;
            //         break;
            //     }
            //     case GamePublic.e_BaseObjType.Build:{
            //         f_get = g_gamemangaer.GetBuild;
            //         break;
            //     }
            // }
            let t_role = f_get(_src.TarRole.Num);
            if (t_role) {
                if (Math.abs(s_role.Info.v_MapPos.x - _src.TarRole.Pos.x) < 2 && Math.abs(s_role.Info.v_MapPos.y - _src.TarRole.Pos.y) < 2) {
                    //console.log("范围内 开始攻击");
                    s_role.GameInfo.v_RoleAttackType = {AttackType:GamePublic.e_RoleAttackType.left_hand,Skill:"Left"};//修改攻击类型
                    var src = new GamePublic.s_RoleScript({Info:{TargetType:_src.Script.Info.TargetType,ComNum:1,ComLevel:GamePublic.e_CommandLevel.Level1,ComWeight:3},Name:GamePublic.e_CommandBaseType.RoleAttacking},{Num:s_role.Info.v_Number,Array:"332111",Pos:123},{Num:_src.TarRole.Num,Array:_src.TarRole.Array,Pos:_src.TarRole.Pos});
                    s_role.Command.v_ActionCommandArray.push(src);
                    SrcExeState = GamePublic.e_CommandSrcipt.Success;
                } else {
                    //console.log("范围外，要移动",s_role,_src.TarRole.Pos);
                    var hr = g_Astar.RoleFindWay(s_role,_src.TarRole.Pos,GamePublic.e_FindWayType.Near);
                    if (hr) {
                        SrcExeState = GamePublic.e_CommandSrcipt.Success;
                        //这个会被 命令栈pop掉
                        //console.log("这个会被 命令栈pop掉");
                        //var src = new GamePublic.s_RoleScript({Info:1,Name:"Non"},{Num:_src.ScrRole.Num,Array:"22",Pos:123},{Num:_src.TarRole.Num,Array:"22",Pos:_src.TarRole.Pos});
                        //t_role.Command.v_ActionCommandArray1.push(src);
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
        case GamePublic.e_CommandType.Work_Felling:{
            let f_get = g_gamemangaer.GetObj(_src.Script.Info.TargetType);
            let map = f_get(_src.TarRole.Num);
            if (Math.abs(s_role.Info.v_MapPos.x - _src.TarRole.Pos.x) < 2 && Math.abs(s_role.Info.v_MapPos.y - _src.TarRole.Pos.y) < 2) {
                var src = new GamePublic.s_RoleScript({Info:{TargetType:_src.Script.Info.TargetType,ComNum:1,ComLevel:GamePublic.e_CommandLevel.Level1,ComWeight:3},Name:GamePublic.e_CommandBaseType.Work_Felling},{Num:s_role.Info.v_Number,Array:"332111",Pos:123},{Num:_src.TarRole.Num,Array:_src.TarRole.Array,Pos:_src.TarRole.Pos});
                //console.log("伐木开始",_src.Script.Info);
                s_role.Command.v_ActionCommandArray.push(src);
                SrcExeState = GamePublic.e_CommandSrcipt.Success;
            } else {
                //console.log("伐木范围外，要移动",_src.TarRole.Pos);
                var hr = g_Astar.RoleFindWay(s_role,_src.TarRole.Pos,GamePublic.e_FindWayType.Felling);
                if (hr) {
                    SrcExeState = GamePublic.e_CommandSrcipt.Success;
                } else {
                    console.log("无法移动到攻击目标周围");
                }
            }
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
            //console.log("处理被攻击 来自：",_src.ScrRole.Num,"目标：",_src.TarRole.Num,"对方是：",_src.Script.Info.TargetType);
            let s_role = g_gamemangaer.GetRole(_src.ScrRole.Num);
            let t_role = g_gamemangaer.GetRole(_src.TarRole.Num);
            SrcExeState = GamePublic.e_CommandSrcipt.Success;
            if (t_role.Info.v_State.TypeState == GamePublic.e_TypeState.Death){
                console.log("本角色已经亡 无法反击");
                break;
            }
            g_RoleManager.RoleAttackCalc(_src.ScrRole.Num,_src.TarRole.Num,_src.Script.Info.Type);

            //反击
            var res = this.RoleTargetCheck(GamePublic.s_RoleScript({ Info:1, Name:GamePublic.e_RoleTargetCheck.RoleAttack}, { Num: _src.TarRole.Num, Array: [], Pos: 123 }, { Num: _src.ScrRole.Num, Array: [], Pos: 123 }));
            switch(res){
                case GamePublic.e_RoleTargetCheckResult.Success:{
                    t_role.ClearRoleCommand(GamePublic.e_RoleCommandType.Command);
                    t_role.ClearRoleCommand(GamePublic.e_RoleCommandType.Command1);
                    let task_value = new GamePublic.s_RoleScript({Info:{Task:{SourceType:GamePublic.e_BaseObjType.Role,TargetType:GamePublic.e_BaseObjType.Role,ValueObjType:GamePublic.e_CommandTaskValueType.AttackRoleValue,ValueType:GamePublic.e_CommandTaskValueName.RoleHp,SourceValue:0,TargetValue:0}}, Name:GamePublic.e_CommandTaskType.RoleAttackRole}, { Num: _src.TarRole.Num}, { Num: _src.ScrRole.Num, Pos: s_role.Info.v_MapPos});
                    let src = new GamePublic.s_RoleScript({ Info:{TargetType:GamePublic.e_BaseObjType.Role,ComNum:1,ComLevel:GamePublic.e_CommandLevel.Level2,ComWeight:3,Task:task_value}, Name:GamePublic.e_CommandType.RoleAttack}, { Num: _src.TarRole.Num, Array: "222", Pos: _src.TarRole.Pos }, { Num: _src.ScrRole.Num, Array: [_src.ScrRole.Num], Pos: s_role.Info.v_MapPos });
                    t_role.Command.v_ActionCommandArray.push(src);
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
    let r_to_r = null;
    switch(v_src.Script.Info.TargetType){//目标类型
        case GamePublic.e_BaseObjType.Role:{
            f_get = g_gamemangaer.GetRole;
            r_to_r = GamePublic.e_RoleToRoleType.RoleToRole;
            break;
        }
        case GamePublic.e_BaseObjType.Build:{
            f_get = g_gamemangaer.GetBuild;
            r_to_r = GamePublic.e_RoleToRoleType.RoleToBuild;
            break;
        }
        case GamePublic.e_BaseObjType.MaptileAdditional:{
            f_get = g_gamemangaer.GetMap;
            r_to_r = GamePublic.e_RoleToRoleType.RoleToBuild;
            break;
        }
    }
    switch (v_src.Script.Name) {
        case GamePublic.e_RoleAction.attack:{
            let role = g_gamemangaer.GetRole(v_src.ScrRole.Num);
            role.Command.v_ActionWaitTime = 0;
            //var CommandArray = role.Command.v_ActionCommandArray1;
            //console.log(role.Command.v_ActionCurScriptArray1);
            if(role.Command.v_ActionCurScriptArray1 != null && role.Command.v_ActionCurScriptArray1.Script.Name == GamePublic.e_CommandType.RoleAttack && role.Command.v_ActionCurScriptArray1.TarRole.Num == v_src.TarRole.Num){
                //var t_role = f_get(CommandArray[role.Command.v_ActionCommandArray1Number].TarRole.Num);
                var t_role = f_get(v_src.TarRole.Num);
                //for(var i in CommandArray[CommandArray.length - 1].TarRole.Array){
                //console.log(v_src.Script.Info.TargetType,t_role,CommandArray[role.Command.v_ActionCommandArray1Number].TarRole.Num,v_src.TarRole.Num);
                var src = new GamePublic.s_RoleScript({Info:{Type:role.GameInfo.v_RoleAttackType,TargetType:GamePublic.e_RoleToRoleType.RoleToRole},Name:GamePublic.e_CommandType.RoleAttackHarm},{Num:role.Info.v_Number, Array:"",Pos:123},{Num:t_role.Info.v_Number, Array:"",Pos:123});
                t_role.Command.v_ActionCommandPassive.push(src);
                //}
            }
            break;
        }
        case GamePublic.e_RoleAction.Work_Felling:{
            let role = g_gamemangaer.GetRole(v_src.ScrRole.Num);
            let t_res = f_get(v_src.TarRole.Num);
            role.Command.v_ActionWaitTime = 0;
            let MapTile = t_res.MapRoomArray[v_src.TarRole.Pos.x][v_src.TarRole.Pos.y].v_ResArray[0];
            MapTile.Info.v_PropertyData.ProgressCount += 1;
            let m_value = MapTile.PropertyDataValueRecast(1);
            if(m_value != 0){
                GamePublic.g_ItemManager.BagAddItem(GamePublic.e_ItemName.Wood_Material, m_value, role.Info.v_Number, "Role");
            }
            console.log(GamePublic.g_ItemManager.GetItemQuantity(GamePublic.e_ItemName.Wood_Material, role.Info.v_Number, "Role"));
            break;
        }
    }
}

C_SrciptProc.Command1StateCheckSrciptProc = function (RoleNum) {  //判断命令是否执行到位
    let g_gdrm = GamePublic.g_GameDataResManger;
    let CommandState = GamePublic.e_CommandResultSrcipt.Success;
    let role = g_gdrm.GetRole(RoleNum);
    //if(role.Command.v_ActionCommandArray1.length < 1) return CommandState;
    switch (role.Command.v_ActionCurScriptArray1.Script.Name) {
        case GamePublic.e_CommandType.RoleAttack:{
            //let t_role = g_gdrm.GetObj(role.Command.v_ActionCurScriptArray1.Script.Info.TargetType)(role.Command.v_ActionCurScriptArray1.TarRole.Num);
            let ret = g_RoleManager.TaskCheck(role.Command.v_ActionCurScriptArray1);
            if(ret.res == false)CommandState = GamePublic.e_CommandResultSrcipt.Continue;
            break;
        }
        case GamePublic.e_CommandType.Work_Felling:{
            let ret = g_RoleManager.TaskCheck(role.Command.v_ActionCurScriptArray1);
            if(ret.res == false)CommandState = GamePublic.e_CommandResultSrcipt.Continue;
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
            if(role.Command.v_ActionCurScriptArray1){
                if(role.Command.v_ActionCurScriptArray1.Script.Name == GamePublic.e_CommandType.RoleAttack && role.Command.v_ActionCurScriptArray1.TarRole.Num == v_src.TarRole.Num){
                    //console.log(v_src.ScrRole.Num,"攻击目标相同");
                    State = GamePublic.e_RoleTargetCheckResult.Is_Self;
                }
            }
            // if(role.Command.v_ActionCommandArray1.length){
            //     let command = role.Command.v_ActionCommandArray1[role.Command.v_ActionCommandArray1Number  - 1];
            //     if(!command)console.log(command,role.Command.v_ActionCommandArray1Number,role.Command.v_ActionCommandArray1);
            //     if(command != null && command.Script.Name == GamePublic.e_CommandType.RoleAttack && command.TarRole.Num == v_src.TarRole.Num){
            //         //console.log(v_src.ScrRole.Num,"攻击目标相同");
            //         State = GamePublic.e_RoleTargetCheckResult.Is_Self;
            //     }
            // }
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