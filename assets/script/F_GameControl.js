var GamePublic = require("./F_GamePublic");
//var g_Astar = require("./F_AStar");

function C_GameControl() {
};

C_GameControl.RoleRayCheck = function (_pos,_RoleNum) {
    let ray = GamePublic.g_MainCamera.getComponent(cc.Camera).getRay(_pos);
    var role = GamePublic.g_GameDataResManger.GetRole(_RoleNum);
    return cc.geomUtils.intersect.raycast(role.RoleGameInfo.v_RoleSprite.v_Sprite, ray).length;
}
C_GameControl.MapTiledRayCheck = function (_pos, _Map) {
    let ray = GamePublic.g_MainCamera.getComponent(cc.Camera).getRay(_pos);
    for (var i = 0; i < _Map.v_MapSize.x; i++) {
        for (var j = 0; j < _Map.v_MapSize.y; j++) {
            var MapTiledSprite = _Map.MapRoomArray[i][j].v_TileSprite;
            if (MapTiledSprite) {
                var r = cc.geomUtils.intersect.raycast(MapTiledSprite, ray);
                if (r.length) return { x: i, y: j }
            }
        }
    }
    return { x: -1, y: -1 };
}

C_GameControl.MapTiledCoverCheck = function (_pos, _Map,_Size) { //建筑占地检测
    var size = GamePublic.s_Vec2d(_Size.x+1, _Size.y+1);
    var pos = this.MapTiledRayCheck(_pos, _Map);
    var num = size.x * size.y;
    if(pos.x + size.x > _Map.v_MapSize.x) size.x = _Map.v_MapSize.x - pos.x;
    if(pos.y + size.y > _Map.v_MapSize.y) size.y = _Map.v_MapSize.y - pos.y;
    _Map.v_MapTabArray.splice(0,_Map.v_MapTabArray.length);
    if(pos.x < 0 || pos.y < 0)return false;
    for(var i = 0;i < size.x;i++){
        for(var j = 0;j < size.y;j++){
            _Map.v_MapTabArray.push(GamePublic.s_Vec2d(pos.x + i,pos.y + j));
        }
    }
    if(num == _Map.v_MapTabArray.length)return true;
    return false;
}

C_GameControl.ControlMouseLeftDownCall = function (_pos) {
    //console.log(_pos);
    if (GamePublic.g_MouseRightFlag) return;
    GamePublic.g_MouseLeftFlag ? GamePublic.g_MouseLeftFlag = false : GamePublic.g_MouseLeftFlag = true;
    GamePublic.g_LeftKeyStartPos = GamePublic.s_Vec2d(_pos.x, _pos.y);
    GamePublic.g_MoveStartPos = GamePublic.s_Vec2d(_pos.x, _pos.y);
    if (GamePublic.g_GamePageManager.PageNumber) {
        GamePublic.g_GamePageManager.PageButtonCheck(_pos, GamePublic.e_ClickType.LeftDown);
    }
    //alert(_pos.x);
    //alert(_pos.y);
    GamePublic.g_MouseMoveFlag = false;
}

C_GameControl.ControlMouseRightDownCall = function (_pos) {
    if (GamePublic.g_MouseLeftFlag) return;
    if (_pos.x >= 0 && _pos.x <= GamePublic.g_winSize.width && _pos.y >= 0 && _pos.y <= GamePublic.g_winSize.height) {
        GamePublic.g_MouseRightFlag ? GamePublic.g_MouseRightFlag = false : GamePublic.g_MouseRightFlag = true;
        GamePublic.g_MoveOffLast = GamePublic.s_Vec2d(_pos.x, _pos.y);
    }
    GamePublic.g_MouseMoveFlag = false;
}

C_GameControl.ControlMouseLeftUpCall2 = function (_pos) {
    let ray = cc.Camera.main.getRay(_pos);
    let results = cc.geomUtils.intersect.raycast(GamePublic.g_GameMain.node, ray);
}

C_GameControl.ControlMouseMiddleUpCall = function (_pos) {

}

C_GameControl.ControlMouseLeftUpCall = function (_pos) {
    var ControlState = GamePublic.e_ControlState.Non;
    if (GamePublic.g_GameMenuManager && GamePublic.g_GameMenuManager.MenuNumber) {
        if (!GamePublic.g_MouseMoveFlag) GamePublic.g_GameMenuManager.MenuButtonCheck(_pos, GamePublic.e_ClickType.LeftUp);
    } else if (GamePublic.g_GamePageManager && GamePublic.g_GamePageManager.PageNumber) {
        GamePublic.g_GamePageManager.PageButtonCheck(_pos, GamePublic.e_ClickType.LeftUp);
    } else if (GamePublic.g_MouseLeftFlag == true && _pos.x >= 0 && _pos.x <= GamePublic.g_winSize.width && _pos.y >= 0 && _pos.y <= GamePublic.g_winSize.height) {
        // if (GamePublic.g_MouseMoveFlag == false) {
        //     ControlState = GamePublic.e_ControlState.MouseLeftNoMove;
        // } else {
        //     ControlState = GamePublic.e_ControlState.MouseLeftMove;
        // }
    }
    if (GamePublic.g_MouseMoveFlag == false) {
         GamePublic.g_ButtonUsingFlag = false;
        if(GamePublic.g_GameRunUi && GamePublic.g_GameRunUi.ClickCheck(_pos,GamePublic.e_ClickType.LeftUp)){
            GamePublic.g_ButtonUsingFlag = true;
        }
        if (GamePublic.g_Active_Map && !GamePublic.g_ButtonUsingFlag) {
            //var mappos = GamePublic.GetMapXY(_pos);
            var mappos = C_GameControl.MapTiledRayCheck(_pos, GamePublic.g_Active_Map);
            //console.log(mappos);
            if (GamePublic.g_RoleSelectStaus == GamePublic.e_SelectStaus.NonSelect) {
                for (var i = 0; i < GamePublic.g_GameDataResManger.RoleArray.length; i++) {
                    if (C_GameControl.RoleRayCheck(_pos, GamePublic.g_GameDataResManger.RoleArray[i].obj.GetNumber())) {
                        var Role = GamePublic.g_GameDataResManger.GetRole(GamePublic.g_GameDataResManger.RoleArray[i].obj.GetNumber());
                        GamePublic.g_SelectRoleArray.push(Role.RoleInfo.v_RoleNumber);
                        Role.RoleGameInfo.v_RoleSelectFlag = true;
                        break;
                    }
                }
                if (GamePublic.g_SelectRoleArray.length) GamePublic.g_RoleSelectStaus = GamePublic.e_SelectStaus.MultiRole;

                //GamePublic.g_ActiveRole = obj.Obj;
                //GamePublic.g_RoleSelectStaus = GamePublic.e_SelectStaus.SingleRole;

            } else
                if (mappos.x >= 0 && mappos.y >= 0 && mappos.x < GamePublic.e_MapSizeType1.width && mappos.y < GamePublic.e_MapSizeType1.height) {
                    switch (GamePublic.g_RoleSelectStaus) {
                        case GamePublic.e_SelectStaus.SingleRole:
                            //g_Astar.RoleFindWay(GamePublic.g_ActiveRole, mappos);
                            break;
                        case GamePublic.e_SelectStaus.MultiRole:
                            for (var i = 0; i < GamePublic.g_SelectRoleArray.length; i++) {
                                var role = GamePublic.g_GameDataResManger.GetRole(GamePublic.g_SelectRoleArray[i]);
                                if (role.RoleCommand.v_RoleActionCommandArray1.length) {
                                    role.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.End;
                                } else {
                                    role.RoleCommand.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.New;
                                }
                                if (GamePublic.g_Active_Map.MapRoomArray[mappos.x][mappos.y].v_ExistRoleArray.length) { //如果目标点有单位
                                    var t_role = GamePublic.g_GameDataResManger.GetRole(GamePublic.g_Active_Map.MapRoomArray[mappos.x][mappos.y].v_ExistRoleArray[0]);
                                    if (t_role.RoleInfo.v_RoleNumber != role.RoleInfo.v_RoleNumber) { //非自己 攻击
                                        //console.log(Math.abs(-1))                                       
                                        var src = new GamePublic.s_RoleScript({ Type:1, Name:GamePublic.e_CommandType.RoleAttack}, { Num: role.RoleInfo.v_RoleNumber, Array: "22", Pos: 123 }, { Num: t_role.RoleInfo.v_RoleNumber, Array: [t_role.RoleInfo.v_RoleNumber], Pos: mappos });
                                        role.RoleCommand.v_RoleActionCommandArray1.push(src);
                                    }
                                } else { //移动
                                    var src = new GamePublic.s_RoleScript({ Type: 1, Name: "RoleGoToPos" }, { Num: role.RoleInfo.v_RoleNumber, Array: "22", Pos: 123 }, { Num: 0, Array: "22", Pos: mappos });
                                    role.RoleCommand.v_RoleActionCommandArray1.push(src);
                                    //GamePublic.g_Active_Map.MapRoomArray[mappos.x][mappos.y].SetSelectFlag(true);
                                }
                            }
                            break;
                    }
                }
        }

    } else
        if (GamePublic.g_MouseMoveFlag != false) {
            var MoveOffLast = GamePublic.g_LeftKeyStartPos;
            var SelectFlag = false;

            if (GamePublic.g_MoveSelectEndPos && GamePublic.g_RoleSelectStaus == GamePublic.e_SelectStaus.NonSelect) {
                var RightTop = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x > GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y > GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                var LeftDown = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x < GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y < GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                for (var i = 0; LeftDown.x + i <= RightTop.x; i++) {
                    for (var j = 0; LeftDown.y + j <= RightTop.y; j++) {
                        var MapTileRoleArray = GamePublic.g_Active_Map.MapRoomArray[LeftDown.x + i][LeftDown.y + j].v_ExistRoleArray;
                        for (var k = 0; k < MapTileRoleArray.length; k++) {
                            GamePublic.g_SelectRoleArray.push(MapTileRoleArray[k]);
                            GamePublic.g_GameDataResManger.GetRole(MapTileRoleArray[k]).RoleGameInfo.v_RoleSelectFlag = true;
                            SelectFlag = true;
                        }
                        GamePublic.g_Active_Map.MapRoomArray[LeftDown.x + i][LeftDown.y + j].SetSelectFlag(false);
                    }
                }
                if (GamePublic.g_SelectRoleArray.length) GamePublic.g_RoleSelectStaus = GamePublic.e_SelectStaus.MultiRole;
            }
            if (!SelectFlag) {
                if (GamePublic.g_SelectRoleArray.length) { //取消框选
                    for (var i = 0; i < GamePublic.g_SelectRoleArray.length; i++) {
                        GamePublic.g_GameDataResManger.GetRole(GamePublic.g_SelectRoleArray[i]).RoleGameInfo.v_RoleSelectFlag = false;
                    }
                    GamePublic.g_SelectRoleArray.splice(0, GamePublic.g_SelectRoleArray.length);
                    GamePublic.g_RoleSelectStaus = GamePublic.e_SelectStaus.NonSelect;
                }
                if (GamePublic.g_MoveSelectEndPos) {
                    var RightTop = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x > GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y > GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                    var LeftDown = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x < GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y < GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                    for (var i = 0; LeftDown.x + i <= RightTop.x; i++) {
                        for (var j = 0; LeftDown.y + j <= RightTop.y; j++) {
                            GamePublic.g_Active_Map.MapRoomArray[LeftDown.x + i][LeftDown.y + j].SetSelectFlag(false);
                        }
                    }
                }
            }
        }

    GamePublic.g_MouseMoveFlag = false;
    GamePublic.g_MouseLeftFlag = false;
    GamePublic.g_MoveSelectStartPos = null;
    GamePublic.g_MoveSelectEndPos = null;
}

C_GameControl.ControlMouseRightUpCall = function (_pos) {
    GamePublic.g_MouseRightFlag = false;
    var ControlState = GamePublic.e_ControlState.Non;
    if (GamePublic.g_MouseMoveFlag == false) {
        ControlState = GamePublic.e_ControlState.MouseRightNoMove;
    } else {
        ControlState = GamePublic.e_ControlState.MouseRightMove;
    }

    if(ControlState == GamePublic.e_ControlState.MouseRightNoMove && GamePublic.g_UserPicklObj.Type == GamePublic.e_UserControlType.BuildPlace){
        GamePublic.g_Active_Map.MapTiledColorShow(false,null);
        GamePublic.g_UserPicklObj.Type = GamePublic.e_UserControlType.Non;
    }   

    GamePublic.g_MouseMoveFlag = false;
    GamePublic.g_MouseRightFlag = false;
    //GamePublic.g_MoveSelectStartPos = null;
    //GamePublic.g_MoveSelectEndPos = null;
}

C_GameControl.ControlMouseMoveCall = function (_pos) {
    //console.log(_pos.x,_pos.y);
    //var pos = GamePublic.s_Vec2d(0, 0);
    //let camera = cc.find('New Camera').getComponent(cc.Camera);
    //GamePublic.g_MainCamera.getComponent(cc.Camera).getCameraToWorldPoint(_pos,pos); //converToWorldSpaceAR
    //camera.getCameraToWorldPoint(_pos,pos);

    //camera.getWorldToCameraPoint(_pos, pos);
    //console.log(pos);
    if (GamePublic.g_TipPage.SetShow)GamePublic.g_TipPage.SetShow(false);
    if (GamePublic.g_Cursor) GamePublic.g_Cursor.SetPos(_pos);
    if (GamePublic.g_TipPage) GamePublic.g_TipPage.SetPos(_pos);
    // if(Math.abs(GamePublic.g_MouseMoveLastPos.x - _pos.x) < 1 || Math.abs(GamePublic.g_MouseMoveLastPos.y - _pos.y) < 1){
    //     return false;
    // }
    if(GamePublic.g_MouseMoveLastPos.x == _pos.x && GamePublic.g_MouseMoveLastPos.y == _pos.y){
        return false;
    }
    if (GamePublic.g_GameMenuManager.MenuNumber) {
        GamePublic.g_GameMenuManager.MenuButtonCheck(_pos, GamePublic.e_ClickType.Move);
    } else if (GamePublic.g_GamePageManager.PageNumber) {
        GamePublic.g_GamePageManager.PageButtonCheck(_pos, GamePublic.e_ClickType.Move);
    } else if (GamePublic.g_MouseLeftFlag) { //鼠标按下状态
        var mappos = C_GameControl.MapTiledRayCheck(_pos, GamePublic.g_Active_Map); //检测点击的地图块
        if (mappos.x >= 0 && mappos.y >= 0 && mappos.x < GamePublic.g_Active_Map.v_MapSize.x && mappos.y < GamePublic.g_Active_Map.v_MapSize.y) {
            if (!GamePublic.g_MoveSelectStartPos) {
                GamePublic.g_MoveSelectStartPos = GamePublic.s_Vec2d(mappos.x, mappos.y);
                GamePublic.g_MoveSelectEndPos = GamePublic.s_Vec2d(mappos.x, mappos.y);
            } else //if (GamePublic.g_MoveSelectStartPos.x != mappos.x || GamePublic.g_MoveSelectStartPos.y != mappos.y) {
              {  
                GamePublic.g_MoveSelectEndPos = GamePublic.s_Vec2d(mappos.x, mappos.y);
                var RightTop = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x > GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y > GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                var LeftDown = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x < GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y < GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                for (var i = 0; i < GamePublic.g_Active_Map.v_MapSize.x; i++) {
                    for (var j = 0; j < GamePublic.g_Active_Map.v_MapSize.y; j++) {
                        if (i >= LeftDown.x && i <= RightTop.x && j >= LeftDown.y && j <= RightTop.y) {
                            GamePublic.g_Active_Map.MapRoomArray[i][j].SetSelectFlag(true,cc.color(255, 255, 0, 95));
                        } else {
                            GamePublic.g_Active_Map.MapRoomArray[i][j].SetSelectFlag(false);
                        }
                    }
                }
            }
        }
    }else if(GamePublic.g_UserPicklObj.Type == GamePublic.e_UserControlType.BuildPlace){//建筑物建造 地形检测
        GamePublic.g_Active_Map.MapTiledColorShow(false,null);
        if(this.MapTiledCoverCheck(_pos,GamePublic.g_Active_Map,GamePublic.g_UserPicklObj.Size)){          
            GamePublic.g_Active_Map.MapTiledColorShow(true,cc.color(0,255, 0, 95));
        }else{
            GamePublic.g_Active_Map.MapTiledColorShow(true,cc.color(255, 0, 0, 95));
        }
    }
    if(!GamePublic.g_GameMenuManager.MenuNumber && !GamePublic.g_GamePageManager.PageNumber) {
        //if (GamePublic.g_MouseMoveLastPos.x == _pos.x && GamePublic.g_MouseMoveLastPos.y == _pos.y) return;
        GamePublic.g_MouseMoveLastPos.x = _pos.x;
        GamePublic.g_MouseMoveLastPos.y = _pos.y;
        
        if (GamePublic.g_MouseRightFlag && _pos.x >= 0 && _pos.x <= GamePublic.g_winSize.width && _pos.y >= 0 && _pos.y <= GamePublic.g_winSize.height) {
            GamePublic.g_MoveOff.x += (_pos.x - GamePublic.g_MoveOffLast.x) * 0.5;
            GamePublic.g_MoveOff.y += (_pos.y - GamePublic.g_MoveOffLast.y) * 0.5;
            GamePublic.g_MoveOffLast = GamePublic.s_Vec2d(_pos.x, _pos.y);
            //console.log(GamePublic.g_MoveOff);
            //return;
        } else {
            GamePublic.g_MouseRightFlag = 0; //移出屏幕 失去焦点
        }
        if (GamePublic.g_MouseLeftFlag) {
            //GamePublic.g_MoveEndPos = GamePublic.s_Vec2d(_pos.x, _pos.y);
        }
        GamePublic.g_MoveEndPos = GamePublic.s_Vec2d(_pos.x, _pos.y);
    }
    
    GamePublic.g_MouseMoveFlag = true;
    GamePublic.g_MouseStopTick = 0;
    //console.log(_pos);
}

module.exports = C_GameControl;