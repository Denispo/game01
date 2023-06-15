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
    justEnteringNewTile:boolean, // true, pokud prave prisel na nove policko
}

type TileKind = 'BANK' | 'NIGHTCLUB' | 'PRISON' | 'HOSPITAL' | 'DARKSTREET';

type GameTile = {
    tileKind:TileKind;
}

type GameBoard = {
    gameTiles:Array<GameTile>
}

type PlayerState = 'ROLLDICETOMOVE' | 'WAITFORACTION' | 'ROLLDICETOTILEACTION';

type Store = {
    players:Array<Player>,
    board:GameBoard,
    diceRoledNumber:number|undefined,
    month:number, // 1=leden atd.
    currentPlayerIndex:number, // index hrace v Array<Player>
    currentPlayerState:PlayerState;
    playerCanRoleToMove:boolean;
}

export const useGameStore = defineStore('gameStore',()=>{

    const store = ref<Store>({
        board:{gameTiles:[]},
        currentPlayerState:"ROLLDICETOMOVE",
        currentPlayerIndex:0,
        month:1,
        players:[],
        diceRoledNumber:undefined,
        playerCanRoleToMove:true,
    })

    function restartGame(){
        store.value.board.gameTiles = [{tileKind:'BANK'}, {tileKind:'DARKSTREET'}]
        store.value.players = [
            {age:25,deathAge:50,inteligence:2,moneyCarried:2000,moneyHome:8000,name:'Player 1',strength:3,tileIndex:0, justEnteringNewTile:false},
            {age:25,deathAge:50,inteligence:3,moneyCarried:2000,moneyHome:8000,name:'Player 2',strength:2,tileIndex:0, justEnteringNewTile:false}
        ];
        store.value.month = 1;
        store.value.currentPlayerIndex = 0;
        store.value.currentPlayerState = "WAITFORACTION";
    }

    restartGame();

    const board = computed(()=>{
        return store.value.board;
    })

    type CurrentPlayer = {player:Player, state:PlayerState};
    const currentPlayer = computed<CurrentPlayer>(()=>{
        return {
            player:store.value.players[store.value.currentPlayerIndex],
            state:store.value.currentPlayerState
        }
    })

    const diceRoledNumber = computed(()=>{
        return store.value.diceRoledNumber;
    })

    function roleDice(){
        store.value.diceRoledNumber = Math.floor(6 * Math.random())+1;
    }

    function addMoneyToCurrentPLayer(addMoneyCarried:number = 0, addMoneyHome:number = 0){
        store.value.players[store.value.currentPlayerIndex].moneyCarried += addMoneyCarried
        store.value.players[store.value.currentPlayerIndex].moneyHome += addMoneyHome
    }

    function startNextPlayerTurn() {
        store.value.currentPlayerState = 'ROLLDICETOMOVE';
        store.value.currentPlayerIndex = (store.value.currentPlayerIndex + 1) % store.value.players.length;
    }

    function moveCurrentPlayer(tilesCount: number) {
        let tileIndex = store.value.players[store.value.currentPlayerIndex].tileIndex;
        store.value.players[store.value.currentPlayerIndex].tileIndex =(tileIndex + 1) % store.value.board.gameTiles.length;
        store.value.players[store.value.currentPlayerIndex].justEnteringNewTile = true;
    }

    function setCurrentPlayerCanRoleToMove(canRole:boolean) {
        store.value.playerCanRoleToMove = canRole;
    }

    return {
        restartGame:restartGame,
        currentPlayer:currentPlayer,
        addMoneyToCurrentPLayer:addMoneyToCurrentPLayer,
        board:board,
        roleDice:roleDice,
        diceRoledNumber:diceRoledNumber,
        startNextPlayerTurn:startNextPlayerTurn,
        setCurrentPlayerCanRoleToMove:setCurrentPlayerCanRoleToMove,
        moveCurrentPlayer:moveCurrentPlayer,
    }


});
