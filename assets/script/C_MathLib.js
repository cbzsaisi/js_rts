
function F_MathLib() {
};

F_MathLib.C_Random = {
    New: function(){
        var node = {};
        node.RandomTable = [];
        node.RandomIndex = 0;
        node.iRandomMax = 1000;

        node.GenerateRandom = function(){
            for(var i=0;i<node.iRandomMax;i++){
                var j = Math.floor(Math.random()*(node.iRandomMax-1));
                if(i == j)continue;
                var temp = node.RandomTable[j];
                node.RandomTable[j] = node.RandomTable[i];
                node.RandomTable[i] = temp;
            }
            node.RandomIndex = 0;
        };
        node.GetRandom = function(){
            if(node.RandomIndex >= node.iRandomMax)node.GenerateRandom();
            return(node.RandomTable[node.RandomIndex++]);
        }

        for(var i=0;i < node.iRandomMax;i++){
            node.RandomTable[i]=i+1;
        }
        node.GenerateRandom();
        return node;
    }
};



F_MathLib.Sort = function (v_Array,v_type) {
    let len = v_Array.length;
    if (len < 2) return v_Array;
    for(let i = 0; i < len; i++){
        for(let j = 0; j < i; j++){
            switch(v_type){
                case 0:{
                    if(v_Array[j].SortNum > v_Array[i].SortNum){
                        let temp = v_Array[j];
                        v_Array[j] = v_Array[i];
                        v_Array[i] = temp;  
                    }
                    break;
                }
                case 1:{
                    if(v_Array[j].SortNum < v_Array[i].SortNum){
                        let temp = v_Array[j];
                        v_Array[j] = v_Array[i];
                        v_Array[i] = temp;
                    }
                    break;
                }
            }
        }
    }
    return v_Array;
};

module.exports = F_MathLib;