var GamePublic = require("./F_GamePublic");
var g_RoleManager = require("./F_RoleManager");

var C_RoleFrontDraw = {
    New: function (_Node,_ShowNode,_NodeType) {
        var node = {};
            //node.Node = g_g_GameDataResManger.GetRole(node.NodeNumber),

        node.MainNode = _Node,
        node.MainShowNode = _ShowNode,
            //node.NodeNumber = node.Node.NodeNumber,
            node.NodeType = _NodeType,
            node.ShowNode = new cc.Node(),
            node.NodePos = GamePublic.s_Vec2d(0,0),
            node.ShowNodeSelectFlag = false,
            node.ShowNodeSelect = node.ShowNode.addComponent(cc.Graphics),
            //node.ShowNode.addChild(node.ShowNodeSelect),
            node.ShowRoleHPFlag = true;
            //node.ShowRoleHP = node.ShowNode.addComponent(cc.Graphics),
            //node.ShowNode.addChild(node.ShowRoleHP);

            node.MainShowNode.addChild(node.ShowNode,1000),

        node.update = function () {
            node.ShowNodeSelect.clear();
            node.ShowNode.setScale(0.01 * node.MainNode.RoleGameInfo.v_SpriteScale);
            if (node.MainNode.RoleGameInfo.v_SpriteShow && !node.ShowNode.active){
                node.ShowNode.active = true;
            }else if(!node.MainNode.RoleGameInfo.v_SpriteShow && node.ShowNode.active){
                node.ShowNode.active = false;
                return;
            }
            if(node.MainNode.RoleGameInfo.v_RoleSelectFlag){
                
                //if(node.ShowNodeSelectFlag){

                    //node.ShowNodeSelect.clear();
                    node.ShowNodeSelect.lineWidth = 1;
                    node.ShowNodeSelect.strokeColor = cc.Color.BLUE;
                    node.ShowNodeSelect.fillColor = cc.Color.BLUE;
                    node.ShowNodeSelect.rect(100,300,50,50);
                    node.ShowNodeSelect.fill();
                    node.ShowNodeSelect.stroke();
 
                node.ShowNodeSelectFlag = true;
                //}
            }/* else{
                //node.ShowNodeSelect.clear();
                node.ShowNodeSelectFlag = false;
            } */

             if(true){
                if(node.ShowRoleHPFlag){
                    //node.ShowRoleHP.clear();
                    node.ShowNodeSelect.lineWidth = 1;
                    node.ShowNodeSelect.strokeColor = cc.Color.RED;
                    node.ShowNodeSelect.fillColor = cc.Color.RED;
                    node.ShowNodeSelect.rect(-250,-300,500 * g_RoleManager.GetRoleHpRatio(node.MainNode.RoleInfo.v_RoleNumber),30);
                    node.ShowNodeSelect.fill();
                    node.ShowNodeSelect.stroke();
                    //
                }
            }else{
                //node.ShowRoleHP.clear();
                node.ShowRoleHPFlag = false;
            } 
            //node.ShowNode.setPosition(node.MainNode.RoleGameInfo.v_SpritePos);
            //node.ShowNode.setRotation(cc.quat(88,0,0));
            
        }
        return node;
    }
}

module.exports = C_RoleFrontDraw;