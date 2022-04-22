// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var GameController = require("GameController");

cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        type: 0,

        labelIndex: {
            default : null,
            type: cc.Label
        },
        labelType: {
            default : null,
            type: cc.Label
        },
        defaultSprite: {
            default: null,
            type: cc.SpriteFrame
        },
        t: {
            default: null,
            type: cc.SpriteFrame
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on("INIT_INFO", this.initInfor, this);
        this.node.on(cc.Node.EventType.TOUCH_START,this.tounchSquare,this);
    },


    initInfor(index, type, Sprite){
        this.index = index;
        this.type = type;
        this.spriteOpen = Sprite;

        this.labelIndex.string = index;
        this.labelType.string = type;

    },

    tounchSquare(){
        if(!GameController.instance.isCanPlay())
            return;
        cc.log("can play: " + GameController.instance.isCanPlay());

        let tempSquare = GameController.instance.getTmpSquare();
        if(!tempSquare){
            this.openSquare();
            GameController.instance.setTmpSquare(this);
        }
        else{
            let tempType = tempSquare.getType();

            if(tempSquare != this){
                let sequence = cc.sequence(
                    cc.callFunc(()=>{
                        this.openSquare();
                    }),
                    cc.delayTime(1),
                    cc.callFunc(()=>{
                        if(tempType === this.getType()){
                            this.matchSquare();
                            tempSquare.matchSquare();
                            GameController.instance.countScore();
                            GameController.instance.checkWinGame();
                            GameController.instance.setCanPlay(false);
                        }
                        else{
                            this.resetSquare();
                            tempSquare.resetSquare();
                            GameController.instance.clearTmpSquare();
                        }
                    })
                )
                this.node.runAction(sequence);
            }
        }
    },


    openSquare(){
        let scaleIn = cc.scaleTo(0.3,0,1);
        let scaleOut = cc.scaleTo(0.3,1,1);
        let sequence = cc.sequence(
                scaleIn,
                cc.callFunc(()=>{
                    this.node.getComponent(cc.Sprite).spriteFrame = this.spriteOpen;                    
                }),
                scaleOut);
        this.node.runAction(sequence);
    },

    resetSquare(){
        GameController.instance.setCanPlay(true);
        let scaleIn = cc.scaleTo(0.3,0,1);
        let scaleOut = cc.scaleTo(0.3,1,1);
        let sequence = cc.sequence(
                scaleIn,
                cc.callFunc(()=>{
                    this.node.getComponent(cc.Sprite).spriteFrame = this.defaultSprite;                    
                }),
                scaleOut);
        this.node.runAction(sequence);
    },

    matchSquare(){
        this.node.zIndex = 1;
        let scaleIn = cc.scaleTo(0.3,2,2);
        let sequence = cc.sequence(
                        scaleIn,
                        cc.callFunc(()=>{
                            this.node.removeFromParent(true);
                            GameController.instance.clearTmpSquare();
                            GameController.instance.checkWinGame();
                            GameController.instance.setCanPlay(true);
                        })
        );

        this.node.runAction(sequence);
        GameController.instance.removeSquare(this);
    },

    getType(){
        return this.type;
    },

    getIndex(){
        return this.index;
    }
});
