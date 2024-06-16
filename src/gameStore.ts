import {defineStore} from "pinia";
import {computed, readonly, ref} from "vue";


export type PlayerId = string;
export type Player = {
    name: string,
    strength: number,
    inteligence: number,
    age: number,
    deathAge: number,
    moneyHome: number,
    moneyCarried: number,
    tileId: GameTileId, // na jakem policku stoji
}

type TileKind = 'BANK' | 'NIGHTCLUB' | 'PRISON' | 'HOSPITAL' | 'DARKSTREET';

export type TileActionId = string;
export type GameTileId = string;

type GameTile = {
    tileKind: TileKind;
}

type GameBoard = {
    gameTiles: Array<GameTile>
}

type PlayerState = 'ROLLDICETOMOVE' | 'WAITFORACTION' | 'ROLLDICETOTILEACTION';

type Dice = {
    diceRolling: boolean,
    rolledNumber: number,
    rolledAt: number, // timestamp, kdy se nastavila hodnota. Aby na to sel udelat watch
}

type GameState = 'IDLE' | 'WAITFORDICEROLLING';

type Store = {
    players: Record<PlayerId, Player>,
    board: GameBoard,
    dice: Dice,
    gameState: GameState;
    month: number, // 1=leden atd.
    currentPlayerIndex: number, // index hrace v playersFlow
    currentPlayerState: PlayerState;
    playersFlow:Array<PlayerId>;
    playerCanRoleToMove: boolean;
}

export const useGame = defineStore('gameStore', () => {

    const store = ref<Store>({
        board: {gameTiles: []},
        currentPlayerState: "ROLLDICETOMOVE",
        currentPlayerIndex: 0,
        month: 1,
        players: {},
        gameState: 'IDLE',
        dice: {diceRolling: false, rolledNumber: 1, rolledAt: 0},
        playerCanRoleToMove: true,
        playersFlow:['Player1','Player2']
    })

    function restartGame() {
        store.value.board.gameTiles = [{tileKind: 'BANK'}, {tileKind: 'DARKSTREET'}, {tileKind: 'DARKSTREET'}, {tileKind: 'DARKSTREET'}]
        store.value.players = {
            'Player1': {
                age: 22,
                deathAge: 50,
                inteligence: 2,
                moneyCarried: 2000,
                moneyHome: 8000,
                name: 'Player 1',
                strength: 3,
                tileId: '1'
            },
            'Player2': {
                age: 30,
                deathAge: 50,
                inteligence: 4,
                moneyCarried: 5000,
                moneyHome: 10000,
                name: 'Player 2',
                strength: 4,
                tileId: '3'
            }
        };
        store.value.month = 1;
        store.value.currentPlayerIndex = 0;
        store.value.currentPlayerState = "WAITFORACTION";
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

    const currentPlayerId = computed<PlayerId>(() => {
        return store.value.playersFlow[store.value.currentPlayerIndex];
    })

    const players = computed(() => {
        return store.value.players;
    })

    const diceRoledNumber = computed(() => {
        return store.value.dice.rolledNumber;
    })

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
        playersOnTile: Array<PlayerId>
    }

    type GameTiles = Record<GameTileId, GameTileData>
    const gameTiles = computed<GameTiles>(() => {
        // Nebudou konkretni GameTileBank nebo GameTile DarkStreet apod. BUde jen obecny GameTile a podle dat ze storu se bude vykreslovat.
        // Stor bude vedet, co se ma dit a co ma dany tile zobrazovat apod.
        const result: GameTiles = {
            '1': {
                name: "BANKA",
                tileJobName: "Bankéř INT:5",
                actionName: "Hypotéka",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1"},
                    {id: "addMoney5000", name: "+5000", numbersToRoll: "2-5"},
                    {id: "AddMoney10000", name: "+10000", numbersToRoll: "6"},
                ],
                playersOnTile: []
            },
            '2': {
                name: "TEMNÁ ULIČKA",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "attackeByStrong8", name: "Přepadli tě síle 8", numbersToRoll: "1"},
                    {id: "attackeByStrong5", name: "Přepadli tě síle 5", numbersToRoll: "2-3"},
                    {id: "noop", name: "Nic", numbersToRoll: "4-5"},
                    {id: "meetDealer", name: "potkal jsi dealera", numbersToRoll: "6"},
                ],
                playersOnTile: []
            },
            '3': {
                name: "Škola",
                tileJobName: "Školník INT:2 STR:2",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
                playersOnTile: [],
            },
            '4': {
                name: "Nemocnice",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
                playersOnTile: []
            },
            '5': {
                name: "Lékárna",
                tileJobName: "",
                actionName: "",
                tileActions: [
                    {id: "noop", name: "Nic", numbersToRoll: "1-2"}
                ],
                playersOnTile: [],
            },
        }
        store.value.playersFlow.forEach((playerId)=>{
            const tileId = store.value.players[playerId].tileId;
            if (tileId && result[tileId]) {
                result[tileId].playersOnTile.push(playerId);
            }
        })
        return result;
    })

    const gameTileList = computed<Array<GameTileId>>(() => {
        return ['1', '2', '3', '4', '5']
    })

    function doAction(playerIndex: number, tileActionId: TileActionId) {

    }

    function addMoneyToCurrentPLayer(addMoneyCarried: number = 0, addMoneyHome: number = 0) {
        store.value.players[store.value.currentPlayerIndex].moneyCarried += addMoneyCarried
        store.value.players[store.value.currentPlayerIndex].moneyHome += addMoneyHome
    }

    function startNextPlayerTurn() {
        store.value.currentPlayerState = 'ROLLDICETOMOVE';
        store.value.currentPlayerIndex = (store.value.currentPlayerIndex + 1) % store.value.playersFlow.length;
    }

    function moveCurrentPlayer(tilesCount: number) {
        let playerId = currentPlayerId.value;
        let tileIndex = store.value.playersFlow[currentPlayerId.value];
        store.value.players[store.value.currentPlayerIndex].tileIndex = (tileIndex + 1) % store.value.board.gameTiles.length;
    }

    function setCurrentPlayerCanRollToMove(canRole: boolean) {
        store.value.playerCanRoleToMove = canRole;
    }

    return {
        rollDice: rollDice,
        gameTileList: gameTileList,
        gameTiles: gameTiles,
        dice: readonly(store.value.dice),
        restartGame: restartGame,
        currentPlayerId: currentPlayerId,
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
