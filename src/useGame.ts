import {computed, ref} from "vue";
import {_storeGame} from "./gameStore";


export type PlayerIndex = number;


export type TileActionId = string;


type TileAction = {
    id: TileActionId,
    name: string, // napr. pujcka 5000,-
    numbersToRoll: string;// napr. 2-5 nebo 1
}

type GameTileData = {
    name: string;
    actionName: string;
    tileActions: Array<TileAction>
    tileJobName: string,
}



export function useGame() {

   const storeGame = _storeGame();


   const dice = computed(() => {
       return storeGame._state.dice;
   })

    function waitForDiceRolling(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            storeGame._state.gameState = 'WAITFORDICEROLLING';
            setTimeout(() => {
                storeGame._state.dice.diceRolling = false;
                storeGame._state.dice.rolledNumber = Math.floor(6 * Math.random()) + 1;
                storeGame._state.dice.rolledAt = Date.now();
                resolve(storeGame._state.dice.rolledNumber);
            }, Math.floor(700 * Math.random()) + 500)
        })
    }

    function rollDice(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            storeGame._state.dice.diceRolling = true;
            setTimeout(() => {
                storeGame._state.dice.diceRolling = false;
                storeGame._state.dice.rolledNumber = Math.floor(6 * Math.random()) + 1;
                storeGame._state.dice.rolledAt = Date.now();
                resolve(storeGame._state.dice.rolledNumber);
            }, Math.floor(700 * Math.random()) + 500)
        })
    }

    const board = computed(() => {
        return storeGame._state.board;
    })

    const currentPlayerIndex = computed<PlayerIndex>(() => {
        return storeGame._state.currentPlayerIndex;
    })

    const players = computed(() => {
        return storeGame._state.players;
    })

    const diceRoledNumber = computed(() => {
        return storeGame._state.dice.rolledNumber;
    })

    const gameTileList = computed<Array<GameTileData>>(() => {
        return storeGame._state.board.gameTiles;
    })

    function addMoneyToCurrentPLayer(addMoneyCarried: number = 0, addMoneyHome: number = 0) {
        storeGame._state.players[storeGame._state.currentPlayerIndex].moneyCarried += addMoneyCarried
        storeGame._state.players[storeGame._state.currentPlayerIndex].moneyHome += addMoneyHome
    }

    function startNextPlayerTurn() {
        storeGame._state.currentPlayerIndex = (storeGame._state.currentPlayerIndex + 1) % storeGame._state.players.length;
    }

    function moveCurrentPlayer(tilesCount: number) {
        const currentTileIndex = storeGame._state.players[storeGame._state.currentPlayerIndex].tileIndex;
        storeGame._state.players[storeGame._state.currentPlayerIndex].tileIndex = (currentTileIndex + tilesCount) % storeGame._state.board.gameTiles.length;
    }

    function setCurrentPlayerCanRollToMove(canRole: boolean) {
        storeGame._state.playerCanRoleToMove = canRole;
    }

    function initializeGame(){

    }

    return {
        rollDice: rollDice,
        gameTileList: gameTileList,
        dice: dice,
        initializeGame: initializeGame,
        currentPlayerIndex: currentPlayerIndex,
        addMoneyToCurrentPLayer: addMoneyToCurrentPLayer,
        board: board,
        diceRoledNumber: diceRoledNumber,
        players: players,
        startNextPlayerTurn: startNextPlayerTurn,
        setCurrentPlayerCanRollToMove: setCurrentPlayerCanRollToMove,
        moveCurrentPlayer: moveCurrentPlayer,
        waitForDiceRolling: waitForDiceRolling,
    }


}
