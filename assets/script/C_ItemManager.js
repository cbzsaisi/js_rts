var GamePublic = require("./F_GamePublic");

var C_ItemManager = {
    New: function () {
        var node = {};
        node.ItemObjArray = [];

        node.Create = function (){
            var ItemUsageValue = GamePublic.s_EquipUsageValue(1,1,1,1,1,1,1);//装备条件
            var ItemIncreaseValue = GamePublic.s_EquipIncreaseValue(5,0,0,0,0,0,0,0,0,0,[],GamePublic.e_EquipAdditionalType.Fire);//装备数值
            var OccupationRestrict = [GamePublic.e_RoleOccupationType.Warrior];
            var item = GamePublic.s_Item(GamePublic.e_ItemName.Sword1,"铁剑", "铁制剑","Itemimage002",GamePublic.e_ItemClass.RoleEquip,GamePublic.e_ItemType.Sword,GamePublic.e_EquipType.Hand,100,5,false,false,ItemUsageValue,ItemIncreaseValue,OccupationRestrict);
            node.ItemObjArray.push(item);

            var OccupationRestrict = [GamePublic.e_RoleOccupationType.All];
            var item = GamePublic.s_Item(GamePublic.e_ItemName.Gold,"金币", "货币","Itemimage001",GamePublic.e_ItemClass.Gold,null,null,1,0,false,true,null,{},OccupationRestrict);
            node.ItemObjArray.push(item);

            var OccupationRestrict = [GamePublic.e_RoleOccupationType.All];
            var item = GamePublic.s_Item(GamePublic.e_ItemName.Wood_Material,"材料", "木头","Itemimage001",GamePublic.e_ItemClass.Material,null,null,1,10,false,true,null,{},OccupationRestrict);
            node.ItemObjArray.push(item);
        }
       
        node.CreateItem = function (_ItemName){
            for(var i=0;i<node.ItemObjArray.length;i++){
                if(node.ItemObjArray[i].Name == _ItemName){
                    var item = node.ItemObjArray[i];
                    return GamePublic.s_ItemCopy(item);
                    //return GamePublic.s_Item(item.Name,item.ItemName,item.Describe,item.ImgName,item.ItemNum,item.ItemType,item.WeaponType,item.EquipType,item.Value,item.Weight,item.UseBout,item.Plural,item.EquipUsageValue,item.EquipIncreaseValue);
                }
            }s
           return null;
        }

        node.BagAddItem = function (_ItemName,_ItemNum,_ObjNum,_ObjType){
            var res = false;
            var item = null;
            var Bag = null;
            var BagSize = 0;
            var Role = null;

            switch(_ObjType) //背包类型
            {
                case "Role":
                Role = GamePublic.g_GameDataResManger.GetRole(_ObjNum); 
                Bag = Role.Info.v_RoleBag;
                BagSize = Role.Info.v_RoleBagSize;
                break;
                case "Shop":
                Role = GamePublic.g_ShopManager.GetStore(_ObjNum); 
                Bag = Role.ItemBar;
                BagSize = Role.ItemBar.length;
                break;
            }
            for(var i=0;i<node.ItemObjArray.length;i++){ //从物品库找到对应物品
                if(node.ItemObjArray[i].Name == _ItemName){
                    item = node.ItemObjArray[i];
                    break;
                }
            }

            for (var i = 0; i < _ItemNum; i++) { //物品个数
                var IsDone = false;
                if (item.Plural) { //如果是复数物品 就加一
                    for (var i1 = 0; i1 < BagSize;i1++) {
                        if (Bag[i1] == null)break;
                        if (Bag[i1].Name == item.Name) {
                            if (Bag[i1].ItemNum < 999) {
                                Bag[i1].ItemNum++;
                            }
                            IsDone = true;
                            res = true;
                            break;
                        }
                    }
                }
                if (!IsDone) {  //否则就重新创建一个
                    for (var i2 = 0; i2 < BagSize;i2++) {
                        if (Bag[i2] == null) {
                            Bag[i2] = node.CreateItem(_ItemName);
                            res = true;
                            break;
                        }
                    }
                }
            }
            return res;
        }

        node.RoleEquipUsageValueCheck = function(_v_RoleRacePropertyData,_RolePropertyData,_UsageValue){
            if(_RolePropertyData.LEVEL >  _UsageValue.LEVEL|| _v_RoleRacePropertyData.STR < _UsageValue.STR || _v_RoleRacePropertyData.CON < _UsageValue.CON || _v_RoleRacePropertyData.DEX < _UsageValue.DEX || _v_RoleRacePropertyData.INT < _UsageValue.INT || _v_RoleRacePropertyData.MEN < _UsageValue.MEN || _v_RoleRacePropertyData.LUK < _UsageValue.LUK)return false;
            return true;
        }//装备条件检测

        node.Update = function(){
           
        }

        node.Del = function (){
            node.ItemObjArray.splice(0,node.ItemObjArray.length);   
        }

        node.RoleEquip = function (_RoleNum,_ItemNum){
            var res = false
            var Role = GamePublic.g_GameDataResManger.GetRole(_RoleNum);
            var Equip = Role.Info.v_RoleBag[_ItemNum];
            //如果物品不是装备类型 或无法符合装备条件
            if(Equip.ItemType != GamePublic.e_ItemClass.RoleEquip || !node.RoleEquipUsageValueCheck(Role.Info.v_RoleRacePropertyData,Role.Info.v_PropertyData,Equip.EquipUsageValue)){
                console.log("物品不是装备类型 或无法符合装备条件");
                return false;
            } 

            switch(Equip.EquipType){
                case GamePublic.e_EquipType.Hand:
                Role.Info.v_RoleEquip[GamePublic.e_EquipType.Hand] = Equip;
                Equip.IsEquip = true;
                Role.Info.v_RoleBag[_ItemNum] = null;
                res = true;
                break;
            }
            return res;
        }

        node.RoleUnEquip = function (_RoleNum, _EquipNum, _BagNum) {
            var res = false
            var Role = GamePublic.g_GameDataResManger.GetRole(_RoleNum);
            if (!Role.Info.v_RoleBag[_BagNum]) {
                var Equip = Role.Info.v_RoleEquip[_EquipNum];
                Role.Info.v_RoleEquip[_EquipNum] = null;
                //Role.Info.v_RoleEquip.splice(_EquipNum,1);
                Role.Info.v_RoleBag[_BagNum] = Equip;
                Equip.IsEquip = false;
                res = true;
            }
            return res;
        }

        node.GetItemQuantity = function (v_ItemName,v_ObjNum,v_ObjType) {
            let Num = 0;
            switch(v_ObjType) //背包类型
            {
                case "Role":
                Role = GamePublic.g_GameDataResManger.GetRole(v_ObjNum); 
                Bag = Role.Info.v_RoleBag;
                BagSize = Role.Info.v_RoleBagSize;
                break;
                case "Shop":
                Role = GamePublic.g_ShopManager.GetStore(v_ObjNum); 
                Bag = Role.ItemBar;
                BagSize = Role.ItemBar.length;
                break;
            }

            for (let i = 0; i < BagSize;i++) {
                if (Bag[i] == null)break;
                if (Bag[i].Name == v_ItemName) {
                    Num = Bag[i].ItemNum;
                    break;
                }
            }
            return Num;
        }

        node.Create();
        return node;
    }
}

module.exports = C_ItemManager;