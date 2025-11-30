import {computed, MaybeRefOrGetter, toValue} from "vue";
import {_storeGame, GameTileId, JobId, TileActionId} from "./gameStore";


type ActionEffects = {
   actionEffectName:string,// napr. pujcka 5000,-
   numbersToRoll:Array<number>// napr. [2,3,4] nebo [5]
}

type TileAction = {
   id: TileActionId,
   actionName: string, // napr. hypoteka
   actionEffects:Array<ActionEffects>
}

type TileJob = {
   jobId:JobId,
   name: string,
   requirements: {
      minINT:number,
      minSTR:number,
   },
}



export function useGameTile(gameTileId:MaybeRefOrGetter<GameTileId>) {

   const storeGame = _storeGame();

   type GameTileData = {
      tileName: string;
      tileActions: Array<TileAction>
      tileJobs: Array<TileJob>,
   }
   const gameTileData = computed(() => {
      return storeGame._state.gameTiles[toValue(gameTileId)];

   })


   return {
      gameTileData:gameTileData,
   }


}
