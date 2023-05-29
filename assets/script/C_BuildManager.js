var GamePublic = require("./F_GamePublic");

function F_BuildManager() {
};

var s_BuildInfo = function(_Name, _Image, _Type, _Size, _ResNeeds, _TechNeeds, _RoomLimit) {
    var BuildInfo = {};
    BuildInfo.Name = _Name;
    BuildInfo.Image = _Image;
    BuildInfo.Type = _Type;
    BuildInfo.Size = _Size;
    BuildInfo.ResNeeds = _ResNeeds; //需要的资源
    BuildInfo.TechNeeds = _TechNeeds; //需要的科技
    BuildInfo.RoomLimit = _RoomLimit;
    return BuildInfo;
}

F_BuildManager.C_BuildManager = {
    New: function() {
        var node = {};
        node.BuildInfoArray = [];
        node.BuildButtonArray = [];
        var Button = GamePublic.e_BuildName.SmallHumanBuild;
        node.BuildButtonArray.push(Button);

        node.CreateBuildInfoArray = function() {
            var Image = [
                { Name: GamePublic.e_BuildImage.Building, FileName: "111" }
            ];
            var ResNeeds = [
                { Name: "Wood", Value: "10" }
            ];
            var TechNeeds = [];
            var BuildInfo = s_BuildInfo(GamePublic.e_BuildName.SmallHumanBuild, Image, GamePublic.e_BuildType.House, { x: 2, y: 2 }, ResNeeds, TechNeeds, 2);
            node.BuildInfoArray.push(BuildInfo);
        }
        node.GetBuildSize = function(_BuildingType) {
            for (var i in node.BuildInfoArray) {
                if (node.BuildInfoArray[i].Name == _BuildingType) {
                    return node.BuildInfoArray[i].Size;
                }
            }
            return null;
        }
        node.GetBuildInfo = function(_BuildingType) {
            for (var i in node.BuildInfoArray) {
                if (node.BuildInfoArray[i].Name == _BuildingType) {
                    return node.BuildInfoArray[i];
                }
            }
            return null;
        }

        node.CreateBuildInfoArray();
        return node;
    }
}



F_BuildManager.BuildValueAlter = function (v_BuildNumber, v_value) {
    var Build = GamePublic.g_GameDataResManger.GetRole(v_RoleNumber);
    Role.RoleInfo.v_RolePropertyData.NowHP -= v_value.Hp;
    Role.RoleInfo.v_RolePropertyData.NowMP -= v_value.Mp;
    if(Role.RoleInfo.v_RolePropertyData.NowHP < 0) Role.RoleInfo.v_RolePropertyData.NowHP = 0;
    if(Role.RoleInfo.v_RolePropertyData.NowMP < 0) Role.RoleInfo.v_RolePropertyData.NowMP = 0;
    return;
},

module.exports = F_BuildManager;