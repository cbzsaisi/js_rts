var ResArray = [
    {
        name : "role1",
        spritename : "Role001",
        actionarray : [
            {
                action_name : "walk",
                action :"a_a",
                time : 3
            }
        ]
    }
]


function F_GameResManage() {
};

F_GameResManage.getSpriteResData = function (_name) {

    for (let i = 0; i < ResArray.length; i++) {
        if (ResArray[i].name == _name) {
            return ResArray[i];
        }
    }

}

F_GameResManage.FileResData = function(_Info,_Type) {
    var s_FileResData = {}
    s_FileResData.Info =  _Info;
    switch (_Type){
        case "2d":{
            s_FileResData.LoadRes = function(){
                cc.resources.load(s_FileResData.Info.FileName, cc.SpriteFrame,function (err, prefab) {
                    s_FileResData.Info.FileData = prefab;
                    s_FileResData.Info.LoadDone = true; 
                });
            };
        break;
        }
        case "3d":{
            s_FileResData.LoadRes = function(){
                cc.resources.load(s_FileResData.Info.FileName,function (err, prefab) {
                    s_FileResData.Info.FileData = prefab;
                    s_FileResData.Info.LoadDone = true; 
                });
            };
            break;
            }
        }
    
    s_FileResData.LoadRes();
    return s_FileResData;
}

F_GameResManage.LoadResToFile = function(_FileArray,_Type){
    switch (_Type){
        case "2d":{
            for(var i in _FileArray){
                var res = this.FileResData(_FileArray[i],_Type)
            }
        }
        break;
        case "3d":{
            for(var i in _FileArray){
                var res = this.FileResData(_FileArray[i],_Type)
            }        
        }
        break;
    }
}

module.exports = F_GameResManage;