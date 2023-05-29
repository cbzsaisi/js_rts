var GamePublic = require("./F_GamePublic");
var BuildingClass = require("./C_Building");
var RoleSrcipt = require("./F_RoleSrcipt");
function C_GameControl() {
};

C_GameControl.RoleRayCheck = function (_pos,_RoleNum) {
    let ray = GamePublic.g_MainCamera.getComponent(cc.Camera).getRay(_pos);
    var role = GamePublic.g_GameDataResManger.GetRole(_RoleNum);
    return cc.geomUtils.intersect.raycast(role.GameInfo.v_RoleSprite.v_Sprite, ray).length;
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
    //var pos = this.MapTiledRayCheck(_pos, _Map);
    var pos = this.GetMapXY(_pos, _Map);
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

C_GameControl.GetMapXY = function(_pos){
    //console.log(_pos.x - GamePublic.g_MoveOff.x,_pos.y - GamePublic.g_MoveOff.y);
    var map = GamePublic.g_Active_Map.v_MapTiledSize;
    var pos = GamePublic.s_Vec2d((_pos.x - GamePublic.g_MoveOff.x + map.x * 1) / (map.x * GamePublic.g_SceenScale),
    (_pos.y - GamePublic.g_MoveOff.y + map.y * 0.6) / (map.y * GamePublic.g_SceenScale));
    //console.log(pos.x,pos.y);
    pos.x = Math.floor(pos.x);
    pos.y = Math.floor(pos.y);
    //console.log(pos.x,pos.y);
    return pos;
}

C_GameControl.CancelSelectRole = function(){
    if (GamePublic.g_SelectRoleArray.length) { //取消框选
        for (var i = 0; i < GamePublic.g_SelectRoleArray.length; i++) {
            GamePublic.g_GameDataResManger.GetRole(GamePublic.g_SelectRoleArray[i]).GameInfo.v_RoleSelectFlag = false;
        }
        GamePublic.g_SelectRoleArray.splice(0, GamePublic.g_SelectRoleArray.length);
        GamePublic.g_SelectStaus = GamePublic.e_SelectStaus.NonSelect;
    }
}

C_GameControl.ControlMouseLeftDownCall = function (_pos) {
    if (GamePublic.g_MouseRightFlag) return; //如果鼠标右键未放开 退出
    GamePublic.g_MouseLeftFlag ? GamePublic.g_MouseLeftFlag = false : GamePublic.g_MouseLeftFlag = true;
    GamePublic.g_LeftKeyStartPos = GamePublic.s_Vec2d(_pos.x, _pos.y); //鼠标左键开始坐标
    GamePublic.g_MoveStartPos = GamePublic.s_Vec2d(_pos.x, _pos.y); //指针开始坐标
    if (GamePublic.g_GamePageManager.PageNumber) {
        GamePublic.g_GamePageManager.PageButtonCheck(_pos, GamePublic.e_ClickType.LeftDown);
    }
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

// C_GameControl.ControlMouseLeftUpCall2 = function (_pos) {
//     let ray = cc.Camera.main.getRay(_pos);
//     let results = cc.geomUtils.intersect.raycast(GamePublic.g_GameMain.node, ray);
// }

C_GameControl.ControlMouseMiddleUpCall = function (_pos) {

}

C_GameControl.ControlMouseLeftUpCall = function (_pos) {
    var mappos = C_GameControl.GetMapXY(_pos);
    //var ControlState = GamePublic.e_ControlState.Non;
    GamePublic.g_ButtonUsingFlag = false;//检测UI点击

    if(GamePublic.g_UserPicklObj.Type == GamePublic.e_UserControlType.BuildPlace){ //当前状态是建筑检测 关闭检测
        GamePublic.g_PlayerClickType = GamePublic.e_PlayerClickType.BuildClick;
        if(this.MapTiledCoverCheck(_pos,GamePublic.g_Active_Map,GamePublic.g_UserPicklObj.Size)){          
            //GamePublic.g_Active_Map.MapTiledColorShow(true,cc.color(0,255, 0, 95));
            var build = new BuildingClass.New("build1", 1, GamePublic.s_Vec2d(mappos.x, mappos.y), 1);
            GamePublic.g_ButtonUsingFlag = true;
        }else{
            
        }
        GamePublic.g_Active_Map.MapTiledColorShow(false,null);
        GamePublic.g_UserPicklObj.Type = GamePublic.e_UserControlType.Non;
    }   
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
    if(GamePublic.g_GameRunUi && GamePublic.g_GameRunUi.ClickCheck(_pos,GamePublic.e_ClickType.LeftUp)){
        GamePublic.g_ButtonUsingFlag = true;
    }

    if (GamePublic.g_GamePageManager.PageNumber == 0 && GamePublic.g_GameMenuManager.MenuNumber == 0 && GamePublic.g_ButtonUsingFlag == false){ //左键按下后移动   选择角色
        
        switch (GamePublic.g_SelectStaus){
            case GamePublic.e_SelectStaus.NonSelect:{
                if(GamePublic.g_MoveSelectStartPos){
                    var RightTop = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x > GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y > GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                    var LeftDown = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x < GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y < GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                    for (var i = 0; LeftDown.x + i <= RightTop.x; i++) {
                        for (var j = 0; LeftDown.y + j <= RightTop.y; j++) {
                            var MapTileRoleArray = GamePublic.g_Active_Map.MapRoomArray[LeftDown.x + i][LeftDown.y + j].v_ExistRoleArray;
                            for (var k = 0; k < MapTileRoleArray.length; k++) {
                                GamePublic.g_SelectRoleArray.push(MapTileRoleArray[k]);
                                GamePublic.g_GameDataResManger.GetRole(MapTileRoleArray[k]).GameInfo.v_RoleSelectFlag = true;
                                //SelectFlag = true; //已有选中
                            }
                            GamePublic.g_Active_Map.MapRoomArray[LeftDown.x + i][LeftDown.y + j].SetSelectFlag(false);
                        }
                    }
                    if (GamePublic.g_SelectRoleArray.length) GamePublic.g_SelectStaus = GamePublic.e_SelectStaus.MultiRole;
                }
                break;
            }
            case GamePublic.e_SelectStaus.MultiRole:{
                if(GamePublic.g_MouseMoveFlag){//拉过框 取消框选
                    GamePublic.g_PlayerClickType = GamePublic.e_PlayerClickType.RoleSelectClick;
                }else if (mappos.x >= 0 && mappos.y >= 0 && mappos.x < GamePublic.e_MapSizeType1.width && mappos.y < GamePublic.e_MapSizeType1.height){
                    GamePublic.g_PlayerClickType = GamePublic.e_PlayerClickType.RoleTarget;
                }

                switch(GamePublic.g_PlayerClickType){
                    case GamePublic.e_PlayerClickType.BuildClick:{
                        break;
                    }
                    case GamePublic.e_PlayerClickType.RoleSelectClick:{
                        if (GamePublic.g_SelectRoleArray.length) {  //取消框选
                            for (var i = 0; i < GamePublic.g_SelectRoleArray.length; i++) {
                                GamePublic.g_GameDataResManger.GetRole(GamePublic.g_SelectRoleArray[i]).GameInfo.v_RoleSelectFlag = false;
                            }
                            GamePublic.g_SelectRoleArray.splice(0, GamePublic.g_SelectRoleArray.length);
                            GamePublic.g_SelectStaus = GamePublic.e_SelectStaus.NonSelect;
                        }
                        if(GamePublic.g_MoveSelectStartPos){
                            var RightTop = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x > GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y > GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                            var LeftDown = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x < GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y < GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                            for (var i = 0; LeftDown.x + i <= RightTop.x; i++) {
                                for (var j = 0; LeftDown.y + j <= RightTop.y; j++) {
                                    var MapTileRoleArray = GamePublic.g_Active_Map.MapRoomArray[LeftDown.x + i][LeftDown.y + j].v_ExistRoleArray;
                                    for (var k = 0; k < MapTileRoleArray.length; k++) {
                                        GamePublic.g_SelectRoleArray.push(MapTileRoleArray[k]);
                                        GamePublic.g_GameDataResManger.GetRole(MapTileRoleArray[k]).GameInfo.v_RoleSelectFlag = true;
                                        //SelectFlag = true; //已有选中
                                    }
                                    GamePublic.g_Active_Map.MapRoomArray[LeftDown.x + i][LeftDown.y + j].SetSelectFlag(false);
                                }
                            }
                        }
                        if (GamePublic.g_SelectRoleArray.length) GamePublic.g_SelectStaus = GamePublic.e_SelectStaus.MultiRole;
                        break;
                    }
                    case GamePublic.e_PlayerClickType.RoleTarget:{
                        for (var i = 0; i < GamePublic.g_SelectRoleArray.length; i++) {
                            var role = GamePublic.g_GameDataResManger.GetRole(GamePublic.g_SelectRoleArray[i]);
                            if (role.Command.v_RoleActionCommandArray1.length) {                    
                                role.Command.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.End;
                            } else {
                                role.Command.v_RoleActionCommandState1 = GamePublic.e_ActionCommandState.New;
                            }
                            if (GamePublic.g_Active_Map.MapRoomArray[mappos.x][mappos.y].v_ExistRoleArray.length) { //如果目标点有单位
                                let t_role = GamePublic.g_GameDataResManger.GetRole(GamePublic.g_Active_Map.MapRoomArray[mappos.x][mappos.y].v_ExistRoleArray[0]);
                                var csrc = new GamePublic.s_RoleScript({ Info:1, Name:GamePublic.e_RoleTargetCheck.RoleAttack}, { Num: role.Info.v_RoleNumber, Array: [], Pos: 123 }, { Num: t_role.Info.v_RoleNumber, Array: [], Pos: 123 });
                                var res = RoleSrcipt.RoleTargetCheck(csrc);
                                switch(res){
                                    case GamePublic.e_RoleTargetCheckResult.Success:{
                                        var src = new GamePublic.s_RoleScript({ Info:1, Name:GamePublic.e_CommandType.RoleAttack}, { Num: role.Info.v_RoleNumber, Array: "222", Pos: 123 }, { Num: t_role.Info.v_RoleNumber, Array: [t_role.Info.v_RoleNumber], Pos: mappos });
                                        role.Command.v_RoleActionCommandArray1.push(src);
                                        break;
                                    }
                                    case GamePublic.e_RoleTargetCheckResult.Is_Self:{
                                        break;
                                    }
                                    case GamePublic.e_RoleTargetCheckResult.Tar_Is_Death:{
                                        break;
                                    }
                                }
                            } else { //移动
                                role.ClearRoleCommand(GamePublic.e_RoleCommandType.Command);
                                role.ClearRoleCommand(GamePublic.e_RoleCommandType.Command1);
                                var src = new GamePublic.s_RoleScript({ Info: 1, Name: GamePublic.e_CommandType.RoleGoToPos }, { Num: role.Info.v_RoleNumber, Array: "111", Pos: 123 }, { Num: 0, Array: "22", Pos: mappos });
                                role.Command.v_RoleActionCommandArray1.push(src);    
                                //GamePublic.g_Active_Map.MapRoomArray[mappos.x][mappos.y].SetSelectFlag(true);
                            }
                        }
                        break;
                    }
                }
                break;
            }
            case GamePublic.e_SelectStaus.Build:{
                break;
            }
        }
    }
    GamePublic.g_MouseMoveFlag = false;
    GamePublic.g_MouseLeftFlag = false;
    GamePublic.g_MoveSelectStartPos = null;
    GamePublic.g_MoveSelectEndPos = null;
    GamePublic.g_PlayerClickType = GamePublic.e_PlayerClickType.Non;
}

C_GameControl.ControlMouseRightUpCall = function (_pos) {
    GamePublic.g_MouseRightFlag = false;
    var ControlState = GamePublic.e_ControlState.Non;
    if (GamePublic.g_MouseMoveFlag == false) {
        ControlState = GamePublic.e_ControlState.MouseRightNoMove;
    } else {
        ControlState = GamePublic.e_ControlState.MouseRightMove;
    }
    //取消建筑寻点
    if(ControlState == GamePublic.e_ControlState.MouseRightNoMove && GamePublic.g_UserPicklObj.Type == GamePublic.e_UserControlType.BuildPlace){
        GamePublic.g_Active_Map.MapTiledColorShow(false,null);
        GamePublic.g_UserPicklObj.Type = GamePublic.e_UserControlType.Non;
    }   

    GamePublic.g_MouseMoveFlag = false;
    GamePublic.g_MouseRightFlag = false;
    GamePublic.g_PlayerClickType = GamePublic.e_PlayerClickType.Non;
    // GamePublic.g_MoveSelectStartPos = null;
    // GamePublic.g_MoveSelectEndPos = null;
}

C_GameControl.ControlMouseMoveCall = function (_pos) {
    //var pos = GamePublic.s_Vec2d(0, 0);
    //let camera = cc.find('New Camera').getComponent(cc.Camera);
    //GamePublic.g_MainCamera.getComponent(cc.Camera).getCameraToWorldPoint(_pos,pos); //converToWorldSpaceAR
    //camera.getCameraToWorldPoint(_pos,pos);

    //camera.getWorldToCameraPoint(_pos, pos);
    //console.log(pos);
    if (GamePublic.g_TipPage.SetShow)GamePublic.g_TipPage.SetShow(false);
    if (GamePublic.g_TipPage) GamePublic.g_TipPage.SetPos(_pos);
    if (GamePublic.g_Cursor) GamePublic.g_Cursor.SetPos(_pos);
    if(Math.abs(GamePublic.g_MouseMoveLastPos.x - _pos.x) < 1 || Math.abs(GamePublic.g_MouseMoveLastPos.y - _pos.y) < 1){
        return false;
    }
    if(GamePublic.g_MoveOffLast.x == _pos.x && GamePublic.g_MoveOffLast.y == _pos.y){
        return false;
    }
    if (GamePublic.g_GameMenuManager.MenuNumber) {
        GamePublic.g_GameMenuManager.MenuButtonCheck(_pos, GamePublic.e_ClickType.Move);
    } else if (GamePublic.g_GamePageManager.PageNumber) {
        GamePublic.g_GamePageManager.PageButtonCheck(_pos, GamePublic.e_ClickType.Move);
    } else if (GamePublic.g_Active_Map && GamePublic.g_MouseLeftFlag) { //鼠标按下状态
        //var mappos = C_GameControl.MapTiledRayCheck(_pos, GamePublic.g_Active_Map); //检测点击的地图块
        var mappos = C_GameControl.GetMapXY(_pos);
        if (mappos.x >= 0 && mappos.y >= 0 && mappos.x < GamePublic.g_Active_Map.v_MapSize.x && mappos.y < GamePublic.g_Active_Map.v_MapSize.y) {
            if (!GamePublic.g_MoveSelectStartPos) {
                GamePublic.g_MoveSelectStartPos = GamePublic.s_Vec2d(mappos.x, mappos.y);
                GamePublic.g_MoveSelectEndPos = GamePublic.s_Vec2d(mappos.x, mappos.y);
            } else if (GamePublic.g_MoveSelectStartPos.x != mappos.x || GamePublic.g_MoveSelectStartPos.y != mappos.y) {
              //{  
                GamePublic.g_MoveSelectEndPos = GamePublic.s_Vec2d(mappos.x, mappos.y);
                var RightTop = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x > GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y > GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                var LeftDown = GamePublic.s_Vec2d(GamePublic.g_MoveSelectStartPos.x < GamePublic.g_MoveSelectEndPos.x ? GamePublic.g_MoveSelectStartPos.x : GamePublic.g_MoveSelectEndPos.x, GamePublic.g_MoveSelectStartPos.y < GamePublic.g_MoveSelectEndPos.y ? GamePublic.g_MoveSelectStartPos.y : GamePublic.g_MoveSelectEndPos.y);
                for (var i = LeftDown.x; i <= RightTop.x; i++) {
                    for (var j = LeftDown.y; j <= RightTop.y; j++) {
                        if (i >= LeftDown.x && i <= RightTop.x && j >= LeftDown.y && j <= RightTop.y) {
                            //console.log(LeftDown);
                            //console.log(RightTop);
                            GamePublic.g_Active_Map.MapRoomArray[i][j].SetSelectFlag(true,cc.color(255, 255, 0, 155));
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
    if(GamePublic.g_GameMenuManager.MenuNumber == 0 && GamePublic.g_GamePageManager.PageNumber == 0) {
        if (GamePublic.g_MouseRightFlag && _pos.x >= 0 && _pos.x <= GamePublic.g_winSize.width && _pos.y >= 0 && _pos.y <= GamePublic.g_winSize.height) {
            GamePublic.g_MoveOff.x += (_pos.x - GamePublic.g_MoveOffLast.x) * 0.5;
            GamePublic.g_MoveOff.y += (_pos.y - GamePublic.g_MoveOffLast.y) * 0.5;
            GamePublic.g_MoveOffLast = GamePublic.s_Vec2d(_pos.x, _pos.y);
            //console.log(GamePublic.g_MoveOff);
            //return;
        } else {
            GamePublic.g_MouseRightFlag = false; //移出屏幕 失去焦点
        }
        if (GamePublic.g_MouseLeftFlag) {
            //GamePublic.g_MoveEndPos = GamePublic.s_Vec2d(_pos.x, _pos.y);
        }
        GamePublic.g_MoveEndPos = GamePublic.s_Vec2d(_pos.x, _pos.y);
    }
    if(GamePublic.g_MouseLeftFlag) {
        if(Math.abs(GamePublic.g_LeftKeyStartPos.x -_pos.x) > 3 || Math.abs(GamePublic.g_LeftKeyStartPos.y - _pos.y) > 3){
            GamePublic.g_MouseMoveFlag = true;}
        } else { GamePublic.g_MouseMoveFlag = true; }
    GamePublic.g_MouseStopTick = 0;
    //console.log(_pos);
}

module.exports = C_GameControl;