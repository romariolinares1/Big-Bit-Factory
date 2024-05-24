// Romario Linares
// Created: 5/20/2024
// Phaser: 3.70.0
//
// Big Bit Factory
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets:
// https://kenney.nl/assets/1-bit-platformer-pack 
// https://kenney.nl/assets/impact-sounds 
// https://kenney.nl/assets/interface-sounds 

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 1920,
    height: 640,
    
    scene: [Load, Platformer, GameOver, Win]
}

var cursors;
const SCALE = 1.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);