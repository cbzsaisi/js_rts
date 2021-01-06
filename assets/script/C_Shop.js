var GamePublic = require("./F_GamePublic");

var s_ItemStore = function (_StoreNum,_BarNumber) {
    var ItemStore = {};
    ItemStore.StoreNum = _StoreNum;
    ItemStore.ItemBar = Array(_BarNumber);
    return ItemStore;
}

var C_Shop = {
    New: function () {
        var node = {};
        node.StoreArray = [];
        node.StoreNum = 0;

        node.AddStore = function(_StoreNum,_BarNumber){
            node.StoreArray.push(s_ItemStore(_StoreNum,_BarNumber));
        };
        node.GetStore = function(_StoreNum){
            var t_store = null;
            for(var i=0;i<node.StoreArray.length;i++){
                if(node.StoreArray[0].StoreNum == _StoreNum)
                return node.StoreArray[0];
            }
            return t_store;
        };
        node.GetGoldQuantity = function(_Store){
            var Quantity = 0;
            for(var i=0;i<_Store.length;i++){
                if(_Store[i] && _Store[i].Name == GamePublic.e_ItemName.Gold){
                    //Quantity += _Store[i].ItemNum;
                    return _Store[i].ItemNum;
                }
            }
            return Quantity;
        }
        node.AddGoldToStore = function(_Store,_GoldNum){
            var Empty = null;
            for(var i=0;i<_Store.length;i++){
                if(_Store[i] == null){
                    Empty = i;
                }else
                if(_Store[i].Name == GamePublic.e_ItemName.Gold){
                    _Store[i].ItemNum += _GoldNum;
                    return;
                }
            }
            _Store[Empty] = GamePublic.g_ItemManager.CreateItem(GamePublic.e_ItemName.Gold);
            _Store[Empty].ItemNum = _GoldNum;
        }

        node.SubGoldToStore = function(_Store,_GoldNum){
            var Empty = null;
            for(var i=0;i<_Store.length;i++){
                if(_Store[i] == null){
                    Empty = i;
                }else
                if(_Store[i].Name == GamePublic.e_ItemName.Gold && _Store[i].ItemNum >= _GoldNum){
                    _Store[i].ItemNum -= _GoldNum;
                    return true;
                }
            }
            return false;
        }

        node.ShopTradeCalc = function(_s_Store,_s_Num,_d_Store,_d_Num,_Discount){
            var s_Item = _s_Store[_s_Num];
            var d_Item = _d_Store[_d_Num];
            if(d_Item){
                re = "目标不是空";
                return re;
            }
            var re = null;
            if(node.GetGoldQuantity(_d_Store) < s_Item.Value * _Discount){
                re = "NoMoney";
                return re;
            };
            if(s_Item.Name == GamePublic.e_ItemName.Gold || s_Item.Value == 0){
                re = "无法交易"
                return re;
            }

            if(s_Item.ItemNum > 1){
                //console.log();
            }else{
                node.SubGoldToStore(_d_Store,s_Item.Value * _Discount);
                node.AddGoldToStore(_s_Store,s_Item.Value * _Discount);
                _d_Store[_d_Num] = s_Item;
                _s_Store[_s_Num] = null;
            }
        };
        node.AddStore(++node.StoreNum,20);
        //node.AddGoldToStore(node.GetStore(node.StoreNum).ItemBar,200);
        return node;
    }
}

module.exports = C_Shop;