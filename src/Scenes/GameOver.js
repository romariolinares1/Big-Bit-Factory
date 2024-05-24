class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");

        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
    }

    create() {
        let my = this.my;
        this.sound.play("loseSound");
        this.add.text(10, 5, "Game Over!", {
            fontFamily: 'Times, serif',
            fontSize: 50,
            wordWrap: {
                width: 60
            }
        });

        const button = this.add.text(20, 200, "Start Over", { fill: '#0f0', fontSize: 30 })
            .setInteractive()
            .on("pointerdown", () => this.scene.start("loadScene"));
    }

    update() {
        let my = this.my;
    }
}