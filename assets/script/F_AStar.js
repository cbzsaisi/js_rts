var GamePublic = require("./F_GamePublic");

function C_MathLibStar() {
};

C_MathLibStar.TargePosPassTest = function (_RolePassStatu, _MapTile) { //检测是否可以通行
    var vpass = false;
    switch (_MapTile.v_TileType) {
        case GamePublic.e_ObjType.MapTileLand:
            //if(_RolePassStatu == "land")vpass = true;
            for (var i = 0; i < GamePublic.s_MapTilePassLand.length; i++) {
                if (_RolePassStatu == GamePublic.s_MapTilePassLand[i]) vpass = true;
            }
            break;
    }
     for(var i=0;i < _MapTile.v_TileResArray.length;i++){
        if(_MapTile.v_TileResArray[i].v_MapPassStatus == GamePublic.e_RolePassStatu.nopass)vpass=false;
    }
    if (_MapTile.v_ExistRoleArray.length || _MapTile.v_ExistBuildArray.length){
        vpass = false;
        //console.log("目标点 无法进入 有ROLE BUILD");
    } 
    return vpass;
}

C_MathLibStar.RoleTargePosPassTest = function (_RolePassStatu, _MapTile) {
    var vpass = GamePublic.e_ActionScriptFailType.undefined;
    switch (_MapTile.v_TileType) {
        case GamePublic.e_ObjType.MapTileLand:
            //if(_RolePassStatu == GamePublic.e_RolePassStatu.land)vpass = true;
            for (var i = 0; i < GamePublic.s_MapTilePassLand.length; i++) { //检测允许通过的类型
                if (_RolePassStatu == GamePublic.s_MapTilePassLand[i]) vpass = GamePublic.e_ActionScriptFailType.Success;
            }
            break;
    }
    for (var i = 0; i < _MapTile.v_TileResArray.length; i++) {
        if (_MapTile.v_TileResArray[i].v_MapPassStatus == GamePublic.e_RolePassStatu.nopass){
            vpass = GamePublic.e_ActionScriptFailType.MapBlock;
            console.log("e_ActionScriptFailType.MapBlock");
        } 
    }
    if (_MapTile.v_ExistRoleArray.length){
        vpass = GamePublic.e_ActionScriptFailType.RoleBlock;
        console.log("e_ActionScriptFailType.RoleBlock");
    }
    if (_MapTile.v_ExistBuildArray.length){
        vpass = GamePublic.e_ActionScriptFailType.BuildBlock;
        console.log("e_ActionScriptFailType.BuildBlock");
    }
    return vpass;
} 

/*  C_MathLibStar.StartTargePosPassTest = function (_RolePassStatu, _MapTile) {  //首次寻路
    var vpass = false;
    //if(e_RolePassStatu.nopass == _MapTile.v_MapPassStatus)return false;
    //if(_RolePassStatu != _MapTile.v_MapPassStatus)return false;
    switch (_MapTile.v_TileType) {
        case GamePublic.e_ObjType.MapTileLand:
            //if(_RolePassStatu == "land")vpass = true;
            for (var i = 0; i < GamePublic.s_MapTilePassLand.length; i++) {
                if (_RolePassStatu == GamePublic.s_MapTilePassLand[i]) vpass = true;
            }
            break;
    }
     for(var i=0;i < _MapTile.v_TileResArray.length;i++){
        if(_MapTile.v_TileResArray[i].v_MapPassStatus == GamePublic.e_RolePassStatu.nopass)vpass=false;
    } 
    if (_MapTile.v_ExistRoleArray.length) vpass = false;
    return vpass;
}  */


C_MathLibStar.CompWayPos = function(_OpenList,_CloseList,_CutPos)
{
    for(var i=0;i<_CloseList.length;i++){
        var WayPos = _CloseList[i];
        if(WayPos.oPos.x == _CutPos.oPos.x && WayPos.oPos.y == _CutPos.oPos.y){
            return true;
        }
    }
    for(var i=0;i<_OpenList.length;i++){
        var WayPos = _OpenList[i];
        if(WayPos.oPos.x == _CutPos.oPos.x && WayPos.oPos.y == _CutPos.oPos.y){
            if(_CutPos.Gval < WayPos.Gval){
                WayPos.Gval = _CutPos.Gval;
                WayPos.FatherWayPoint = _CutPos.FatherWayPoint; 
            }
            return true;
        }
    }
    return false;
}


C_MathLibStar.AddWayPoint = function(_Map,_sWayPos,_dPos,_OpenList,_CloseList,_RolePassStatu){
    var left=false,right=false,up=false,down=false;
    if(_sWayPos.oPos.x >0){
        //console.log("左边");
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x-1,_sWayPos.oPos.y);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            left = true;
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            for(var i=0;i < _dPos.w;i++){
                for(var j=0;i < _dPos.h;i++){
                    if(WayPos.oPos.x == _dPos.x + _dPos.w && WayPos.oPos.y == _dPos.y + _dPos.h) //如果是目标点 添加到开放列表最后  返回真
                    {
                        _OpenList.push(WayPos);
                        //console.log("找到目标点");
                        return true;
                    }
                }
            }
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
    }

    if(_sWayPos.oPos.x < _Map.v_MapSize.x-1){
        //console.log("右边");//
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x+1,_sWayPos.oPos.y);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            right = true;
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
    }

    if(_sWayPos.oPos.y > 0){
        //console.log("下边");//
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x,_sWayPos.oPos.y-1);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            down = true;
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
    }

    if(_sWayPos.oPos.y < _Map.v_MapSize.y-1){
        //console.log("上边");//
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x,_sWayPos.oPos.y+1);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            up = true;
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
    }

    if(left && up){
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x-1,_sWayPos.oPos.y+1);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
    }
    if(right && up){
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x+1,_sWayPos.oPos.y+1);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
    }
    if(left && down){
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x-1,_sWayPos.oPos.y-1);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
        
    }
    if(right && down){
        var tpos = GamePublic.s_Vec2d(_sWayPos.oPos.x+1,_sWayPos.oPos.y-1);
        var MapTile = _Map.MapRoomArray[tpos.x][tpos.y];
        if(C_MathLibStar.TargePosPassTest(_RolePassStatu,MapTile)){
            var WayPos = GamePublic.s_WayPoint(tpos,_dPos,_sWayPos,GamePublic.e_WayPointType.Type1);
            if(WayPos.oPos.x == _dPos.x && WayPos.oPos.y == _dPos.y) //如果是目标点 添加到开放列表最后  返回真
            {
                _OpenList.push(WayPos);
                //console.log("找到目标点");
                return true;
            }
            if(C_MathLibStar.CompWayPos(_OpenList,_CloseList,WayPos)){
            }else{
                _OpenList.push(WayPos);
            }
        }
    }
    return false;
}


C_MathLibStar.MapTilePassTest = function(_RStar){
    var oPos = _RStar.OMapPos;
    var dPos = _RStar.DMapPos;
    var RolePassStatu = _RStar.RolePassStatu;
    if(oPos.x == dPos.x && oPos.y == dPos.y){console.log("原地点击");return false;} //目标等于自己
    if(dPos.x <0 || dPos.y <0 ||dPos.x >= (_RStar.CurrentMap.v_MapSize.x) || dPos.y >= (_RStar.CurrentMap.v_MapSize.y))return false;//超出范围
    return true;
}
C_MathLibStar.RunRoleStar = function(_RStar){
    var oPos = _RStar.OMapPos;
    var dPos = _RStar.DMapPos;
    var CurrentMap = _RStar.CurrentMap
    var RolePassStatu = _RStar.RolePassStatu;    
    if(!C_MathLibStar.MapTilePassTest(_RStar)){console.log("目标不能进入");return false;}
    
    var MapTile = CurrentMap.MapRoomArray[dPos.x][dPos.y];
     if(!C_MathLibStar.TargePosPassTest(RolePassStatu,MapTile)){
        console.log("目标无可行路径")
        return false};//目标点不能进入 
    //console.log("可以进入");
    var CLoseList = [];
    var OpenList = [];
    var sWayPos = GamePublic.s_WayPoint(oPos,dPos,null,GamePublic.e_WayPointType.Type1);
    var bPass = false;
    var test = 0;
    var whilenum = 1000;
    while(whilenum--){
        test++;
        if(C_MathLibStar.AddWayPoint(CurrentMap,sWayPos,dPos,OpenList,CLoseList,RolePassStatu)){
            //cc.log("找到节点 跳出循环");
            sWayPos = OpenList.pop();
            bPass = true;
            break;
        }
        CLoseList.push(sWayPos);
        for(var i=0;i<OpenList.length;i++){
            if(sWayPos.oPos.x == OpenList[i].oPos.x && sWayPos.oPos.y == OpenList[i].oPos.y){
                var obj = OpenList.splice(i,1);
                obj = null;
            }
        }
        if(OpenList.length == 0){
            console.log("Open空了");
            break; //如果空了退出
        }

        var gFval = 0;
        for(var i=OpenList.length;i>0;i--){
                var waypos = OpenList[i-1];
                if(gFval == 0){
                    gFval = waypos.Fval;
                    sWayPos = waypos;
                }else if(waypos.Fval < gFval){
                    gFval = waypos.Fval;
                    sWayPos = waypos;
                }
        }

        if(whilenum == 0 && CLoseList.length){
            var gFval2 = 0;

            for(var i=CLoseList.length;i>0;i--){
                var waypos = CLoseList[i-1];
                if(gFval2 == 0){
                    gFval2 = waypos.Fval;
                    sWayPos = waypos;
                }else if(waypos.Fval != 0 && waypos.Fval < gFval2){
                    gFval2 = waypos.Fval;
                    sWayPos = waypos;
                }
            }
            if(gFval2 != 0){
                console.log("移动到距离最近一点");
                _RStar.DMapPos.x = sWayPos.oPos.x;
                _RStar.DMapPos.y = sWayPos.oPos.y;
                break;
            }
        }
    }
    //console.log("寻路 循环:"+ test + "次");
    CLoseList.splice(0,CLoseList.length);
    OpenList.splice(0,OpenList.length);
    if(bPass){
        //console.log("最终找到");
        do
        {
            //cc.log(sWayPos.oPos);
            _RStar.MapArray.push(sWayPos);
            sWayPos = sWayPos.FatherWayPoint;
        }
        while(sWayPos.FatherWayPoint != null)
        return true;
    }else{
        cc.log("最终没找到");
        return false;
    }
}

C_MathLibStar.RoleFindWay = function(_role,_d_Pos) {
    var MapArray = [];
    var RStar = GamePublic.s_RoleStar(_role.GameInfo.v_CurrentMap,_role.Info.v_MapPos,_d_Pos,MapArray,_role.Info.v_Number,_role.Info.v_RolePassStatu);
    if(C_MathLibStar.RunRoleStar(RStar)){
        _role.Command.v_ActionCommandArray.splice(0,_role.Command.v_ActionCommandArray.length);
        /*_role.Info.v_ActionMovePos = _d_Pos;
        //console.log("寻路结束 命令下达");
        //console.log(_role.v_Number);*/
        for(var i=0;i<MapArray.length;i++){ //把路径放到命令菜单里
            var WayPos = MapArray[i];
            //console.log(WayPos.oPos);
            //var src = new s_NodeScript("RoleAction","RoleMove",_role.v_Number,'',WayPos.oPos);
            //_role.v_NodeActionCommandArray.push(src);

            var src = new GamePublic.s_RoleScript({Info:1,Name:GamePublic.e_CommandBaseType.RoleMove},{Num:_role.Info.v_Number,Array:"22",Pos:123},{Num:0,Array:"22",Pos:WayPos.oPos});
            _role.Command.v_ActionCommandArray.push(src);
        } 
        return true;
    }else{
        console.log("寻路失败");
        return false;
    }
    //MapArray.splice(0,MapArray.length);
}

C_MathLibStar.RoleFindWay2 = function(_role,d_Pos) {
    var MapArray = [];
    let map = _role.GameInfo.v_CurrentMap.MapRoomArray;
    var ExistRoleArray = map[d_Pos.x][d_Pos.y].v_ExistRoleArray;
    var ExistBuildArray = map[d_Pos.x][d_Pos.y].v_ExistBuildArray;
    map[d_Pos.x][d_Pos.y].v_ExistRoleArray = []; //暂时把目标点清空
    map[d_Pos.x][d_Pos.y].v_ExistBuildArray = []; //暂时把目标点清空
    var RStar = GamePublic.s_RoleStar(_role.GameInfo.v_CurrentMap,_role.Info.v_MapPos,d_Pos,MapArray,_role.Info.v_Number,_role.Info.v_RolePassStatu);
    if(C_MathLibStar.RunRoleStar(RStar)){
        map[d_Pos.x][d_Pos.y].v_ExistRoleArray = ExistRoleArray;
        map[d_Pos.x][d_Pos.y].v_ExistBuildArray = ExistBuildArray;
        _role.Command.v_ActionCommandArray.splice(0,_role.Command.v_ActionCommandArray.length);
        /*_role.Info.v_ActionMovePos = _d_Pos;
        //console.log("寻路结束 命令下达");
        //console.log(_role.v_Number);*/
        for(var i=0;i<MapArray.length;i++){ //把路径放到命令菜单里
            var WayPos = MapArray[i];
            //console.log(WayPos.oPos);
            //var src = new s_NodeScript("RoleAction","RoleMove",_role.v_Number,'',WayPos.oPos);
            //_role.v_NodeActionCommandArray.push(src);

            var src = new GamePublic.s_RoleScript({Info:1,Name:GamePublic.e_CommandBaseType.RoleMove},{Num:_role.Info.v_Number,Array:"22",Pos:123},{Num:0,Array:"22",Pos:WayPos.oPos});
            _role.Command.v_ActionCommandArray.push(src);
        } 
        return true;
    }else{
        map[d_Pos.x][d_Pos.y].v_ExistRoleArray = ExistRoleArray;
        map[d_Pos.x][d_Pos.y].v_ExistBuildrray = ExistBuildArray;
        console.log("寻路失败");
        return false;
    }
    //MapArray.splice(0,MapArray.length);
}

C_MathLibStar.RunRoleStar2 = function(_RStar){
    var oPos = _RStar.OMapPos;
    var dPos = _RStar.DMapPos;
    var CurrentMap = _RStar.CurrentMap
    var RolePassStatu = _RStar.RolePassStatu;    
    if(!C_MathLibStar.MapTilePassTest(_RStar)){console.log("目标不能进入");return false;}
    var CLoseList = [];
    var OpenList = [];
    var sWayPos = GamePublic.s_WayPoint(oPos,dPos,null,GamePublic.e_WayPointType.Type1);
    var bPass = false;
    var test = 0;
    var whilenum = 1000;
    while(whilenum--){
        test++;
        if(C_MathLibStar.AddWayPoint(CurrentMap,sWayPos,dPos,OpenList,CLoseList,RolePassStatu)){
            //console.log("找到节点 跳出循环");
            sWayPos = OpenList.pop();
            bPass = true;
            break;
        }
        CLoseList.push(sWayPos);
        for(var i=0;i<OpenList.length;i++){
            if(sWayPos.oPos.x == OpenList[i].oPos.x && sWayPos.oPos.y == OpenList[i].oPos.y){
                var obj = OpenList.splice(i,1);
                obj = null;
            }
        }
        if(OpenList.length == 0){
            //console.log("Open空了");
            break; //如果空了退出
        }

        var gFval = 0;
        for(var i=OpenList.length;i>0;i--){
                var waypos = OpenList[i-1];
                if(gFval == 0){
                    gFval = waypos.Fval;
                    sWayPos = waypos;
                }else if(waypos.Fval < gFval){
                    gFval = waypos.Fval;
                    sWayPos = waypos;
                }
        }

        if(whilenum == 0 && CLoseList.length){
            var gFval2 = 0;

            for(var i=CLoseList.length;i>0;i--){
                var waypos = CLoseList[i-1];
                if(gFval2 == 0){
                    gFval2 = waypos.Fval;
                    sWayPos = waypos;
                }else if(waypos.Fval != 0 && waypos.Fval < gFval2){
                    gFval2 = waypos.Fval;
                    sWayPos = waypos;
                }
            }
            if(gFval2 != 0){
                console.log("移动到距离最近一点");
                _RStar.DMapPos.x = sWayPos.oPos.x;
                _RStar.DMapPos.y = sWayPos.oPos.y;
                break;
            }
        }
    }
    CLoseList.splice(0,CLoseList.length);
    OpenList.splice(0,OpenList.length);
    if(bPass){
        //console.log("最终找到");
        do
        {
            _RStar.MapArray.push(sWayPos);
            sWayPos = sWayPos.FatherWayPoint;
        }
        while(sWayPos.FatherWayPoint != null)
        return true;
    }else{
        //cc.log("最终没找到");
        return false;
    }
}

C_MathLibStar.FindWayCheck = function(s_role,d_Pos) {
    var MapArray = [];
    var RStar = GamePublic.s_RoleStar(s_role.GameInfo.v_CurrentMap,s_role.Info.v_MapPos,d_Pos,MapArray,s_role.Info.v_Number,s_role.Info.v_RolePassStatu);
    C_MathLibStar.RunRoleStar2(RStar);
    return {SortNum:MapArray.length,Obj:d_Pos};
}
module.exports = C_MathLibStar;