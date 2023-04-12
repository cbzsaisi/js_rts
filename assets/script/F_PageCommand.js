var GamePublic = require("./F_GamePublic");
var g_Astar = require("./F_AStar");
var g_RoleManager = require("./F_RoleManager");


function F_PageCommandProc() {};

F_PageCommandProc.AddNumber = function(_Num, _AddNum) {
    if (_Num == 0) {
        _Num = _AddNum;
        return _Num;
    }
    _Num *= 10;
    _Num += _AddNum;
    if (_Num > 999999999) _Num = 999999999;
    return _Num;
}

F_PageCommandProc.PageCommandProc = function(_Info) {

    //var g_gamemangaer = GamePublic.g_GameDataResManger;
    //var s_role = g_gamemangaer.GetRole(_src.ScrRole.Num);
    switch (_Info.Command) {
        case GamePublic.e_ButtonCommand.ClosePage:
            GamePublic.g_GamePageManager.DelPage(_Info.MainNumber);
            break;
        case GamePublic.e_ButtonCommand.CloseMenu:
            GamePublic.g_GameMenuManager.DelMenu(_Info.MainNumber);
            break;
        case GamePublic.e_ButtonCommand.CallRoleItemPage:
            GamePublic.g_GameMenuManager.DelMenu(_Info.MainNumber);
            GamePublic.g_GamePageManager.AddPage({ x: 400, y: 300 }, 'RoleItemPage', _Info.role_array, _Info.s_array, _Info.d_array);
            break;
        case GamePublic.e_ButtonCommand.CallRoleStatePage:
            GamePublic.g_GameMenuManager.DelMenu(_Info.MainNumber);
            GamePublic.g_GamePageManager.AddPage({ x: 400, y: 300 }, 'RoleStatePage', _Info.role_array, _Info.s_array, _Info.d_array);
            break;
        case GamePublic.e_ButtonCommand.CallRoleAndShopTradePage:
            GamePublic.g_GameMenuManager.DelMenu(_Info.MainNumber);
            GamePublic.g_GamePageManager.AddPage({ x: 400, y: 300 }, 'RoleAndShopTradePage', _Info.role_array, _Info.s_array, _Info.d_array);
            break;
        case GamePublic.e_ButtonCommand.CallInputValuePage:
            GamePublic.g_GameMenuManager.DelMenu(_Info.MainNumber);
            GamePublic.g_GamePageManager.AddPage({ x: 500, y: 300 }, 'InputValuePage', _Info.role_array, _Info.s_array, _Info.d_array);
            break;
        case GamePublic.e_ButtonCommand.CallMainMenu:
            if (GamePublic.g_GamePageManager.PageNumber == 0 && GamePublic.g_GameMenuManager.MenuNumber == 0) GamePublic.g_GameMenuManager.AddMenu({ x: 300, y: 400 }, 'type');
            break;
        case GamePublic.e_ButtonCommand.InputNumber0:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 0);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber1:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 1);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber2:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 2);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber3:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 3);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber4:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 4);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber5:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 5);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber6:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 6);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber7:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 7);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber8:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 8);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.InputNumber9:
            GamePublic.g_InputNumber = this.AddNumber(GamePublic.g_InputNumber, 9);
            GamePublic.g_GamePageManager.UpdateText();
            break;
        case GamePublic.e_ButtonCommand.BuildPlace:
            var Buildsize = GamePublic.g_BuildManager.GetBuildInfo(GamePublic.g_BuildManager.BuildButtonArray[_Info.Array]).Size;
            if (Buildsize) {
                GamePublic.g_UserPicklObj = { Num: _Info.Array, Size: Buildsize, Type: GamePublic.e_UserControlType.BuildPlace };
            }
            break;
    }
}




module.exports = F_PageCommandProc;