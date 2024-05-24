class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 450;
        this.DRAG = 2500;    
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -450;
        this.PARTICLE_VELOCITY = 20;
        this.walking = false;
        this.footstepSound;
        this.unlockedDoor = false;
    }

    create() {
        this.game.sound.stopAll();
        // music and background
        let music = this.sound.add("music");
        music.play( {
            volume: 0.3,
            loop: true
        });
        let background = this.sound.add("background");
        background.play({
            volume: 0.6,
            loop: true
        })
        // 16x16 120 tiles wide and 40 tiles tall.
        this.map = this.add.tilemap("platform_level", 16, 16, 120, 40);
        this.tileset = this.map.addTilesetImage("monochrome_tilemap_transparent_packed", "tilemap_tiles");

        // ground layer
        this.groundLayer = this.map.createLayer("Grounds-n-Platforms", this.tileset, 0, 0);
        // spike layer
        this.spikeLayer = this.map.createLayer("Spikes", this.tileset, 0, 0);
        // background layer
        this.backgroundLayer = this.map.createLayer("Pipes-n-Backgrounds", this.tileset, 0, 0);

        // character
        my.sprite.player = this.physics.add.sprite(40, 500, "character").setScale(SCALE)
        my.sprite.player.setCollideWorldBounds(true);

        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.spikeLayer, () => {
            this.scene.restart();
            this.scene.start("gameOver");
        });
        this.physics.add.collider(my.sprite.player, this.lockLayer);

        // collision
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.spikeLayer.setCollisionByProperty({
            collides: true
        });

        // creating locked door
        this.lockedDoor = this.map.createFromObjects("Lock-Door", {
            name: "door",
            key: "tilemap_sheet",
            frame: 56
        });

        // creating fans
        this.fans = this.map.createFromObjects("Fans-Layer", {
            name: "fans",
            key: "tilemap_sheet",
            frame: 369,
        })

        // fan animation
        this.tweens.add({
            targets: this.fans,
            angle: 360,
            duration: 1000,
            ease: "Linear",
            repeat: -1
        });

        // locked door collision and sprite change
        this.physics.world.enable(this.lockedDoor, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.add.overlap(my.sprite.player, this.lockedDoor, (obj1, obj2) => {
            if(this.unlockedDoor == true) {
                this.scene.restart();
                this.scene.start("win"); 
            }
        });

        // creating coins
        this.coins = this.map.createFromObjects("Coin-Layer", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 1
        });

        // coin animation
        this.tweens.add({
            targets: this.coins,
            y: "-=5",
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });

        // coin collision
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            this.sound.play("coinSound");
            obj2.destroy(); 
        });

        // creating key
        this.key = this.map.createFromObjects("Key-Layer", {
            name: "key",
            key: "tilemap_sheet",
            frame: 96
        });

        // key animation
        this.tweens.add({
            targets: this.key,
            y: "-=5",
            duration: 1000,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });

        // key collision
        this.physics.world.enable(this.key, Phaser.Physics.Arcade.STATIC_BODY);
        this.keyGroup = this.add.group(this.key);

        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            this.sound.play("keyGet");
            this.unlockedDoor = true;
            obj2.destroy(); 
        });

        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // cursor key inputs
        cursors = this.input.keyboard.createCursorKeys();

        // camera
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); 
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(2.5);

        // walking particle
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ["spark_02.png", "spark_03.png", "spark_04.png"],
            scale: {start: 0.03, end: 0.04},
            random: true,
            lifespan: 400,
            maxAliveParticles: 10,
            alpha: {start: 1, end: 0.1},
            gravityY: -100
        });

        my.vfx.walking.stop();

        this.footstepSound = this.sound.add("walkSound");
    }

    update() {
        let isMoving = false;
        // move left
        if(cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play("walk", true);

            isMoving = true;

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 1);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }


        } else if(cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play("walk", true);

            isMoving = true;

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play("idle");
            my.vfx.walking.stop();
        }

        if (isMoving && !this.walking) {
            this.footstepSound.play({
                loop: true,
                volume: 0.4
            });
            this.walking = true;
        } else if(!isMoving && this.walking) {
            this.footstepSound.stop();
            this.walking = false;
        }

        // jump
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play("jump");
            this.footstepSound.stop();
            this.walking = false;
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpSound", {
                volume: 0.7
            });
        }
    }
}