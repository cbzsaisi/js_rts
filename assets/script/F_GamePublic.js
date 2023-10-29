var G_Public = {

    e_WayPointType :{
        Type1:0,
        Type2:1,
    },

    s_WayPoint: function (_opos, _dpos, _FatherWayPoint, _WayPointType) {
        var WayPoint = {}
        WayPoint.oPos = _opos;
        WayPoint.dPos = _dpos;
        WayPoint.FatherWayPoint = _FatherWayPoint;
        WayPoint.Gval = 0;
        WayPoint.Hval = 0;
        WayPoint.Fval = 0;
        //WayPoint.WayPointType = ;
        if (_FatherWayPoint != null) {
            switch (_WayPointType) {
                case this.e_WayPointType.Type1:
                    WayPoint.Gval = _FatherWayPoint.Gval + 10;
                    break;
                case this.e_WayPointType.Type2:
                    WayPoint.Gval = _FatherWayPoint.Gval + 12;
                    break;
            }
            WayPoint.Hval = Math.abs(_dpos.x - _opos.x) * 10 + Math.abs(_dpos.y - _opos.y) * 10;
            WayPoint.Fval = WayPoint.Gval + WayPoint.Hval;
        } else {

        }
        return WayPoint;
    },

    s_Vec2d: function (x, y) //游戏坐标
    {
        var Vec2d = {};
        Vec2d.x = x;
        Vec2d.y = y;
        return Vec2d;
    },

    add_Vec2d: function (_vec1, _vec2) {
        var vec = this.s_Vec2d(_vec1.x + _vec2.x, _vec1.y + _vec2.y)
        return vec;
    },
    sub_Vec2d: function (_vec1, _vec2) {
        var vec = this.s_Vec2d(_vec1.x - _vec2.x, _vec1.y - _vec2.y)
        return vec;
    },

    s_Rect: function (x,y,w,h) //游戏坐标
    {
        var Rect = {};
        Rect.x = x;
        Rect.y = y;
        Rect.w = w;
        Rect.h = h;
        return Rect;
    },

    CollideRect : function (Vec2d,Rect) //游戏坐标
    {
        //console.log(Rect);
        if(Vec2d.x > Rect.x && Vec2d.x < Rect.w && Vec2d.y > Rect.y && Vec2d.y < Rect.h)return true;
        return false;
    },

    AddChild : function (_node,_Childnode,_number) 
    {
        _node.addChild(_Childnode,_number);
    },


    RemoveChild : function (_node,_Childnode)
    {
        _node.removeChild(_Childnode);
    },
    

    s_ButtonInfo: function (_pos,_ObjInfo,_MainNumber,_Buttontype,_command,_array,_BarType,_BarNum) //游戏坐标
    {
        var s_ButtonInfo = {};
        s_ButtonInfo.Pos = _pos;
        s_ButtonInfo.ObjInfo = _ObjInfo;
        s_ButtonInfo.MainNumber = _MainNumber;
        s_ButtonInfo.Buttontype = _Buttontype;
        s_ButtonInfo.Command = _command;
        s_ButtonInfo.Array = _array;
        s_ButtonInfo.BarType = _BarType;
        s_ButtonInfo.BarNum = _BarNum;
        return s_ButtonInfo;
    },

    s_ButtonObjInfo: function (_Image,_ObjName,_ObjNum,_ObjDescribe) //
    {
        var s_ButtonObjInfo = {};
        s_ButtonObjInfo.Image = _Image;
        s_ButtonObjInfo.ObjName = _ObjName;
        s_ButtonObjInfo.ObjNum = _ObjNum;
        s_ButtonObjInfo.ObjDescribe = _ObjDescribe;
        return s_ButtonObjInfo;
    }, 

    s_MenuInfo: function (_pos,_Str,_Image,_MainNumber,_number,_Menutype,_command,_role_array,_s_array,_d_array,_isMove) //游戏坐标
    {
        var s_MenuInfo = {};
        s_MenuInfo.Pos = _pos;
        s_MenuInfo.Str = _Str;
        s_MenuInfo.Image = _Image;
        s_MenuInfo.MainNumber = _MainNumber;
        s_MenuInfo.number = _number;
        s_MenuInfo.Menutype = _Menutype;
        s_MenuInfo.Command = _command;
        s_MenuInfo.role_array = _role_array;
        s_MenuInfo.s_array = _s_array;
        s_MenuInfo.d_array = _d_array;
        s_MenuInfo.isMove = _isMove;
        return s_MenuInfo;
    },

    s_RolePropertyData: function (RoleType) { //角色当前能力
        var RolePropertyData = {};
        RolePropertyData.HP = 1;
        RolePropertyData.NowHP = RolePropertyData.HP;
        RolePropertyData.MP = 1;
        RolePropertyData.NowMP = RolePropertyData.MP;
        RolePropertyData.ATT = 1;
        RolePropertyData.DEF = 1;
        RolePropertyData.Vision = 5; //寻敌视力
        RolePropertyData.WorkVision = 5; //工作视力
        return RolePropertyData;
    },

    s_BuildPropertyData: function (BuildType) {
        var BuildPropertyData = {};
        BuildPropertyData.HP = 1;
        BuildPropertyData.MP = 1;
        BuildPropertyData.ATT = 1;
        BuildPropertyData.DEF = 1;
        switch(BuildType){
            case this.e_BuildType.House:{
                break;
            }
            case this.e_BuildType.MilitaryCamp:{
                BuildPropertyData.HP = 50;
                BuildPropertyData.DEF = 2;
                break;
            }
        }
        BuildPropertyData.NowHP = BuildPropertyData.HP;
        BuildPropertyData.NowMP = BuildPropertyData.MP;
        return BuildPropertyData;
    },

    s_RoleStar: function (_v_CurrentMap, _OMapPos, _DMapPos, _MapArray, _RoleNumber, _RolePassStatu, v_FindWayType) {
        var RoleStar = {};
        RoleStar.CurrentMap = _v_CurrentMap;
        RoleStar.OMapPos = _OMapPos;
        RoleStar.DMapPos = _DMapPos;
        RoleStar.MapArray = _MapArray;
        RoleStar.RoleNumber = _RoleNumber;
        RoleStar.RolePassStatu = _RolePassStatu;
        RoleStar.FindWayType = v_FindWayType;
        return RoleStar;
    },

    s_RoleScript: function (_Scrtip_info,_ScrRole,_TarRole){
        var scr = {Script:{},ScrRole:{},TarRole:{}};
        if(_Scrtip_info){
            scr.Script.Info = _Scrtip_info.Info;
            scr.Script.Name = _Scrtip_info.Name;
        };
        if(_ScrRole){
            scr.ScrRole.Num = _ScrRole.Num;
            scr.ScrRole.Array = _ScrRole.Array;
            scr.ScrRole.Pos = _ScrRole.Pos;
        }
        if(_TarRole){
            scr.TarRole.Num = _TarRole.Num;
            scr.TarRole.Array = _TarRole.Array;
            scr.TarRole.Pos = _TarRole.Pos;
        }
        return scr;
    },

    //角色状态
    e_TypeState: {
        Life: 0,
        Death: 1,
    },
    
    s_RoleType: function (){
        var scr = {TypeState: this.e_TypeState.Life};
        return scr;
    },

    GetAngle: function (_pos,_pos2){
        var  Angle = Math.atan2((_pos2.y-_pos.y),(_pos2.x-_pos.x));
        var  Angle2 = Math.atan2(1,1)*(180/Math.PI);
        var  Angle3 = Math.atan2(1,0)*(180/Math.PI);
        var  Angle4 = Math.atan2(0,1)*(180/Math.PI);
        var  Angle4 = Math.atan2(0,0)*(180/Math.PI);

        var  Angle5 = Math.atan2(-1,-1)*(180/Math.PI);
        var  Angle6 = Math.atan2(-1,-0)*(180/Math.PI);
        var  Angle7 = Math.atan2(-0,-1)*(180/Math.PI);
        var  Angle8 = Math.atan2(-0,-0)*(180/Math.PI);
        //if(Angle < 0)Angle += Math.PI*2;
        
        return Angle*(180/Math.PI)+90;
    },

    GetMapXY: function (_pos){
        /* var pos = this.s_Vec2d(Math.round((_pos.x - this.g_MoveOff.x - (this.g_Active_Map.v_MapTiledSize.x * 0.5 * this.g_SceenScale) ) / (this.g_Active_Map.v_MapTiledSize.x * 0.5 * this.g_SceenScale)),
        Math.round((_pos.y - this.g_MoveOff.y - (this.g_Active_Map.v_MapTiledSize.y * 0.5 * this.g_SceenScale)) / (this.g_Active_Map.v_MapTiledSize.y * 0.5 * this.g_SceenScale)));
        //console.log(pos);
        if (pos.x == 0) {
            pos.x = pos.y / 2;
            pos.y = pos.y / 2;
            //cc.log("x = 0");
        } else {
            pos.y = (pos.y - pos.x) / 2;
            pos.x = pos.x + pos.y;
        }
        pos.x > 0 ? pos.x += 0.5 : pos.x -= 0.5;
        pos.y > 0 ? pos.y += 0.5 : pos.y -= 0.5;*/

        var pos = this.s_Vec2d((_pos.x - this.g_MoveOff.x + this.g_Active_Map.v_MapTiledSize.x * 0.5) / (this.g_Active_Map.v_MapTiledSize.x * this.g_SceenScale),
        (_pos.y - this.g_MoveOff.y + this.g_Active_Map.v_MapTiledSize.y * 0.5) / (this.g_Active_Map.v_MapTiledSize.y * this.g_SceenScale));
        //pos.x = parseInt(pos.x);
        //pos.y = parseInt(pos.y); 
        //pos.x > 0?pos.x = Math.ceil(pos.x):pos.x = Math.floor(pos.x);
        //pos.y > 0?pos.y = Math.ceil(pos.y):pos.y = Math.floor(pos.y);
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);

        /* if(pos.x < 0) pos.x = 0;
        if(pos.x > this.e_MapSizeType1.width - 1) pos.x = this.e_MapSizeType1.width - 1;

        if(pos.y < 0) pos.y = 0;
        if(pos.y > this.e_MapSizeType1.height - 1) pos.y = this.e_MapSizeType1.height - 1;
         */
        return pos;
    },

    GetSceenXY: function (_pos) {
        /*var pos = this.s_Vec2d((_pos.x - _pos.y + 1) * (this.g_Active_Map.v_MapTiledSize.x * 0.5 * this.g_SceenScale)+ this.g_MoveOff.x,
            (_pos.y + _pos.x + 1) * (this.g_Active_Map.v_MapTiledSize.y * 0.5 * this.g_SceenScale) + this.g_MoveOff.y);*/
            var pos = this.s_Vec2d(_pos.x * (this.g_Active_Map.v_MapTiledSize.x * this.g_SceenScale)+ this.g_MoveOff.x,
            _pos.y * (this.g_Active_Map.v_MapTiledSize.y * this.g_SceenScale) + this.g_MoveOff.y);
            //console.log(pos);
        return pos;
    },

    g_win: null,
    g_winSize: null,

    g_GameMain: null,
    g_role_action_json: null,
    g_MathLib: null,
    //地图相关
    g_Active_Map: null,

    //角色相关
    g_ActiveRole: null,
    g_SelectRoleArray: null,

    //管理
    g_GameDataResManger: null,
    g_GameManger: null,

    //编号
    g_GameRoleNumber: 0,
    g_GameMapNumber: 0,

    //画图
    g_DrawRect: null,
    g_DrawRectMoveLastPos: null,
    g_LeftKeyStartPos: null,
    //镜头移动相关

    g_MoveOffLast: null,
    g_MoveOff: null,
    g_MoveStartPos: {x:0,y:0},
    g_MoveEndPos: {x:0,y:0},
    g_MoveFlag: false,
    g_MouseLeftFlag: false,
    g_MouseMiddleFlag: false,
    g_MouseRightFlag: false,
    g_MouseMoveFlag: false,
    g_MouseMoveLastPos: {x:0,y:0},
    g_SceenScale: 1,
    g_SelectStaus:null,
    g_MoveSelectStartPos: null,
    g_MoveSelectEndPos: null,
    g_MouseStopTick: 0,

    g_InputNumber : 0,


    //脚本执行状态
    e_ActionCommandState: {
        New: 0,
        Run: 1,
        Stop: 2,
        End: 3,
    },
    
    //执行脚本失败原因
    e_ActionScriptFailType: {
        undefined: 0,
        Success: 1,
        Fail: 2,
        RoleBlock: 3,
        MapBlock: 4,
        BuildBlock: 5,
    },

    e_Buttontype: {
        PageButton: 1,
        UiStaticButton:2,
    },

    //阻挡类型
    e_BlockType: {
        Short: 1,
        Long: 2,
    },

    e_BuildName: {
        SmallHumanBuild: 0,
    },

    e_BuildType: {
        House: 0,
        MilitaryCamp: 1,
    },

    e_BuildImage: {
        Building: 0,
        Damage: 1,
        Lv1ing: 10,
        Lv1: 11,
    },

    //点击类型
    e_PlayerClickType: {
        Non: 0,
        RoleClick: 1,
        BuildClick: 2,
        RoleSelectClick: 3,
        RoleTarget:4,
    },

    //脚本解释状态
    e_CommandSrcipt: {
        undefined: 0,
        Success: 1,
        Fail: 2,
    },

    e_CommandLevel: {
        Level1:1,
        Level2:2,
        Level3:3,
        Level4:4,
    },

    e_CommandBaseType: {
        RoleMove: 0,
        RoleAttackHarm:1,
        RoleAttacking:2,
        RoleAttack:3,
        RoleDeath:4,
        RoleWait:5,
        Work_Felling:6,
    },
    
    e_CommandType: {
        RoleGoToPos: 0,
        RoleAttackHarm:1,
        RoleAttacking:2,
        RoleAttack:3,
        RoleDeath:4,
        Work_Felling:5,
    },

    e_RoleToRoleType: {
        RoleToRole: 0,
        RoleToBuild:1,
        BuildToBuild:2,
        BuildToRole:3,
    },

    //执行结果状态
    e_CommandResultSrcipt: {
        undefined: 0,
        Success: 1,
        Fail: 2,
        Continue: 3,
    },

    //角色检测类别
    e_RoleTargetCheck: {
        RoleAttack: 0,
    },

    //执行结果状态
    e_RoleTargetCheckResult: {
        undefined: 0,
        Success: 1,
        Is_Self: 2,
        Src_Is_Death: 3,
        Tar_Is_Death: 4,
    },

    //角色攻击类型
    e_RoleAttackType: {
        left_hand: 0,
        right_hand: 1,
        Skill_1: 2,
        Skill_2: 3,
    },

    //游戏状态枚举
    e_GameStage: {
        Run: 0,
        Stop: 1,
        Exit: 2,
    },

    e_MapTilePixel: {
        width: 64,
        height: 64,
    },

    e_MapSizeType1: {
        width: 32,
        height: 32,
    },

    e_MapTilePixel: {   //游戏状态枚举
        width: 32,
        height: 32,
    },

    e_ObjType: {
        MapTileLand: 1,
        MapTileResFlower1: 2,
        MapTileFlower: 3,
        MapTileResTree1: 4,
        MapTileTree: 5,
    },

    e_PublicVal: {
        iRandomMax: 100,
    },

    e_FindWayType: {
        Move: 0,
        Near: 1,
        Range: 2,
        Felling: 3,
    },

    //地形通行
    e_RolePassStatu: {
        nopass: 0,
        land: 1,
        pass: 2,
    },

    //游戏种族类型
    e_RoleRaceType: {
        Human: 0,
    },

    //角色职业类型
    e_RoleOccupationType: {
        All:0,
        Warrior: 1,
        Worker: 2,
    },

     //角色技能
     e_WorkSkillType: {
        Mining: 0,
        Woodcutter: 1,
        Farming: 2,
    },

    e_RoleAction: {
        def: 0,
        walk: 1,
        run: 2,
        jump: 3,
        attack: 4,
        Work_Felling: 5,
    },

    e_RoleSpeed: {
        fps: 1,
        scpfps: 10,
    },

    e_SpriteActionName: {
        def: 0,
        walk: 1,
        run: 2,
        jump: 3,
    },

    e_SpriteActionDirection: {
        top: 0,
        dwon: 1,
        left: 2,
        right: 3,
    },

    e_SpriteActionRunStage: {
        play: 0,
        stop: 1,
    },

    e_SpriteType: {
        img: 0,
        spine: 1,
        model: 2
    },

    e_SceneSize: {
        width: 960,
    },

    //选取状态
    e_SelectStaus: {
        NonSelect: 0,
        SingleRole: 1,
        MultiRole: 2,
        GroupRole: 3,
        Build: 4,
    },

    // e_MapTilePassLand: {
    //     land: 0,
    // },

    e_ButtonCommand: {
        def: 0,
        ClosePage: 1,
        CloseMenu: 2,
        CallRoleItemPage:3,
        CallRoleAndShopTradePage:4,
        CallInputValuePage:5,
        CallMainMenu:6,
        InputNumber0:10,
        InputNumber1:11,
        InputNumber2:12,
        InputNumber3:13,
        InputNumber4:14,
        InputNumber5:15,
        InputNumber6:16,
        InputNumber7:17,
        InputNumber8:18,
        InputNumber9:19,
        CallRoleStatePage:21,
    },

    e_BarType:
    {
        ItemBar:0,
        EquipBar:1,
        ShopStoreBar:2,
    },
    
    e_ClickType:{
        LeftDown: 0,
        RightDown: 1,
        LeftMove: 2,
        RightMove: 3,
        LeftUp: 4,
        RightUp: 5,
        Move:6
    },

    s_ObjInfo:function (_type,_level,_obj)  //节点对象
    {
        var ObjInfo = {};
        ObjInfo.type = _type;
        ObjInfo.level = _level;
        //ObjInfo.number = _number;
        ObjInfo.obj = _obj;
        return ObjInfo;
    },

    e_ItemName: { //物品名字
        Gold:100,
        Wood_Material:111,
        Sword1:1001,
    },

    e_ItemClass: { //物品类型
        Non: 0,
        RoleEquip: 1,
        Item: 2,
        Medicant: 3,
        Gold: 4,
        Material: 5,
    },

     e_ItemType:
    {
        Non:0,
        Sword:1,
        BigSword:2,
        Dagger:3,
        Wand:4,
        MagicWand:5,
        Bow:6,
    },

    e_EquipType:
    {
        Head:0,
        Body:1,
        Hand:2,
        Foot:3,
        Shield:4,
        Ring:5,
        Jewelry:6,
        //Weapon:8,
        //RWeapon:9,
    },

    e_EquipRoleType:
    {
        All:0,
        Body:1,
    },

    e_EquipAdditionalType:
    {
        Non:0,
        Fire:1,
    },
    
    e_UserControlType:{
        Non:0,
        BuildPlace:1,
        Work_Felling:2,
    },
    e_ControlState:{
        Non:0,
        MouseLeft:1,
        MouseLeftNoMove:2,
        MouseLeftMove:3,
        MouseRight:4,
        MouseRightNoMove:5,
        MouseRightMove:6,
    },

    e_BaseObjType:{
        Role:0,
        Build:1,
        MaptileAdditional:2,
    },
    //物资资源类型
    e_MaterialsType:{
        Wood:0,
        Iron_Ore:1,
        Wheat:2,
    },
    
    e_SpriteResType:{
        Role:0,
        Build:1
    },
    

    e_PickType:{
        BagItem:0
    },

    e_PagePickObjType:{
        PickItem:0
    },

    e_RoleCommandType:{
        Command:0,
        Command1:1,
        Command2:2,
        Passive:3
    },

    e_CommandTaskType:{
        RoleAttackRole:1,
        Work_Felling:2,
    },

    e_CommandTaskValueType:{
        AttackRoleValue:1,
        GetItemValue:2,
    },

    e_CommandTaskState:{
        Stop:0,
        Start:1,
        Gain:2,
        End:3,
        Fail:4,
    },

    e_CommandTaskValueName:{
        RoleHp:1,
        Wood:2,
    },

    e_Demand:{
        Not:0,
        Work_Felling:201,
        AttackRole:301,
    },

    //角色技能
    s_WorkSkillType: function (v_Skill_Name,v_LEVEL,v_Attribute){
        let WorkSkill = {};
        WorkSkill.Skill_Name = v_Skill_Name;
        WorkSkill.LEVEL = v_LEVEL;
        WorkSkill.Attribute = v_Attribute;
        WorkSkill.Exp = 0;
        WorkSkill.Count = 0;
        return WorkSkill;
    },

    //物资资源数据
    s_MaterialData: function (v_Name,v_TotalValue,v_NowValue,v_Level,v_Difficulty,v_Growth,v_Tech,v_ProgressCount){
        let MaterialData = {};
        MaterialData.Name = v_Name;
        MaterialData.TotalValue = v_TotalValue;
        MaterialData.NowValue = v_NowValue;
        MaterialData.Level = v_Level;
        MaterialData.Difficulty = v_Difficulty;
        MaterialData.Growth = v_Growth;
        MaterialData.Tech = v_Tech;
        MaterialData.ProgressCount = v_ProgressCount;
        return MaterialData;
    },
    

    s_EquipUsageValue: function (_LEVEL, _STR, _CON, _DEX, _INT, _MEN, _LUK)//装备需求
    {
        var EquipUsageValue = {};
        EquipUsageValue.LEVEL = _LEVEL;
        EquipUsageValue.STR = _STR;
        EquipUsageValue.CON = _CON;
        EquipUsageValue.DEX = _DEX;
        EquipUsageValue.INT = _INT;
        EquipUsageValue.MEN = _MEN;
        EquipUsageValue.LUK = _LUK;
        return EquipUsageValue;
    },

    s_EquipIncreaseValue: function (_Att, _Def, _Hp, _Mp, _STR, _CON, _DEX, _INT, _MEN, _LUK, _Skill, _Type)//装备需求
    {
        var EquipIncreaseValue = {};
        EquipIncreaseValue.Att = _Att;
        EquipIncreaseValue.Def = _Def;
        EquipIncreaseValue.Hp = _Hp;
        EquipIncreaseValue.Mp = _Mp;
        EquipIncreaseValue.STR = _STR;
        EquipIncreaseValue.CON = _CON;
        EquipIncreaseValue.DEX = _DEX;
        EquipIncreaseValue.INT = _INT;
        EquipIncreaseValue.MEN = _MEN;
        EquipIncreaseValue.LUK = _LUK;
        EquipIncreaseValue.Skill = _Skill;
        EquipIncreaseValue.Type = _Type;
        return EquipIncreaseValue;
    },

    s_Item: function (_Name,_ItemName, _Describe, _ImgName, _ItemType, _WeaponType,_EquipType, _Value, _Weight, _UseBout, _Plural,_EquipUsageValue,_EquipIncreaseValue,_OccupationRestrict)  //节点对象
    {
        var Item = {};
        Item.Name = _Name;
        Item.ItemName = _ItemName;
        Item.Describe = _Describe;
        Item.ImgName = _ImgName;
        Item.ItemNum = 1;
        Item.ItemType = _ItemType;
        Item.WeaponType = _WeaponType;
        Item.EquipType = _EquipType;
        Item.Value = _Value;
        Item.Weight = _Weight;
        Item.UseBout = _UseBout;//消耗品
        Item.Plural = _Plural; //复数
        Item.EquipUsageValue = _EquipUsageValue;
        Item.EquipIncreaseValue = _EquipIncreaseValue;
        Item.IsEquip = false;
        Item.OccupationRestrict = _OccupationRestrict;
        return Item;
    }, 

    s_RolePowerValue: function (v_p_Attack, v_p_Defense, v_p_skill, v_s_Attack, v_s_Defense, v_s_Skill, v_Attach)//装备需求
    {
        var RolePowerValue = {};
        RolePowerValue.p_Attack = v_p_Attack;
        RolePowerValue.p_Defense = v_p_Defense;
        RolePowerValue.p_skill = v_p_skill;
        RolePowerValue.s_Attack = v_s_Attack;
        RolePowerValue.s_Defense = v_s_Defense;
        RolePowerValue.s_Skill = v_s_Skill;
        RolePowerValue.Attach = v_Attach; //附带伤害
        return RolePowerValue;
    },

    s_RoleValueAlter: function (v_Hp, v_Mp)//数值变化
    {
        var RoleValueAlter = {};
        RoleValueAlter.Hp = v_Hp;
        RoleValueAlter.Mp = v_Mp;
        return RoleValueAlter;
    },

    s_Health: function (v_Satiety, v_Water, v_Energy, v_Endurance, v_Interest, v_Strong, v_Social)//身体数值
    {
        var Health = {};
        Health.Satiety = v_Satiety;  //食物
        Health.Water = v_Water;      //水
        Health.Energy = v_Energy;    //精力
        Health.Endurance = v_Endurance;//耐力
        Health.Interest = v_Interest;  //心情
        Health.Strong = v_Strong;     //体貌
        Health.Social = v_Social;     //社交
        return Health;
    },

    s_ItemCopy: function (Item)  //节点对象
    {
        return this.s_Item(Item.Name,Item.ItemName,Item.Describe,Item.ImgName,Item.ItemType,Item.WeaponType,Item.EquipType,Item.Value,Item.Weight,Item.UseBout,Item.Plural,Item.EquipUsageValue,Item.EquipIncreaseValue,Item.OccupationRestrict);
    },
    
    PickObj:function (_PickType,_PickNum)
    {
        var Pick = {};
        Pick.PickType = _PickType;
        Pick.PickNum = _PickNum;
        return Pick;
    },

    s_UserPicklObj:function (v_Num, v_Size, v_Type)
    {
        var UserPicklObj = {};
        UserPicklObj.Num = v_Num;
        UserPicklObj.Size = v_Size;
        UserPicklObj.Type = v_Type;
        return UserPicklObj;
    },

    g_resources1 : [
        {FileName:"Cursor01",LoadDone:false,FileData:false},
        {FileName:"close",LoadDone:false,FileData:false},
        {FileName:"StatePage",LoadDone:false,FileData:false},
        {FileName:"Itemimage000",LoadDone:false,FileData:false},
        {FileName:"Itemimage001",LoadDone:false,FileData:false},
        {FileName:"Itemimage002",LoadDone:false,FileData:false},
        {FileName:"maptile003",LoadDone:false,FileData:false},
    ],

    g_resources3d1 : [
        {FileName:"Role001",LoadDone:false,FileData:false},
        {FileName:"MapTiledSprite003",LoadDone:false,FileData:false},
    ],

    g_resources2DMapTile : [
        {FileName:"14",LoadDone:false,FileData:false},
        {FileName:"001",LoadDone:false,FileData:false},
        {FileName:"1001",LoadDone:false,FileData:false},
        {FileName:"1101",LoadDone:false,FileData:false},
        {FileName:"2",LoadDone:false,FileData:false},
        {FileName:"3",LoadDone:false,FileData:false},
        {FileName:"4",LoadDone:false,FileData:false},
        {FileName:"5",LoadDone:false,FileData:false},
        {FileName:"9",LoadDone:false,FileData:false},
        {FileName:"tree101",LoadDone:false,FileData:false},
        {FileName:"zhu01",LoadDone:false,FileData:false},
        {FileName:"zhu02",LoadDone:false,FileData:false},
        {FileName:"zhu03",LoadDone:false,FileData:false},
        {FileName:"grass2",LoadDone:false,FileData:false},
    ],

    g_resourcesSpineboy : [
        {FileName:"spineboy",LoadDone:false,FileData:false,Loading:false},
    ],

    g_resourcesBuilding : [
        {FileName:"4",LoadDone:false,FileData:false},
    ],

    g_GameDate : null,
    g_GameLastTime : null,
    g_GameTimeDt : null,

    g_GameRandom : null,
    g_GameManger : null,
    g_GamePageManager : null,
    g_GameMenuManager : null,
    g_GameDataResManger : null,
    g_ItemManager : null,
    g_MainCamera:null,
    g_UiCamera:null,
    g_TipPage:null,
    g_ShopManager:null,
    g_GameRunUi:null,
    g_BuildManager:null,
    g_Build:null,
    
    g_UserPicklObj : null,
    g_Cursor : false,
    g_GameResLoadFinish:false,
    g_ButtonUsingFlag:false,
    g_ButtonType:null,
    g_PlayerClickType : null,

    g_DrawRect : null,

    RoleNum : 0,
    BuildNum : 100000,
}


module.exports = G_Public;
//module.exports.public = G_Public;
//module.exports.GameDataResManger = g_GameDataResManger;
//module.exports.GameManger = g_GameManger;
//module.exports.GamePageManager = g_GamePageManager;