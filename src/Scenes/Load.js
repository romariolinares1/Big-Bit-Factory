class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        // character
        this.load.image("character", "tile_0260.png");
        this.load.image("walk1", "tile_0261.png");
        this.load.image("walk2", "tile_0262.png");
        this.load.image("walk3", "tile_0263.png");
        this.load.image("jumping", "tile_0264.png");

        // level tilemap
        this.load.image("tilemap_tiles", "monochrome_tilemap_transparent_packed.png"); 
        this.load.tilemapTiledJSON("platform_level", "platform_level.tmj");
        this.load.spritesheet("tilemap_sheet", "monochrome_tilemap_transparent_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        // particles
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        // audio
        this.load.audio("walkSound", "footstep_concrete_002.ogg");
        this.load.audio("jumpSound", "drop_004.ogg");
        this.load.audio("loseSound", "jingles_NES07.ogg");
        this.load.audio("coinSound", "select_008.ogg");
        this.load.audio("keyGet", "jingles_NES12.ogg");
        this.load.audio("music", "8bit Dungeon Level.mp3");
        this.load.audio("background", "factory.mp3");
    }

    create() {
        this.anims.create({
            key: "walk",
            frames: [
                { key: "walk1" },
                { key: "walk2" },
                { key: "walk3" },
            ],
            frameRate: 15,
            repeat: 5,
        });

        this.anims.create({
            key: "idle",
            frames: [
                { key: "character" },
            ]
        });

        this.anims.create({
            key: "jump",
            frames: [
                { key: "jumping" },
            ]
        });

        this.scene.start("platformerScene");
        console.log("platform scene loaded");
    }

    update() {
    }
}