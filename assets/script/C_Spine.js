var GamePublic = require("./F_GamePublic");
var RoleSrcipt = require("./F_RoleSrcipt");
var C_Spine = {
    New: function(_MainRole, _SpriteRes) {
        var node = {};
        node.v_MainRole = _MainRole;
        node.v_Sprite = cc.instantiate(_SpriteRes);
        node.v_MainRole.GameInfo.v_SpriteSize.height = 100;
        node.v_MainRole.GameInfo.v_CurrentMap.v_MapShowNode.addChild(node.v_Sprite, 10);
        var sp1 = node.v_Sprite.getComponent(sp.Skeleton);
        sp1.premultipliedAlpha = false;
        // sp1.setMix("walk", "jump", 0.2);
        // sp1.setMix("jump", "walk", 0.4);
        // hero.addAnimation(0, "jump", false/*, 3.f*/); // 添加动画jump, 第四个参数是延迟
        // node.v_Sprite.setScale(cc.v3(0.2, 0.2, 0.2)); // for 3D node
        node.v_Model = 0;
        //node.v_MainRole.GameInfo.v_CurrentMap.v_MapShowNode.setCascadeOpacityEnabled(true);
        //node.v_Sprite.setOpacity(node.v_MainRole.GameInfo.v_CurrentMap.v_MapShowNode.getParent().getOpacity());
        
        node.SetRoleAction = function(_ActionName) {
            switch (_ActionName) {
                /* case e_RoleAction.default:
                    break; */
                case GamePublic.e_RoleAction.walk:{
                    var ske = node.v_Sprite.getComponent(sp.Skeleton);
                    // ske.clearTracks();
                    node.v_MainRole.Command.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.play;
                    ske.setStartListener((trackEntry, LoopCount) =>{node.RoleActionStartEner(_ActionName);});
                    ske.setCompleteListener((trackEntry, LoopCount) =>{node.RoleActionCompleteEner(node.v_MainRole.Command.v_ActionEvent,node.v_MainRole.Info.v_TargetType,node.v_MainRole.Command.v_TarNum);});
                    ske.setAnimation(0, "walk", false);
                    //this.SetRoleActionSpeed(0.5);
                    break;
                }
                case GamePublic.e_RoleAction.jump:{
                    var ske = node.v_Sprite.getComponent(sp.Skeleton);
                    // ske.clearTracks();
                    node.v_MainRole.Command.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.play;
                    ske.setStartListener((trackEntry, LoopCount) =>{node.RoleActionStartEner(node.v_MainRole.Command.v_ActionEvent);});
                    ske.setCompleteListener((trackEntry, LoopCount) =>{node.RoleActionCompleteEner(node.v_MainRole.Command.v_ActionEvent,node.v_MainRole.Info.v_TargetType,node.v_MainRole.Command.v_TarNum);});
                    ske.setAnimation(0, "jump", false);
                    //this.SetRoleActionSpeed(0.5);
                    break;
                }
            }
        }

        node.RoleActionStartEner = function(i_ActionName) {
            node.v_MainRole.Command.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.play;
            //console.log("RoleActionStartEner");
        };

        node.RoleActionCompleteEner = function(v_ActionEvent,v_TarType,v_TarNum) {
            if(node.v_MainRole.Command.v_ActionRunStage == GamePublic.e_SpriteActionRunStage.stop){
                node.v_MainRole.Command.v_ActionWaitTime = 0;
                return;
            }
            var g_gamemangaer = GamePublic.g_GameDataResManger;
            switch (v_ActionEvent) {
                case GamePublic.e_RoleAction.walk:{
                    //console.log("walk fin");
                    //node.v_MainRole.GameInfo.v_MapOffset = GamePublic.s_Vec2d(0,0);
                    //if(node.v_MainRole.Command.v_ActionLoop == true)node.v_MainRole.SetRoleAction(node.v_MainRole.Command.v_ActionEvent);
                    break;
                }
                case GamePublic.e_RoleAction.attack:{
                    var src = new GamePublic.s_RoleScript({ Info:{TargetType:v_TarType}, Name:node.v_MainRole.Command.v_ActionEvent},{Num:node.v_MainRole.Info.v_Number, Array:"",Pos:123},{Num:v_TarNum});
                    RoleSrcipt.RoleActionSrciptProc(src);
                    break;
                }
                case GamePublic.e_RoleAction.Work_Felling:{
                    var src = new GamePublic.s_RoleScript({ Info:{TargetType:v_TarType}, Name:node.v_MainRole.Command.v_ActionEvent},{Num:node.v_MainRole.Info.v_Number, Array:"",Pos:123},{Num:v_TarNum});
                    RoleSrcipt.RoleActionSrciptProc(src);
                    break;
                }
            }
            node.v_MainRole.Command.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.stop;
        };

        node.SetRoleActionSpeed = function(i_speed) {
            node.v_Sprite.getComponent(sp.Skeleton).timeScale = i_speed;
        }
        return node;
    }
}

module.exports = C_Spine;