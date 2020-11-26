var GamePublic = require("./F_GamePublic");

var C_PageBackDrop = {
    New: function (_Image,_MainPage,_Pos,_Color,_Size) {
        var node = {};

        node.MainPage = _MainPage;
        node.Image = _Image;
        node.BackDrop = null;
        node.Pos = _Pos;
        node.BackDropWidth = null;
        node.BackDropHeight = null;
        node.LoadWellDone = false;
        node.Node = new cc.Node();
        node.Rect = null;
        node.Size = _Size;
        node.Color = _Color;
        node.MainPage.Node.addChild(node.Node,3);
        node.SpriteRes = null;
        node.LoadSpriteRes = function () {

            if(node.Color){
                let renderer = node.Node.addComponent(cc.Graphics);
                renderer.fillColor = node.Color;//cc.color(255,255,255,195);
                renderer.rect(0,0,node.Size.w,node.Size.h);
                renderer.fill();
                renderer.stroke();

                node.BackDropWidth = node.Size.w;
                node.BackDropHeight = node.Size.h;
                var pos = GamePublic.s_Vec2d(node.Pos.x - (node.BackDropWidth / 2), node.Pos.y - (node.BackDropHeight / 2));
                node.Rect = GamePublic.s_Rect(pos.x, pos.y, pos.x + node.BackDropWidth, pos.y + node.BackDropHeight);
                node.Node.setPosition(pos);
                node.LoadWellDone = true;

            }else{
                for (var i in GamePublic.g_resources1) {
                    if (GamePublic.g_resources1[i].FileName == node.Image) {
                        node.SpriteRes = node.Node.getComponent(cc.Sprite);
                        if (!node.SpriteRes) {
                            node.SpriteRes = node.Node.addComponent(cc.Sprite);
                        }
                        node.SpriteRes.spriteFrame = GamePublic.g_resources1[i].FileData;
                        node.BackDropWidth = node.SpriteRes.spriteFrame._rect.width;
                        node.BackDropHeight = node.SpriteRes.spriteFrame._rect.height;
                        node.Node.setPosition(node.Pos);
                        if(node.Size){
                        }else{
                            var pos = GamePublic.s_Vec2d(node.Pos.x - (node.BackDropWidth/2),node.Pos.y - (node.BackDropHeight/2));
                            node.Rect = GamePublic.s_Rect(pos.x,pos.y,pos.x + node.BackDropWidth,pos.y + node.BackDropHeight);
                        }
                        node.LoadWellDone = true;
                    }
                }
                /* if(node.SpriteRes == null){
                    cc.loader.loadRes(node.Image, cc.SpriteFrame, function (err, spriteFrame) {
                        node.SpriteRes = node.Node.getComponent(cc.Sprite);
                        if (!node.SpriteRes) {
                            node.SpriteRes = node.Node.addComponent(cc.Sprite);
                        }
                        node.SpriteRes.spriteFrame = spriteFrame;
                        node.Node.setPosition(node.Pos);
                        node.BackDropWidth = spriteFrame._rect.width;
                        node.BackDropHeight = spriteFrame._rect.height;
                        node.LoadWellDone = true;
                        if(node.Size){
                        }else{
                            var pos = GamePublic.s_Vec2d(node.Pos.x - (node.BackDropWidth/2),node.Pos.y - (node.BackDropHeight/2));
                            node.Rect = GamePublic.s_Rect(pos.x,pos.y,pos.x + node.BackDropWidth,pos.y + node.BackDropHeight);
                        }
                    });
                }       */ 
            }
        };

        node.Delete = function () {
            node.MainPage.Node.removeChild(node.Node);// removeAllChildren

            node.Node.destroy();
        }

        node.LoadSpriteRes();
        /* var vfmt = new gfx.VertexFormat([
            { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
            { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
        ]);
        
        let mesh = new cc.Mesh();
        mesh.init(vfmt, 9, true);
        
        node.mesh = mesh;
        
        this.vertexes = [
            cc.v2(-50, 50), cc.v2(0, 50), cc.v2(50, 50),
            cc.v2(-50, 0), cc.v2(0, 0), cc.v2(50, 0),
            cc.v2(-50, -50), cc.v2(0, -50), cc.v2(50, -50)
        ];

        mesh.setVertices(gfx.ATTR_POSITION, this.vertexes);

        mesh.setVertices(gfx.ATTR_UV0, [
            cc.v2(0,0), cc.v2(0.5,0), cc.v2(1, 0),
            cc.v2(0,0.5), cc.v2(0.5,0.5), cc.v2(1,0.5),
            cc.v2(0, 1), cc.v2(0.5, 1), cc.v2(1, 1),
        ]);

        mesh.setIndices([
            0, 1, 3, 1, 4, 3,
            1, 2, 4, 2, 5, 4,
            3, 4, 6, 4, 7, 6,
            4, 5, 7, 5, 8, 7
        ]);

    
         let renderer = this.node.getComponent(cc.MeshRenderer);
        if (!renderer) {
            renderer = this.node.addComponent(cc.MeshRenderer);
        }
        renderer.mesh = mesh;
        this.mesh = mesh;
        node.Update = function () {
        } */

        
        return node;
    }
}


module.exports = C_PageBackDrop;