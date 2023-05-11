var GamePublic = require("./F_GamePublic");
//var MapTileSprite = require("./script/C_MapTileSprite");

var C_MapTile = {
    New: function (_TileName, _MainMap, _pos) {
        var node = {};
        node.v_TileSprite = null,
        node.v_TileType = null,
        node.v_MapPassStatus = GamePublic.e_RolePassStatu.pass,
        node.v_TileResType = null,
        node.v_TileResSprite = null,
        node.v_TileResArray = [],
        node.v_ExistRoleArray = [],
        node.v_ExistBuildArray = [],
        node.v_DtNumber = 0,
        node.v_NodeCurAction = null,
        node.v_NodeMapPos = _pos,
        node.v_SpritePos = { x: 0, y: 0 },
        node.k_SpriteSize = { x: 32, y: 32 },
        node.v_MainMap = null,
        node.v_Show = false,
        node.v_HeigthOffset = 0,
        node.v_ShowLevel = 1,
        node.v_Text = null,
        node.v_TileName = _TileName;
        node.v_MainMap = _MainMap;
        node.v_Rect = GamePublic.s_Rect(0, 0, 0, 0);
        node.v_SelectSprite = null;

        node.MoveInRole = function (_Number,v_Type) {
            switch(v_Type){
                case GamePublic.e_BaseObjType.Role:{
                    for (var i = 0; i < node.v_ExistRoleArray.length; i++) {
                        if (node.v_ExistRoleArray[i] == _Number) {
                            return false;
                        }
                    }
                    node.v_ExistRoleArray.push(_Number);
                    break;
                }
                case GamePublic.e_BaseObjType.Build:{
                    for (var i = 0; i < node.v_ExistBuildArray.length; i++) {
                        if (node.v_ExistBuildArray[i] == _Number) {
                            return false;
                        }
                    }
                    node.v_ExistBuildArray.push(_Number);
                    break;
                }
            }
            return true;
        }

        node.MoveOutRole = function (_Number,v_Type) {
            switch(v_Type){
                case GamePublic.e_BaseObjType.Role:{
                    for (var i = 0; i < node.v_ExistRoleArray.length; i++) {
                        if (node.v_ExistRoleArray[i] == _Number) {
                            node.v_ExistRoleArray.splice(i, 1);
                            return true;
                        }
                    }
                    break;
                }
                case GamePublic.e_BaseObjType.Build:{
                    for (var i = 0; i < node.v_ExistBuildArray.length; i++) {
                        if (node.v_ExistBuildArray[i] == _Number) {
                            node.v_ExistBuildArray.splice(i, 1);
                            return true;
                        }
                    }
                    break;
                }
            }
            return false;
        }

        node.AddTileRes = function (_TileResName) {
            switch (_TileResName) {
                case GamePublic.e_ObjType.MapTileResFlower1:
                    //var TileRes = C_MapTile.New("flower",this.v_MainMap,this.v_NodeMapPos);
                    //this.v_TileResArray.push(TileRes);
                    break;
                case GamePublic.e_ObjType.MapTileResTree1:
                    var TileRes = C_MapTile.New("tree101", node.v_MainMap, node.v_NodeMapPos);
                    TileRes.v_HeigthOffset = 0.4;
                    TileRes.v_ShowLevel = 5;
                    TileRes.v_MapPassStatus = GamePublic.e_RolePassStatu.nopass;
                    node.v_TileResArray.push(TileRes);
                    break;
            }
        }

        node.Load2DSpriteRes = function () {
            for (var i in GamePublic.g_resources2DMapTile) {
                if (GamePublic.g_resources2DMapTile[i].FileName == node.v_TileName) {
                    node.v_TileSprite = cc.instantiate(GamePublic.g_resources2DMapTile[i].FileData);
                    node.v_TileSprite.color = cc.color(200, 200, 200, 255);
                    //node.v_TileSprite.opacity = 100;
                    node.v_TileType = GamePublic.e_ObjType.MapTileLand;
                    node.k_SpriteSize.x = node.v_TileSprite.getBoundingBox().width;
                    node.k_SpriteSize.y = node.v_TileSprite.getBoundingBox().height;
                    node.v_MainMap.v_MapTiledSize.x = GamePublic.e_MapTilePixel.width;
                    node.v_MainMap.v_MapTiledSize.y = GamePublic.e_MapTilePixel.height;
                    node.SetSceenPos(node.v_NodeMapPos);
                    node.v_MainMap.v_MapShowNode.addChild(node.v_TileSprite, (node.v_MainMap.v_MapSize.x * node.v_MainMap.v_MapSize.y)-(node.v_NodeMapPos.x + (node.v_NodeMapPos.y+1) * node.v_MainMap.v_MapSize.x));
                    node.v_Show = true;
                    break;
                }
            }
        }

        node.UnLoadSpriteRes = function () {
            if (node.v_TileSprite) {
                node.v_TileSprite.destroy();
                //node.v_TileSprite.removeFromParent(false);
                node.v_MainMap.v_MapShowNode.removeChild(node.v_TileSprite);
                node.v_TileSprite = null;
                node.v_Show = false;
            }
        };

        node.SetSceenPos = function (_pos) {
            //console.log(node.k_SpriteSize.y * GamePublic.g_SceenScale * 0.5)
            //node.v_SpritePos = GamePublic.s_Vec2d((node.v_NodeMapPos.x - node.v_NodeMapPos.y) * (GamePublic.e_MapTilePixel.width * 0.5) * GamePublic.g_SceenScale,
            //    (node.v_NodeMapPos.x + node.v_NodeMapPos.y) * (GamePublic.e_MapTilePixel.height * 0.5) * GamePublic.g_SceenScale + (GamePublic.e_MapTilePixel.height * GamePublic.g_SceenScale) * 0.5);
            node.v_SpritePos = GamePublic.s_Vec2d(_pos.x * (node.v_MainMap.v_MapTiledSize.x * GamePublic.g_SceenScale),
                _pos.y * (node.v_MainMap.v_MapTiledSize.y * GamePublic.g_SceenScale) + node.k_SpriteSize.y * node.v_HeigthOffset * GamePublic.g_SceenScale);
            if (node.v_TileSprite) {
                node.v_TileSprite.setPosition(node.v_SpritePos);
                if(node.v_ShowLevel > 4){node.v_TileSprite.zIndex = (node.v_MainMap.v_MapSize.x * node.v_MainMap.v_MapSize.y)-(node.v_NodeMapPos.x + node.v_NodeMapPos.y * node.v_MainMap.v_MapSize.x) ;}
            }
            node.v_Rect = GamePublic.s_Rect(node.v_SpritePos.x, node.v_SpritePos.y, node.v_SpritePos.x + node.k_SpriteSize.x, node.v_SpritePos.y + node.k_SpriteSize.y);
            //if (this.v_TileSprite) this.v_TileSprite.setScale(g_SceenScale);
        };

        node.MyUpdate = function () {
            node.SetSceenPos(node.v_NodeMapPos);
            var sceen = GamePublic.s_Vec2d(node.v_SpritePos.x + GamePublic.g_MoveOff.x, node.v_SpritePos.y + GamePublic.g_MoveOff.y);
            //console.log(node.v_Show,node.v_TileSprite,"x:",sceen.x,"y:",sceen.y);
            if (node.v_Show) {
                if (node.v_TileSprite && sceen.x > GamePublic.g_winSize.width + 70 || sceen.x < -70 || sceen.y > GamePublic.g_winSize.height + 70 || sceen.y < -70) {
                    this.UnLoadSpriteRes();
                }
            } else if (!node.v_TileSprite && sceen.x < GamePublic.g_winSize.width + 70 && sceen.x > -70 && sceen.y < GamePublic.g_winSize.height + 70 && sceen.y > -70) {
                this.Load2DSpriteRes();
            }
            for (var i = 0; i < node.v_TileResArray.length; i++) {
                node.v_TileResArray[i].MyUpdate();
            }
            // if(this.v_ExistBuildArray.length){
            //     this.SetSelectFlag(true,cc.color(255, 0, 0, 155));
            // }else{
            //     //this.SetSelectFlag(false,null);
            // }
        };

        node.SetSelectFlag = function (_bool,_color) {
            if (!node.v_TileSprite) return;
            if (_bool) { //是否被选中
                if (node.v_SelectSprite != null) return;
                node.v_SelectSprite = new cc.Node;
                var Img = node.v_SelectSprite.addComponent(cc.Graphics);
                Img.clear();
                Img.lineWidth = 1;
                Img.fillColor = _color;//cc.color(255, 255, 0, 95);
                Img.rect(0, 0, 10, 10);
                Img.fill();
                node.v_TileSprite.addChild(node.v_SelectSprite, 5);
                //node.v_SelectSprite.setPosition({ x: 1, y: 1});
            } else {
                if (node.v_SelectSprite) {
                    node.v_TileSprite.removeChild(node.v_SelectSprite);
                    node.v_SelectSprite.destroy();
                    node.v_SelectSprite = null;
                }
            }
        }
        return node;
    }
};


module.exports = C_MapTile;