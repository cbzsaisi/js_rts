var GamePublic = require("./F_GamePublic");

var s_BuildInfo = function (_Name,_Image,_Type,_Size,_ResNeeds,_TechNeeds,_RoomLimit) {
    var BuildInfo = {};
    BuildInfo.Name = _Name;
    BuildInfo.Image = _Image;
    BuildInfo.Type = _Type;
    BuildInfo.Size = _Size;
    BuildInfo.ResNeeds = _ResNeeds;
    BuildInfo.TechNeeds = _TechNeeds;
    BuildInfo.RoomLimit = _RoomLimit;
    return BuildInfo;
}

var C_BuildManager = {
    New: function () {
        var node = {};
        node.BuildInfoArray = [];
        node.BuildButtonArray = [];
        var Button = GamePublic.e_BuildName.SmallHumanBuild;
        node.BuildButtonArray.push(Button);
       
        node.CreateBuildInfoArray = function(){
            var Image = [
                {Name:GamePublic.e_BuildImage.Building,FileName:"111"}
            ];
            var ResNeeds = [
                {Name:"Wood",Value:"10"}
            ];
            var TechNeeds = [
            ];
            var BuildInfo = s_BuildInfo(GamePublic.e_BuildName.SmallHumanBuild,Image,GamePublic.e_BuildType.House,{x:2,y:2},ResNeeds,TechNeeds,2);
            node.BuildInfoArray.push(BuildInfo);
        }
        node.GetBuildSize = function(_BuildingType){
            for(var i in node.BuildInfoArray){
                if(node.BuildInfoArray[i].Name == _BuildingType){
                    return node.BuildInfoArray[i].Size;
                }
            }
            return null;
        }

        node.CreateBuildInfoArray();
        return node;
    }
}


module.exports = C_BuildManager;