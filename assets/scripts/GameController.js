
var UIController = require("UIController");

var GameController = cc.Class({
    extends: cc.Component,

    properties: {
        listImage: {
            default: [],
            type: cc.SpriteFrame
        },

        square: {
            default: null,
            type: cc.Prefab
        },

        listSquare: {
            default: [],
            type: cc.Prefab
        },

        tmpSquare: {
            default: null,
            type: cc.Prefab
        },

        score: 0,
        canPlay: true


    },

    statics: {
        instance: null
    },

    onLoad() {
        GameController.instance = this;
        this.score = 0;
    },


    initLevel: function () {
        let index = 0;
        if (UIController)
            UIController.instance.hidePlayButton();

        let typeCreate = 0;
        let action1 = cc.delayTime(0.1);
        let action2 = cc.callFunc(() => {
            index++;
            this.createSquare(index, typeCreate, this.listImage[typeCreate]);
        }, this);
        let action3 = cc.callFunc(() => {
            index++;
            this.createSquare(index, typeCreate, this.listImage[typeCreate]);
            typeCreate++;
        }, this);

        this.node.runAction(cc.sequence(
            cc.repeat(cc.sequence(action1, action2, action3), this.listImage.length),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.setUpPositionSquares();
            })
        )
        );
    },

    setUpPositionSquares() {
        let maxRow = 4;
        let maxCol = 5;
        let index = 0;
        // this.listSquare = this.listSquare.sort(() => Math.random() - 0.5);
        for (let row = 0; row < maxRow; row++) {
            for (let col = 0; col < maxCol; col++) {

                let x = - 130 + (col * 64);
                let y = 150 + (-row * 64);

                let square = this.listSquare[index];
                let moveAction = cc.moveTo(1, x, y).easing(cc.easeBackInOut());
                let sequence = cc.sequence(
                    cc.delayTime(0.1 * index),
                    moveAction,
                );
                square.runAction(sequence);
                index++;
            }
        }
    },

    createSquare(index, type, spriteFrame) {
        let square = cc.instantiate(this.square);
        square.parent = this.node;
        // index++;
        square.emit("INIT_INFO", index, type, spriteFrame);
        square.setPosition(0, -130, 0);
        this.listSquare.push(square);
    },

    radomInteger: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    },

    //4
    randomElementInArray: function (arr) {
        let index = radomInteger(0, arr.length - 1);
        return arr[index];
    },


    getTmpSquare() {
        return this.tmpSquare;
    },

    setTmpSquare(square) {
        this.tmpSquare = square;
    },

    clearTmpSquare() {
        this.tmpSquare = null;
    },

    removeSquare(square) {
        let index = this.listSquare.indexOf(square);
        this.listSquare.splice(index, 1);
        this.setCanPlay(true);
    },

    checkWinGame() {
        if (this.listSquare.length > 0)
            return;
        if (UIController)
            UIController.instance.showVictory();
    },

    countScore() {
        let action1 = cc.delayTime(0.1);
        let action2 = cc.callFunc(() => {
            this.score += 1;
            this.setScore();
        }, this);
        this.node.runAction(cc.repeat(cc.sequence(action1, action2), 10));
    },

    setScore() {
        if (UIController)
            UIController.instance.showScore(this.score);
    },

    playAgain() {
        if (UIController)
            UIController.instance.hideUIplayAgain();
        this.initLevel();
    },

    setCanPlay(canPlay) {
        this.canPlay = canPlay;
    },

    isCanPlay() {
        return this.canPlay;
    }

});
