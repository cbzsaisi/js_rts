var GamePublic = require("./F_GamePublic");

var C_BuildFrontDraw = {
    New: function (_Node,_ShowNode,_NodeType) {
        var node = {};
        //node.Node = g_g_GameDataResManger.GetBuild(node.NodeNumber),

        node.MainNode = _Node,
        node.MainShowNode = _ShowNode,
        //node.NodeNumber = node.Node.NodeNumber,
        node.NodeType = _NodeType,
        node.NodePos = GamePublic.s_Vec2d(0,0),

        node.ShowNode = new cc.Node(),
        node.ShowNodeSelectFlag = false,
        node.ShowNodeSelect = node.ShowNode.addComponent(cc.Graphics),
        node.MainShowNode.addChild(node.ShowNode,1000),

        //node.ShowNode.addChild(node.ShowNodeSelect),
        node.ShowBuildHPFlag = true;
        //node.ShowBuildHP = node.ShowNode.addComponent(cc.Graphics),
        //node.ShowNode.addChild(node.ShowBuildHP);
        
        node.update = function () {
            node.ShowNodeSelect.clear();
            node.ShowNode.setScale(0.08);
            if (node.MainNode.GameInfo.v_SpriteShow && !node.ShowNode.active){
                node.ShowNode.active = true;
            }else if(!node.MainNode.GameInfo.v_SpriteShow && node.ShowNode.active){
                node.ShowNode.active = false;
                return;
            }
            if(node.MainNode.GameInfo.v_BuildSelectFlag){
                
                //if(node.ShowNodeSelectFlag){

                    //node.ShowNodeSelect.clear();
                    node.ShowNodeSelect.lineWidth = 1;
                    node.ShowNodeSelect.strokeColor = cc.Color.BLUE;
                    node.ShowNodeSelect.fillColor = cc.Color.BLUE;
                    node.ShowNodeSelect.rect(180,-100,50,50);
                    node.ShowNodeSelect.fill();
                    node.ShowNodeSelect.stroke();
 
                node.ShowNodeSelectFlag = true;
                //}
            }/* else{
                //node.ShowNodeSelect.clear();
                node.ShowNodeSelectFlag = false;
            } */

             if(true){
                if(node.ShowBuildHPFlag){
                    //node.ShowBuildHP.clear();
                    node.ShowNodeSelect.lineWidth = 1;
                    node.ShowNodeSelect.strokeColor = cc.Color.RED;
                    node.ShowNodeSelect.fillColor = cc.Color.RED;
                    //node.ShowNodeSelect.rect(-250,-300,500 * g_BuildManager.GetBuildHpRatio(node.MainNode.Info.v_BuildNumber),30);
                    node.ShowNodeSelect.rect(-250,-300,20 * node.MainNode.Info.v_BuildPropertyData.NowHP,30);
                    
                    node.ShowNodeSelect.fill();
                    node.ShowNodeSelect.stroke();
                    //
                }
            }else{
                //node.ShowBuildHP.clear();
                node.ShowBuildHPFlag = false;
            } 
            //node.ShowNode.setPosition(node.MainNode.GameInfo.v_SpritePos);
            //node.ShowNode.setRotation(cc.quat(88,0,0));
            
        }
        return node;
    }
}

module.exports = C_BuildFrontDraw;