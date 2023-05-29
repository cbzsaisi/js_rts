var GamePublic = require("./F_GamePublic");

var C_3DSprite = {
    New: function (_MainRole, _SpriteRes) {
        var node = {};
        node.v_MainRole = _MainRole;
        node.v_Sprite = cc.instantiate(_SpriteRes);
        node.v_Model = 0;
        node.v_MainRole.GameInfo.v_CurrentMap.v_MapShowNode.addChild(node.v_Sprite, 5);


        //-----------------------------------------------------------------------------
        // Desc: 设置切换动画
        //-----------------------------------------------------------------------------

        node.SetRoleAction = function (_ActionName) {
            //_Role.GameInfo.v_ActionStage = _ActionName;
            switch (_ActionName) {
                /* case e_RoleAction.default:
                    break; */
                case GamePublic.e_RoleAction.walk:
                    var seft = node.v_Sprite.getComponent(cc.SkeletonAnimation);
                    seft.stop();
                    node.v_Model = seft.getAnimationState('Take 001');
                    node.v_Model.speed = 1 * (GamePublic.g_GameTimeDt/30);
                    var animState = seft.play('Take 001');
                    //animState.Speed = 10;
                    //seft.setCurrentTime(10,'Take 001');
                    //model.wrapMode = cc.WrapMode.Normal; cc.WrapMode.Normal
                    if(node.v_MainRole.Command.v_ActionLoop){
                        node.v_Model.repeatCount = Infinity; //
                    }else{
                        node.v_Model.repeatCount = 1; //Infinity
                    }
                    node.v_Model.on('play', node.RoleActionPlay, node);
                    node.v_Model.on('finished', node.RoleActionFinished, node);
                    break;
            }
        }

        node.RoleActionPlay = function (type, state) {
            switch (node.v_MainRole.Command.v_ActionEvent) {
                case GamePublic.e_RoleAction.walk:                 
                    //console.log("walk play");
                    break;
                    case GamePublic.e_RoleAction.attack:
                    console.log("attack play");
                    break;
            }
            node.v_MainRole.Command.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.play;
        }

        node.RoleActionFinished = function (type, state) {
            var g_gamemangaer = GamePublic.g_GameDataResManger;

            switch (node.v_MainRole.Command.v_ActionEvent) {
                case GamePublic.e_RoleAction.walk:{
                    console.log("walk fin");
                    //node.v_MainRole.GameInfo.v_MapOffset = GamePublic.s_Vec2d(0,0);
                    node.SetRoleAction(node.v_MainRole.Command.v_ActionEvent);
                    break;
                }
                    
                case GamePublic.e_RoleAction.attack:{
                    node.v_MainRole.Command.v_ActionWaitTime = 0;
                    var CommandArray = node.v_MainRole.Command.v_RoleActionCommandArray1;
                    if(CommandArray[node.v_MainRole.Command.v_RoleActionCommandArray1Number].Script.Name == GamePublic.e_CommandType.RoleAttack){
                        var t_role = g_gamemangaer.GetRole(CommandArray[node.v_MainRole.Command.v_RoleActionCommandArray1Number].TarRole.Num);
                        for(var i in CommandArray[CommandArray.length - 1].TarRole.Array){
                            var src = new GamePublic.s_RoleScript({Info:{AttackType:node.v_MainRole.GameInfo.v_RoleAttackType,AttackPower:10,SkillType:1,SkillPower:1},Name:GamePublic.e_CommandType.RoleAttackHarm},{Num:t_role.Info.v_RoleNumber ,Array:"",Pos:123},{Num:node.v_MainRole.Info.v_RoleNumber,Array:"",Pos:123});
                            t_role.Command.v_RoleActionCommandPassive.push(src);
                        }
                    }
                    //console.log("attack fin");
                    break;
                }
            }
            node.v_MainRole.Command.v_ActionRunStage = GamePublic.e_SpriteActionRunStage.stop;
        }

        return node;
    }
};

module.exports = C_3DSprite;