var C_GameDataResManager = {
    New: function() {
        var GameDataRes = {};
        GameDataRes.MapArray = [];
        GameDataRes.RoleArray = [];
        GameDataRes.BuildArray = [];
        GameDataRes.AddMap = function(_obj) {
            GameDataRes.MapArray.push(_obj);
        }
        GameDataRes.AddRole = function(_obj) {
            GameDataRes.RoleArray.push(_obj);
        }
        GameDataRes.AddBuild = function(_obj) {
            GameDataRes.BuildArray.push(_obj);
        }

        GameDataRes.GetMap = function(_num) {
            for (var i = 0; i < GameDataRes.MapArray.length; i++) {
                /* if (GameDataRes.MapArray[i].v_MapNumber == _num) {
                    return GameDataRes.MapArray[i];
                } */
                if (GameDataRes.MapArray[i].obj.GetNumber() == _num) {
                    return GameDataRes.MapArray[i].obj;
                }
            }
            console.log("MapArry中查找失败");
            return null;
        }

        GameDataRes.GetRole = function(_num) {
            for (var i = 0; i < GameDataRes.RoleArray.length; i++) {
                if (GameDataRes.RoleArray[i].obj.GetNumber() == _num) {
                    return GameDataRes.RoleArray[i].obj;
                }
            }
            console.log("RoleArry中查找失败");
            return null;
        }

        GameDataRes.GetBuild = function(_num) {
            for (var i = 0; i < GameDataRes.BuildArray.length; i++) {
                if (GameDataRes.BuildArray[i].obj.GetNumber() == _num) {
                    return GameDataRes.BuildArray[i].obj;
                }
            }
            console.log("BuildArray中查找失败");
            return null;
        }

        // GameDataRes.CheckSelect = function(_MapArry, _RoleArry, _Pos) {
        //     /* for(var i=0;i<_RoleArry.length;i++){
        //         if(_RoleArry[i].obj.Info.v_RoleMapPos.x == _Pos.x && _RoleArry[i].obj.Info.v_RoleMapPos.y == _Pos.y){
        //             return {ObjType:"Role",Obj : _RoleArry[i].obj};
        //         }
        //     } */

        //     if (_Pos.x < _MapArry.v_MapSize.x && _Pos.y < _MapArry.v_MapSize.y) {
        //         if (_MapArry.MapRoomArray[_Pos.x][_Pos.y].v_ExistRoleArray.length) {
        //             return { ObjType: "Role", Obj: this.GetRole(_MapArry.MapRoomArray[_Pos.x][_Pos.y].v_ExistRoleArray[0]) };
        //         }
        //         return { ObjType: "Map", Obj: _MapArry.MapRoomArray[_Pos.x][_Pos.y] };
        //     }
        //     return { ObjType: "non" };
        // }
        return GameDataRes;
    }
}

module.exports = C_GameDataResManager;