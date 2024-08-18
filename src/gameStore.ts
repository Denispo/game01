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
    tileIndex: GameTileIndex, // na jakem policku stoji
    canRollForMove:boolean,
}

export type TileActionId = string;
export type GameTileIndex = number;


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

export const useGame = defineStore('gameStore', () => {

    const store = ref<Store>({
        board: {gameTiles: []},
        currentPlayerIndex: 0,
        month: 1,
        players: [],
        gameState: 'IDLE',
        dice: {diceRolling: false, rolledNumber: 1, rolledAt: 0},
        playerCanRoleToMove: true,
    })

    function restartGame() {
        store.value.board.gameTiles = [
            {
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
                name: "Škola",
                tileJobName: "Školník INT:2 STR:2",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
            },
            {
                name: "Nemocnice",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
            },
            {
                name: "Lékárna",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
            }

        ]
        store.value.players = [
            {
                age: 22,
                deathAge: 50,
                inteligence: 2,
                moneyCarried: 2000,
                moneyHome: 8000,
                name: 'Player 1',
                strength: 3,
                tileIndex: 1,
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
                tileIndex: 3,
                canRollForMove: false
            }];
        store.value.month = 1;
        store.value.currentPlayerIndex = 0;
    }

    restartGame();


    function waitForDiceRolling(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            store.value.gameState = 'WAITFORDICEROLLING';
            setTimeout(() => {
                store.value.dice.diceRolling = false;
                store.value.dice.rolledNumber = Math.floor(6 * Math.random()) + 1;
                store.value.dice.rolledAt = Date.now();
                resolve(store.value.dice.rolledNumber);
            }, Math.floor(700 * Math.random()) + 500)
        })
    }

    function rollDice(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            store.value.dice.diceRolling = true;
            setTimeout(() => {
                store.value.dice.diceRolling = false;
                store.value.dice.rolledNumber = Math.floor(6 * Math.random()) + 1;
                store.value.dice.rolledAt = Date.now();
                resolve(store.value.dice.rolledNumber);
            }, Math.floor(700 * Math.random()) + 500)
        })
    }

    const board = computed(() => {
        return store.value.board;
    })

    const currentPlayerIndex = computed<PlayerIndex>(() => {
        return store.value.currentPlayerIndex;
    })

    const players = computed(() => {
        return store.value.players;
    })

    const diceRoledNumber = computed(() => {
        return store.value.dice.rolledNumber;
    })

    const gameTileList = computed<Array<GameTileData>>(() => {
        return store.value.board.gameTiles;
    })

    function doAction(playerIndex: number, tileActionId: TileActionId) {

    }

    function addMoneyToCurrentPLayer(addMoneyCarried: number = 0, addMoneyHome: number = 0) {
        store.value.players[store.value.currentPlayerIndex].moneyCarried += addMoneyCarried
        store.value.players[store.value.currentPlayerIndex].moneyHome += addMoneyHome
    }

    function startNextPlayerTurn() {
        store.value.currentPlayerIndex = (store.value.currentPlayerIndex + 1) % store.value.players.length;
    }

    function moveCurrentPlayer(tilesCount: number) {
        const currentTileIndex = store.value.players[store.value.currentPlayerIndex].tileIndex;
        store.value.players[store.value.currentPlayerIndex].tileIndex = (currentTileIndex + tilesCount) % store.value.board.gameTiles.length;
    }

    function setCurrentPlayerCanRollToMove(canRole: boolean) {
        store.value.playerCanRoleToMove = canRole;
    }

    return {
        rollDice: rollDice,
        gameTileList: gameTileList,
        dice: readonly(store.value.dice),
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
