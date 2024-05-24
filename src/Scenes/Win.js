class Win extends Phaser.Scene {
    constructor() {
        super("win");

        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.load.setPath("./assets/");
    }

    create() {
        let my = this.my;
        this.add.text(10, 5, "You Escaped!", {
            fontFamily: 'Times, serif',
            fontSize: 50,
            wordWrap: {
                width: 60
            }
        });

        const button = this.add.text(20, 200, "Play Again?", { fill: '#0f0', fontSize: 30 })
            .setInteractive()
            .on("pointerdown", () => this.scene.start("loadScene"));
    }

    update() {
        let my = this.my;
    }
}