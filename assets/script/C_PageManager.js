var PageClass = require("./C_Page");
var GamePublic = require("./F_GamePublic");

var C_PageManager = {
    New: function (_MainNode) {
        var node = {};
        node.MainNode = _MainNode;
        node.PageNumber = 0;
        node.PageArray = [];
        node.CurPageNumber = 0;
        node.PickFlag = false;
       
        node.AddPage = function (_pos,_PageType,_RoleNumber,_SrcArray,_DesArray){
            var page = new PageClass.New(_pos,_PageType,_RoleNumber,_SrcArray,_DesArray,node.MainNode,++node.PageNumber);
            node.PageArray.push(page);
            node.CurPageNumber = node.PageNumber;
        }

        node.Update = function(){
            for(var i=0;i<node.PageArray.length;i++){
                node.PageArray[i].Update();
            }
        }

        // node.UpdateText = function(){
        //     for(var i=0;i<node.PageArray.length;i++){
        //         if(node.PageArray[i].PageNumber == node.CurPageNumber && node.PageArray[i].CreateDone)
        //         node.PageArray[i].ShowRoleItemArray();
        //     }
        // }


        node.DelPage = function (_PageNumber){
            for(var i=0;i<node.PageArray.length;i++){
                if(node.PageArray[i].PageNumber == _PageNumber && node.PageArray[i].CreateDone){
                    node.PageArray[i].Delete();
                    node.PageArray.splice(i, 1);
                    node.CurPageNumber = --node.PageNumber;
                }
            }
            //if(node.PageArray.length)node.PageArray.splice(0,node.PageArray.length);
        }

        node.PageButtonCheck = function (_Pos, _ClickType) {
            switch (_ClickType) {
                case GamePublic.e_ClickType.LeftUp:
                    for (var i = 0; i < node.PageArray.length; i++) {
                        if (node.PageArray[i].PageNumber == node.CurPageNumber && node.PageArray[i].CreateDone){// && !GamePublic.g_MouseMoveFlag) {
                            if (node.PageArray[i].ClickCheck(_Pos, _ClickType)) {
                                //node.PickFlag = true;
                                //console.log("LeftUp点中")
                            } else {
                                //console.log("LeftUp没有选中");
                            }
                        }
                        if(node.PageArray[i])node.PageArray[i].CleanPick();
                    }
                    break;
                case GamePublic.e_ClickType.Move:
                    for (var i = 0; i < node.PageArray.length; i++) {
                        if (node.PageArray[i].PageNumber == node.CurPageNumber && node.PageArray[i].CreateDone){ // && node.PageArray[i].PickObj) {
                             if (node.PageArray[i].ClickCheck(_Pos, _ClickType)) {
                                //node.PickFlag = true;
                                //console.log("Move点中")
                            } else {
                                //console.log("Move没有选中");
                            } 
                        }
                    }
                    break;
                case GamePublic.e_ClickType.LeftDown:
                    for (var i = 0; i < node.PageArray.length; i++) {
                        if (node.PageArray[i].PageNumber == node.CurPageNumber && node.PageArray[i].CreateDone) {
                            if (node.PageArray[i].ClickCheck(_Pos, _ClickType)) {
                                //node.PickFlag = true;
                                //console.log("LeftDown点中")
                            } else {
                                //console.log("LeftDown没有选中");
                            }
                        }
                    }
                    break;
            }
        }
        
        return node;
    }
}

module.exports = C_PageManager;