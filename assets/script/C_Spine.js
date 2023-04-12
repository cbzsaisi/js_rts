var GamePublic = require("./F_GamePublic");

var C_Spine = {
    New: function (_SpineName, _MapNum, _MapPoint, _RoleNumber) {
        var node = {};


        node.SetRoleAction = function (_ActionName) {

        }

        node.RoleActionPlay = function (type, state) {
        
        }

        node.RoleActionFinished = function (type, state) {
        
        }
        return node;
    }
}

module.exports = C_Spine;