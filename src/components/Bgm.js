import gameStart  from '../bgm/tetris-battle-music.mp3';
import gameOver from '../bgm/gameover.wav';
import hardDrop from '../bgm/harddrop.wav';
import combo1 from '../bgm/combo1.wav';

export const Bgm = {
    gameStart: new Audio(gameStart),
    gameOver: new Audio(gameOver),
    hardDrop: new Audio(hardDrop),
    combo1: new Audio(combo1),
}