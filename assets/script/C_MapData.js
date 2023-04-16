var C_MapTile = require("./C_MapTile");
var GamePublic = require("./F_GamePublic");
//var g_MathLib = require("./script/C_MathLib");
//var g_Random = g_MathLib.Random;
 var C_MapData = {
    New: function (_MapSize,_MapNumber,_MapSeccn) {
        var node = {};
        node.MapNo= 1, //迷宫集编号
        node.MapRoomArray= [],
        node.v_MapShowNode = new cc.Node(),
        node.v_MapSize = _MapSize,
        node.v_MapNumber = _MapNumber,
        node.v_MapSeccn = _MapSeccn;
        node.v_MapSeccn.addChild(node.v_MapShowNode);
        node.v_MapTiledSize = {x : 64,y : 64};
        node.v_MapTabArray = [];
        
        for(var i=0;i<node.v_MapSize.x;i++){
            var MapArray = [];
            for(var j=0;j<node.v_MapSize.y;j++){
                //var maptile = C_MapTile.New("MapTiledSprite003",node,GamePublic.s_Vec2d(i,j));
                var maptile = C_MapTile.New("1101",node,GamePublic.s_Vec2d(i,j));
                if(GamePublic.g_GameRandom.GetRandom() > 90){
                    //maptile.AddTileRes(GamePublic.e_ObjType.MapTileResTree1);
                }
                MapArray[j] = maptile;
            }
            node.MapRoomArray[i]=MapArray;
        }
        node.MapTiledColorShow = function(_bool,_color){
            if(_bool){
                for(var i in node.v_MapTabArray){
                    node.MapRoomArray[node.v_MapTabArray[i].x][node.v_MapTabArray[i].y].SetSelectFlag(true,_color);
                }
            }else{
                for(var i in node.v_MapTabArray){
                    node.MapRoomArray[node.v_MapTabArray[i].x][node.v_MapTabArray[i].y].SetSelectFlag(false,null);
                }
            }
        }
        node.GetNumber = function(){
            return node.v_MapNumber;
        }
        //var qu = cc.quat(0,0,0).fromEuler({x:100,y:110,z:0});
        return node;
    } 
}

module.exports = C_MapData;