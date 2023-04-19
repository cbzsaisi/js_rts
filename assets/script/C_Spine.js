var GamePublic = require("./F_GamePublic");

var C_Spine = {
    New: function(_MainRole, _SpriteRes) {
        var node = {};
        node.v_MainRole = _MainRole;
        node.v_Sprite = cc.instantiate(_SpriteRes);
        var sp1 = node.v_Sprite.getComponent(sp.Skeleton);
        sp1.premultipliedAlpha = false;
        //sp1.timeScale = 0.1;
        sp1.setMix("walk", "jump", 0.2);
        sp1.setMix("jump", "walk", 0.4);
        // node.v_Sprite.setScale(cc.v2(0.2, 0.2)); // Notice: scaleZ will be 0
        // node.v_Sprite.setScale(cc.v3(0.2, 0.2, 0.2)); // for 3D node
        node.v_Model = 0;
        //node.v_MainRole.RoleGameInfo.v_CurrentMap.v_MapShowNode.setCascadeOpacityEnabled(true);
        node.v_MainRole.RoleGameInfo.v_CurrentMap.v_MapShowNode.addChild(node.v_Sprite, 10);
        //node.v_Sprite.setOpacity(node.v_MainRole.RoleGameInfo.v_CurrentMap.v_MapShowNode.getParent().getOpacity());

        node.SetRoleAction = function(_ActionName) {

        }

        node.RoleActionPlay = function(type, state) {

        }

        node.RoleActionFinished = function(type, state) {

        }
        return node;
    }
}

module.exports = C_Spine;