var GamePublic = require("./F_GamePublic");
//var GameManager = require("./F_GameManager");
var g_Astar = require("./F_AStar");
//var g_RoleManager = require("./F_RoleManager");


function C_SrciptProc() {
};

C_SrciptProc.RoleCommandSrciptProc = function (_src) {

    var g_gamemangaer = GamePublic.g_GameDataResManger;
    var s_role = g_gamemangaer.GetRole(_src.ScrRole.Num);
    s_role.RoleCommand.v_ActionConsoleType = 1; //控制类型
    s_role.RoleCommand.v_ActionLoop = false;
    switch (_src.Script.Name) {
        case "RoleMove":
            s_role.RoleCommand.v_ActionScriptFailType = g_Astar.RoleTargePosPassTest(s_role.RoleInfo.v_RolePassStatu, g_gamemangaer.GetMap(s_role.RoleInfo.v_CurrentMapNum).MapRoomArray[_src.TarRole.Pos.x][_src.TarRole.Pos.y]);
            if (s_role.RoleCommand.v_ActionScriptFailType == GamePublic.e_ActionScriptFailType.Success) {
                s_role.RoleCommand.v_ActionWaitTime = (20000 / GamePublic.e_RoleSpeed.scpfps);
                var map = s_role.RoleGameInfo.v_CurrentMap.MapRoomArray;
                var src_pos = s_role.RoleInfo.v_RoleMapPos;
                var MapOffset = GamePublic.sub_Vec2d(map[src_pos.x][src_pos.y].v_SpritePos, map[_src.TarRole.Pos.x][_src.TarRole.Pos.y].v_SpritePos);
                s_role.RoleGameInfo.v_MapOffset = GamePublic.s_Vec2d(MapOffset.x / s_role.RoleCommand.v_ActionWaitTime, MapOffset.y / s_role.RoleCommand.v_ActionWaitTime);
                s_role.SetMapPos(_src.TarRole.Pos);
                s_role.RoleInfo.v_SpriteAngle.Des = GamePublic.GetAngle(src_pos,_src.TarRole.Pos);
                s_role.RoleCommand.v_ActionConsoleType = 1; //控制类型
                switch (s_role.RoleGameInfo.v_SpriteType) {
                    case GamePublic.e_SpriteType.spine:
                        //C_RoleManager.SetRoleAction(role.v_Sprite, e_SpriteActionName.walk);
                        if (MapOffset.x > 0) { if (s_role.RoleGameInfo.v_SpriteScale.x > 0) s_role.RoleGameInfo.v_SpriteScale.x = s_role.RoleGameInfo.v_SpriteScale.x * -1}
                        else if (MapOffset.x < 0) { if (s_role.RoleGameInfo.v_SpriteScale.x < 0) s_role.RoleGameInfo.v_SpriteScale.x = s_role.RoleGameInfo.v_SpriteScale.x * -1}//转向
                        s_role.RoleCommand.v_ActionLoop = true;
                        if(s_role.RoleCommand.v_ActionEvent != GamePublic.e_RoleAction.walk){
                            s_role.RoleCommand.v_ActionEvent = GamePublic.e_RoleAction.walk;
                            s_role.SetRoleAction(s_role.RoleCommand.v_ActionEvent);
                        }
                        break;
                    case GamePublic.e_SpriteType.img:
                        break;
                    case GamePublic.e_SpriteType.model:
                        /*                   var seft = s_role.RoleGameInfo.v_Sprite.getComponent(cc.SkeletonAnimation);
                                          var model = seft.getAnimationState('Take 001');
                                          model.on('finished', function () { console.log("sssss"); }, this);*/
                        //g_RoleManager.SetRoleAction(s_role,GamePublic.e_RoleAction.walk);
                        s_role.RoleCommand.v_ActionLoop = true;
                        if(s_role.RoleCommand.v_ActionEvent != GamePublic.e_RoleAction.walk){
                            s_role.RoleCommand.v_ActionEvent = GamePublic.e_RoleAction.walk;
                            s_role.SetRoleAction(s_role.RoleCommand.v_ActionEvent);
                        }
                        break;
                }
            } else {
                s_role.RoleGameInfo.v_MoveBlockPos = GamePublic.s_Vec2d(_src.TarRole.Pos.x, _src.TarRole.Pos.y);
                s_role.RoleCommand.v_ActionScriptFail++; //错误次数
                s_role.RoleCommand.v_RoleActionCommandArray.splice(0, s_role.RoleCommand.v_RoleActionCommandArray.length);
                //C_MathLibStar.RoleFindWay(role,role.v_ActionMovePos);
            }
            break;
        case "RoleWait":
            //C_RoleManager.SetRoleAction(role.v_Sprite,e_SpriteActionName.jump);
            //role.v_ActionWaitTime=(600 / e_RoleSpeed.scpfps);
            //role.v_ActionScriptFailType = e_ActionScriptFailType.Success;
            break;
        case GamePublic.e_CommandType.RoleAttacking:{
            console.log("角色开始攻击");

            s_role.RoleCommand.v_RoleTrarArray.splice(0,s_role.RoleCommand.v_RoleTrarArray.length);
            for(var i in _src.TarRole.Array){
                s_role.RoleCommand.v_RoleTrarArray.push(_src.TarRole.Array[i]);
            }
            s_role.RoleCommand.v_ActionLoop = false;
            s_role.RoleCommand.v_RoleTarNum = _src.TarRole.Num;
            s_role.RoleCommand.v_ActionWaitTime = 1;
            s_role.RoleCommand.v_ActionConsoleType = 2;
            s_role.RoleCommand.v_ActionScriptFailType = GamePublic.e_ActionScriptFailType.Success;
            switch (s_role.RoleGameInfo.v_SpriteType) {
                case GamePublic.e_SpriteType.spine:
                    s_role.RoleCommand.v_ActionEvent = GamePublic.e_RoleAction.attack;
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

C_SrciptProc.RoleCommandSrciptProc1 = function (_src) {
    var g_gamemangaer = GamePublic.g_GameDataResManger;
    var SrcExeState = GamePublic.e_CommandSrcipt.Fail;
    var s_role = g_gamemangaer.GetRole(_src.ScrRole.Num);
    switch (_src.Script.Name) {
        case "RoleGoToPos":{
            var hr = g_Astar.RoleFindWay(role, _src.TarRole.Pos);
            if (hr) {
                SrcExeState = GamePublic.e_CommandSrcipt.Success;
            } else {
                //SrcExeState = e_CommandSrcipt.Fail;
                console.log("RoleGoToPos寻路失败");
            }
            break;
        }
        case GamePublic.e_CommandType.RoleAttack:{
            var t_role = g_gamemangaer.GetRole(_src.TarRole.Num);
            if (t_role) {
                if (Math.abs(s_role.RoleInfo.v_RoleMapPos.x - t_role.RoleInfo.v_RoleMapPos.x) < 2 && Math.abs(s_role.RoleInfo.v_RoleMapPos.y - t_role.RoleInfo.v_RoleMapPos.y) < 2) {
                    console.log("范围内 开始攻击");
                    s_role.RoleGameInfo.v_RoleAttackType = {AttackType:"hand",Skill:"Left"};
                    var src = new GamePublic.s_RoleScript({Info:1,Name:GamePublic.e_CommandType.RoleAttacking},{Num:s_role.RoleInfo.v_RoleNumber,Array:"22",Pos:123},{Num:_src.TarRole.Num,Array:_src.TarRole.Array,Pos:null});
                    s_role.RoleCommand.v_RoleActionCommandArray.push(src);
                    SrcExeState = GamePublic.e_CommandSrcipt.Success;
                } else {
                    console.log("范围外，要移动");
                    var map = t_role.RoleGameInfo.v_CurrentMap.MapRoomArray;
                    var ExistRoleArray = map[t_role.RoleInfo.v_RoleMapPos.x][t_role.RoleInfo.v_RoleMapPos.y].v_ExistRoleArray;
                    map[t_role.RoleInfo.v_RoleMapPos.x][t_role.RoleInfo.v_RoleMapPos.y].v_ExistRoleArray = []; //暂时把目标点清空
                    var hr = g_Astar.RoleFindWay(s_role,t_role.RoleInfo.v_RoleMapPos);
                    map[t_role.RoleInfo.v_RoleMapPos.x][t_role.RoleInfo.v_RoleMapPos.y].v_ExistRoleArray = ExistRoleArray;
                    if (hr) {
                        SrcExeState = GamePublic.e_CommandSrcipt.Success;
                        //这个会被 命令栈pop掉
                        var src = new GamePublic.s_RoleScript({Info:1,Name:"Non"},{Num:_src.ScrRole.Num,Array:"22",Pos:123},{Num:_src.TarRole.Num,Array:"22",Pos:_src.TarRole.Pos});
                        s_role.RoleCommand.v_RoleActionCommandArray1.push(src);
                    } else {
                        console.log("无法移动到攻击目标周围");
                    }
                }
            }
            break;
        }
        case GamePublic.e_CommandType.RoleDeath:{
            console.log("e_CommandType.RoleDeath");
            s_role.SetRoleStateChange(GamePublic.e_RoleTypeState.Death);
            break;
        }
    }
    return SrcExeState;
}

C_SrciptProc.RoleActionCommandPassiveProc = function (_src) { //被动处理
    var g_gamemangaer = GamePublic.g_GameDataResManger;
    var SrcExeState = GamePublic.e_CommandSrcipt.Fail;
    switch (_src.Script.Name) {
        case GamePublic.e_CommandType.RoleAttackHure:{
            console.log("处理被攻击",_src);
            SrcExeState = GamePublic.e_CommandSrcipt.Success;
            let t_role = g_gamemangaer.GetRole(_src.ScrRole.Num);
            t_role.RoleInfo.v_RolePropertyData.NowHP -= 15;
            //if (hr) {SrcExeState = GamePublic.e_CommandSrcipt.Success;} else {console.log("失败");}
            break;
        }
    }
    return SrcExeState;
}
module.exports = C_SrciptProc;