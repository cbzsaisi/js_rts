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
        case "spine":{
            s_FileResData.LoadRes = function(){
                var spineNode = new cc.Node();
                var skeleton = spineNode.addComponent(sp.Skeleton);
                cc.resources.load("spine/raptor-pro", sp.SkeletonData, (error, assets) => {
                    console.log(error);
                    if (error == null) {
                        //设置数据
                        skeleton.skeletonData = assets;
                        //播放默认动画
                        skeleton.setAnimation(0, "walk", true);
                    }
                });
                s_FileResData.Info.FileData = spineNode;
                s_FileResData.Info.LoadDone = true; 
            };
        }
        break;
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
        case "2DMapTile":{
            cc.resources.load("zhu", cc.SpriteAtlas, function (err, atlas) {
                for(var i in _FileArray){
                    var sprite = new cc.Node();
                    sprite.addComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(_FileArray[i].FileName)
                    _FileArray[i].FileData = sprite;
                    _FileArray[i].LoadDone = true;
                } 
            });    
        }
        break;
    }
}

module.exports = F_GameResManage;