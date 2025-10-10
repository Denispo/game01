import {defineStore} from "pinia";
import {computed, readonly, ref} from "vue";


export type PlayerIndex = number;
export type Player = {
    name: string,
    strength: number,
    inteligence: number,
    age: number,
    deathAge: number,
    moneyHome: number,
    moneyCarried: number,
    tileId: GameTileId, // na jakem policku stoji
    canRollForMove:boolean,
}
export type GameTileId = number;
export type TileActionId = string;
export type JobId = number;
export type GameTileIndex = number;


type TileAction = {
    id: TileActionId,
    name: string, // napr. pujcka 5000,-
    numbersToRoll: string;// napr. 2-5 nebo 1
}

type GameTileData = {
    tileId: GameTileId,
    name: string;
    actionName: string;
    tileActions: Array<TileAction>
    tileJobName: string,
}

type GameBoard = {
    gameTiles: Array<GameTileData>
}

type Dice = {
    diceRolling: boolean,
    rolledNumber: number,
    rolledAt: number, // timestamp, kdy se nastavila hodnota. Aby na to sel udelat watch
}

type GameState = 'IDLE' | 'WAITFORDICEROLLING';

type Store = {
    players: Array<Player>,
    board: GameBoard,
    dice: Dice,
    gameState: GameState;
    month: number, // 1=leden atd.
    currentPlayerIndex: PlayerIndex, // index aktualniho hrace
    playerCanRoleToMove: boolean;
}

export const _storeGame = defineStore('gameStore', () => {

    const state = ref<Store>({
        board: {gameTiles: []},
        currentPlayerIndex: 0,
        month: 1,
        players: [],
        gameState: 'IDLE',
        dice: {diceRolling: false, rolledNumber: 1, rolledAt: 0},
        playerCanRoleToMove: true,
    })

    function restartGame() {
        state.value.board.gameTiles = [
            {
                tileId: 1,
                name: "BANKA",
                tileJobName: "Bankéř INT:5",
                actionName: "Hypotéka",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1"},
                    {id: "addMoney5000", name: "+5000", numbersToRoll: "2-5"},
                    {id: "AddMoney10000", name: "+10000", numbersToRoll: "6"},
                ],
            },
            {
                tileId: 2,
                name: "TEMNÁ ULIČKA",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "attackeByStrong8", name: "Přepadli tě síle 8", numbersToRoll: "1"},
                    {id: "attackeByStrong5", name: "Přepadli tě síle 5", numbersToRoll: "2-3"},
                    {id: "noop", name: "Nic", numbersToRoll: "4-5"},
                    {id: "meetDealer", name: "potkal jsi dealera", numbersToRoll: "6"},
                ],
            },
            {
                tileId: 3,
                name: "Škola",
                tileJobName: "Školník INT:2 STR:2",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
            },
            {
                tileId: 4,
                name: "Nemocnice",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
            },
            {
                tileId: 5,
                name: "Lékárna",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
            }

        ]
        state.value.players = [
            {
                age: 22,
                deathAge: 50,
                inteligence: 2,
                moneyCarried: 2000,
                moneyHome: 8000,
                name: 'Player 1',
                strength: 3,
                tileId: 1,
                canRollForMove:true,
            },
            {
                age: 30,
                deathAge: 50,
                inteligence: 4,
                moneyCarried: 5000,
                moneyHome: 10000,
                name: 'Player 2',
                strength: 4,
                tileId: 3,
                canRollForMove: false
            }];
        state.value.month = 1;
        state.value.currentPlayerIndex = 0;
    }

    restartGame();


    function waitForDiceRolling(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            state.value.gameState = 'WAITFORDICEROLLING';
            setTimeout(() => {
                state.value.dice.diceRolling = false;
                state.value.dice.rolledNumber = Math.floor(6 * Math.random()) + 1;
                state.value.dice.rolledAt = Date.now();
                resolve(state.value.dice.rolledNumber);
            }, Math.floor(700 * Math.random()) + 500)
        })
    }

    function rollDice(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            state.value.dice.diceRolling = true;
            setTimeout(() => {
                state.value.dice.diceRolling = false;
                state.value.dice.rolledNumber = Math.floor(6 * Math.random()) + 1;
                state.value.dice.rolledAt = Date.now();
                resolve(state.value.dice.rolledNumber);
            }, Math.floor(700 * Math.random()) + 500)
        })
    }

    const board = computed(() => {
        return state.value.board;
    })

    const currentPlayerIndex = computed<PlayerIndex>(() => {
        return state.value.currentPlayerIndex;
    })

    const players = computed(() => {
        return state.value.players;
    })

    const diceRoledNumber = computed(() => {
        return state.value.dice.rolledNumber;
    })

    const gameTileList = computed<Array<GameTileData>>(() => {
        return state.value.board.gameTiles;
    })

    function doAction(playerIndex: number, tileActionId: TileActionId) {

    }

    function addMoneyToCurrentPLayer(addMoneyCarried: number = 0, addMoneyHome: number = 0) {
        state.value.players[state.value.currentPlayerIndex].moneyCarried += addMoneyCarried
        state.value.players[state.value.currentPlayerIndex].moneyHome += addMoneyHome
    }

    function startNextPlayerTurn() {
        state.value.currentPlayerIndex = (state.value.currentPlayerIndex + 1) % state.value.players.length;
    }

    function moveCurrentPlayer(tilesCount: number) {
        const currentTileId = state.value.players[state.value.currentPlayerIndex].tileId;

        // TOTO: Spravne zjisit ID tilu na kterem je player. TieId nemusi jit postupne od 1 do X.
        state.value.players[state.value.currentPlayerIndex].tileId = (currentTileIndex + tilesCount) % state.value.board.gameTiles.length;
    }

    function setCurrentPlayerCanRollToMove(canRole: boolean) {
        state.value.playerCanRoleToMove = canRole;
    }

    return {
        _state:state,
        rollDice: rollDice,
        gameTileList: gameTileList,
        dice: readonly(state.value.dice),
        restartGame: restartGame,
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


});
