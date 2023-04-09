var C_Random = {
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

module.exports.Random = C_Random;