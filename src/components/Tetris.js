import React, { useState,useEffect } from 'react';
import Sound from 'react-sound';

// import helper functions
import {checkCollision, createStage} from '../gameHelpers';

//import styled components
import { StyledTetrisWrapper,StyledTetris } from './styles/StyledTetris';

//import custom hooks
import { useInterval } from '../hooks/useInterval';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useGameStatus } from '../hooks/useGameStatus';

//import Components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';

//import bgm
import { Bgm } from './Bgm';
import gameOverBgm from '../bgm/gameover.wav';
import hardDrop from '../bgm/harddrop.wav';

const Tetris =()=>{
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);

    const [player, updatePlayerPos,resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage,rowsCleared]= useStage(player,resetPlayer);
    const [score, setScore, rows,setRows,level, setLevel] = useGameStatus(rowsCleared);

    // const audio =new Audio(bgm);
    const gameOverSound = new Audio(gameOverBgm);
    const hardDropSound = new Audio(hardDrop);
    // const [isPlaying, setIsPlaying] = useState(false);

    const movePlayer = dir =>{
        if(!checkCollision(player, stage, {x:dir,y:0})){
            // console.log('move the block');
            updatePlayerPos({x:dir, y:0, collided:false});
        }

    }
    const playBgm =()=>{
        // audio.loop = true;
        // audio.play();        
        Bgm.gameStart.play();
    }
    const pauseBgm =()=>{
        Bgm.gameStart.pause();
    }
    const startGame = () =>{
        setGameStart(!gameStart); 
    }

    const drop =() =>{
        //increase level for every 10 rows cleared
        if( rows > (level+1)*10){
            setLevel(prev=> prev+1);
            //increase the speed as the level increase
            setDropTime(1000/(level+1)+200);
        }
        //console.log (!checkCollision(player,stage,{x:0,y:1})); this 
        if(!checkCollision(player,stage,{x:0, y:1})){            
            updatePlayerPos({x:0, y:1, collided: false});
        }
        else{
            //game over
            if(player.pos.y < 1){
                console.log('game over!');
                Bgm.gameStart.pause();
                Bgm.gameOver.play();
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({x:0, y:0, collided:true});
        }
    }

    const keyUp =({keyCode})=>{
        if(!gameOver){
            if(keyCode ===40 || keyCode===32){
                // setDropTime(level === 0? 1000: 1000/(level+1)+200);
               setDropTime(1000/(level+1)+200);
            }
        }
    }

    //this function drop the the tetromino piece
    const dropPiece=()=>{
        setDropTime(null);
        drop();        
    }
    const checkHardDrop=(keyCode)=>{
        if (keyCode){
            setDropTime(null);
            let row =1;        
            while(checkCollision(player,stage,{x:0, y:row})===false){      
                row+=1;
            }                  
            updatePlayerPos({x:0, y:row-1, collided: true});
        }
        else{
            //cast shadow if 
        }

    }

    const move =(e)=> {
        if( gameStart && !gameOver){
            if(e.keyCode===37){
                movePlayer(-1);                
            }
            else if (e.keyCode ===39){
                movePlayer(1);
            }
            else if (e.keyCode ===40){
                dropPiece();
            }
            else if (e.keyCode=== 38 || e.keyCode ===88){
                playerRotate(stage,1);
            }
            else if (e.keyCode === 32){
                e.preventDefault();
                hardDropSound.play();
                checkHardDrop(32);
               
            }
        }
    }
    useInterval(() => {
        drop();
    }, dropTime)

    useEffect(()=>{
        if(gameStart){
            console.log(gameStarted);
            if(gameOver || !gameStarted ){
                setStage(createStage());
                resetPlayer();
                setGameOver(false);
                setScore(0);
                setLevel(0);
                setRows(0);
            }
            playBgm();
            setDropTime(1000);
            setGameStarted(true);
        }
        else{
            pauseBgm();
            setDropTime(null);
        }
    },[gameStart])
    return (
        <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e=>move(e)} onKeyUp={keyUp}>
            <StyledTetris>
                <Stage stage={stage}/>
                <aside>
                    { gameOver?(
                        <Display gameOver={gameOver} text="Game Over"/>
                    ):(       
                        <div>
                        <Display text={`Score: ${score}`}/>
                        <Display text={`Row: ${rows}`}/>
                        <Display text={`Level: ${level}`}/>
                        </div>
                        )

                    }    
                    <StartButton callback={startGame}/>
                </aside>
            </StyledTetris>
            {/* <Sound
                url={bgm}
                playStatus={Sound.status.PLAYING}
                playFromPosition={300}
            /> */}
        </StyledTetrisWrapper>
    )
}

export default Tetris;