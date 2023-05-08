var GamePublic = require("./F_GamePublic");

var C_Spine = {
    New: function(_MainRole, _SpriteRes) {
        var node = {};
        node.v_MainRole = _MainRole;
        node.v_Sprite = cc.instantiate(_SpriteRes);
        node.v_MainRole.RoleGameInfo.v_SpriteSize.height = 100;
        node.v_MainRole.RoleGameInfo.v_CurrentMap.v_MapShowNode.addChild(node.v_Sprite, 10);
        var sp1 = node.v_Sprite.getComponent(sp.Skeleton);
        sp1.premultipliedAlpha = false;
        // sp1.setMix("walk", "jump", 0.2);
        // sp1.setMix("jump", "walk", 0.4);
        // hero.addAnimation(0, "jump", false/*, 3.f*/); // 添加动画jump, 第四个参数是延迟
        // node.v_Sprite.setScale(cc.v3(0.2, 0.2, 0.2)); // for 3D node
        node.v_Model = 0;
        //node.v_MainRole.RoleGameInfo.v_CurrentMap.v_MapShowNode.setCascadeOpacityEnabled(true);
        //node.v_Sprite.setOpacity(node.v_MainRole.RoleGameInfo.v_CurrentMap.v_MapShowNode.getParent().getOpacity());
        
        node.SetRoleAction = function(_ActionName) {
            switch (_ActionName) {
                /* case e_RoleAction.default:
                    break; */
                case GamePublic.e_RoleAction.walk:{
                    var ske = node.v_Sprite.getComponent(sp.Skeleton);
                    // ske.clearTracks();
                    ske.setStartListener((trackEntry, LoopCount) =>{node.RoleActionStartEner(_ActionName);});
                    ske.setCompleteListener((trackEntry, LoopCount) =>{node.RoleActionCompleteEner(_ActionName);});
                    ske.setAnimation(0, "walk", false);
                    //this.SetRoleActionSpeed(0.5);
                    break;
                }
                case GamePublic.e_RoleAction.jump:{
                    var ske = node.v_Sprite.getComponent(sp.Skeleton);
                    console.log("jump")
                    // ske.clearTracks();
                    ske.setStartListener((trackEntry, LoopCount) =>{node.RoleActionStartEner(_ActionName);});
                    ske.setCompleteListener((trackEntry, LoopCount) =>{node.RoleActionCompleteEner(_ActionName);});
                    ske.setAnimation(0, "jump", false);
                    //this.SetRoleActionSpeed(0.5);
                    break;
                }
            }
        }

        node.RoleActionStartEner = function(i_ActionName) {
            node.v_MainRole.RoleCommand.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.play;
            //console.log("RoleActionStartEner");
        };

        node.RoleActionCompleteEner = function(i_ActionName) {
            //console.log("RoleActionCompleteEner");
            node.v_MainRole.RoleCommand.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.stop;
            var g_gamemangaer = GamePublic.g_GameDataResManger;
            switch (node.v_MainRole.RoleCommand.v_ActionEvent) {
                case GamePublic.e_RoleAction.walk:{
                    //console.log("walk fin");
                    //node.v_MainRole.RoleGameInfo.v_MapOffset = GamePublic.s_Vec2d(0,0);
                    //if(node.v_MainRole.RoleCommand.v_ActionLoop == true)node.v_MainRole.SetRoleAction(node.v_MainRole.RoleCommand.v_ActionEvent);
                    break;
                }
                    
                case GamePublic.e_RoleAction.attack:{
                    node.v_MainRole.RoleCommand.v_ActionWaitTime = 0;
                    var CommandArray = node.v_MainRole.RoleCommand.v_RoleActionCommandArray1;
                    if(CommandArray.length > 0 && CommandArray[node.v_MainRole.RoleCommand.v_RoleActionCommandArray1Number].Script.Name == GamePublic.e_CommandType.RoleAttack){
                        var t_role = g_gamemangaer.GetRole(CommandArray[node.v_MainRole.RoleCommand.v_RoleActionCommandArray1Number].TarRole.Num);
                        for(var i in CommandArray[CommandArray.length - 1].TarRole.Array){
                            var src = new GamePublic.s_RoleScript({Info:{AttackType:node.v_MainRole.RoleGameInfo.v_RoleAttackType,AttackPower:10,SkillType:1,SkillPower:1},Name:GamePublic.e_CommandType.RoleAttackHure},{Num:t_role.RoleInfo.v_RoleNumber ,Array:"",Pos:123},{Num:node.v_MainRole.RoleInfo.v_RoleNumber,Array:"",Pos:123});
                            t_role.RoleCommand.v_RoleActionCommandPassive.push(src);
                        }
                    }
                    console.log("attack fin");
                    break;
                }
            }
        };

        node.SetRoleActionSpeed = function(i_speed) {
            node.v_Sprite.getComponent(sp.Skeleton).timeScale = i_speed;
        }
        return node;
    }
}

module.exports = C_Spine;