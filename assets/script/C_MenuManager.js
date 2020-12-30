var MenuClass = require("./C_Menu");
var GamePublic = require("./F_GamePublic");

var C_MenuManager = {
    New: function (_MainNode) {
        var node = {};
        node.MainNode = _MainNode;
        node.MenuNumber = 0;
        node.MenuArray = [];
        node.CurMenuNumber = 0;
       
        node.AddMenu = function (_pos,_MenuType){
            var Menu = new MenuClass.New(_pos,_MenuType,{},node.MainNode,++node.MenuNumber);
            node.MenuArray.push(Menu);
            node.CurMenuNumber = node.MenuNumber;
        }

        node.Update = function(){
            for(var i=0;i<node.MenuArray.length;i++){
                node.MenuArray[i].Update();
            }
        }

        node.DelMenu = function (_MenuNumber){
            for(var i=0;i<node.MenuArray.length;i++){
                if(node.MenuArray[i].MenuNumber == _MenuNumber){
                    node.MenuArray[i].Delete();
                    node.MenuArray.splice(i, 1);
                    node.MenuNumber--;
                }
            }
            if(node.MenuArray.length)node.MenuArray.splice(0,node.MenuArray.length);
            node.CurMenuNumber = 0;
        }

        node.MenuButtonMoveCheck = function (_Pos,_ClickType){
            for(var i=0;i<node.MenuArray.length;i++){
                if(node.MenuArray[i].MenuNumber == node.CurMenuNumber && node.MenuArray[i].CreateDone){
                    if(node.MenuArray[i].MoveCheck(_Pos)){
                    }else{
                    }
                }
            }
        }

        node.MenuButtonCheck = function (_Pos, _ClickType) {
            switch (_ClickType) {
                case GamePublic.e_ClickType.Move:
                    for (var i = 0; i < node.MenuArray.length; i++) {
                        if (node.MenuArray[i].MenuNumber == node.CurMenuNumber && node.MenuArray[i].CreateDone) {
                            if (node.MenuArray[i].ClickCheck(_Pos,_ClickType)) {
                            } else {
                            }
                        }
                    }
                    break;
                case GamePublic.e_ClickType.LeftUp:
                    for (var i = 0; i < node.MenuArray.length; i++) {
                        if (node.MenuArray[i].MenuNumber == node.CurMenuNumber && node.MenuArray[i].CreateDone) {
                            if (node.MenuArray[i].ClickCheck(_Pos,_ClickType)) {
                            } else {
                                node.DelMenu(node.CurMenuNumber);
                                // if (node.MenuArray.length) {
                                //     node.CurMenuNumber = node.MenuArray.length;
                                // }
                            }
                        }
                    }
                    break;

            }

        }

        return node;
    }
}

module.exports = C_MenuManager;