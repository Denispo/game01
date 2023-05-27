import {defineStore} from "pinia";
import {computed, readonly, ref} from "vue";

type Player = {
    name:string,
    strength:number,
    inteligence:number,
    age:number,
    deathAge:number,
    moneyHome:number,
    moneyCarried:number,
    tileIndex:number, // na jakem policku stoji
}

type TileKind = 'BANK' | 'NIGHTCLUB' | 'PRISON' | 'HOSPITAL';

type GameTile = {
    tileKind:TileKind;
}

type GameBoard = {
    gameTiles:Array<GameTile>
}

type PlayerState = 'ROLLDICETOMOVE' | 'WAITFORACTION';

type GameState = {
    month:number, // 1=leden atd.
    currentPlayerIndex:number, // index hrace v Array<Player>
    currentPlayerState:PlayerState;
}

type Store = {
    gameState:GameState,
    players:Array<Player>,
    board:GameBoard,
    diceRoledNumber:number,
}

export const useGameStore = defineStore('gameStore',()=>{

    const store = ref<Store>({
        board:{gameTiles:[]},
        gameState:{month:1,currentPlayerIndex:0,currentPlayerState:"ROLLDICETOMOVE"},
        players:[],
        diceRoledNumber:1
    })

    function restartGame(){
        store.value.board.gameTiles = [{tileKind:'BANK'}, {tileKind:'NIGHTCLUB'}, {tileKind:'PRISON'}, {tileKind:'HOSPITAL'}]
        store.value.players = [
            {age:30,deathAge:50,inteligence:5,moneyCarried:1000,moneyHome:0,name:'Player 1',strength:1,tileIndex:0},
            {age:30,deathAge:50,inteligence:1,moneyCarried:1000,moneyHome:0,name:'Player 2',strength:1,tileIndex:0}
        ];
        store.value.gameState = {month:1,currentPlayerIndex:0,currentPlayerState:"WAITFORACTION"}
    }

    restartGame();

    const board = computed(()=>{
        return store.value.board;
    })

    type CurrentPlayer = {player:Player, state:PlayerState};
    const currentPlayer = computed<CurrentPlayer>(()=>{
        return {
            player:store.value.players[store.value.gameState.currentPlayerIndex],
            state:store.value.gameState.currentPlayerState
        }
    })

    const diceRoledNumber = computed(()=>{
        return store.value.diceRoledNumber;
    })

    function roleDice(){
        store.value.diceRoledNumber = Math.floor(6 * Math.random())+1;
    }

    function addMoneyToCurrentPLayer(addMoneyCarried:number = 0, addMoneyHome:number = 0){
        store.value.players[store.value.gameState.currentPlayerIndex].moneyCarried += addMoneyCarried
        store.value.players[store.value.gameState.currentPlayerIndex].moneyHome += addMoneyHome
    }

    return {
        restartGame:restartGame,
        currentPlayer:currentPlayer,
        addMoneyToCurrentPLayer:addMoneyToCurrentPLayer,
        board:board,
        roleDice:roleDice,
        diceRoledNumber:diceRoledNumber,
    }


});
