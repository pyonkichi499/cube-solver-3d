/**
 * 手順の統合と簡略化
 */

export const simplifyMoves = (moves: string[]): string[] => {
  if (moves.length === 0) return [];
  
  const simplified: string[] = [];
  let i = 0;
  
  while (i < moves.length) {
    const currentMove = moves[i];
    const baseFace = getBaseFace(currentMove);
    
    // 同じ面の連続した回転をカウント
    let count = getRotationAmount(currentMove);
    let j = i + 1;
    
    // 連続する同じ面の回転を探す
    while (j < moves.length && getBaseFace(moves[j]) === baseFace) {
      count += getRotationAmount(moves[j]);
      j++;
    }
    
    // 4回転は1周なので正規化
    count = count % 4;
    
    // 統合した回転を追加
    if (count !== 0) {
      simplified.push(formatMove(baseFace, count));
    }
    
    i = j;
  }
  
  return simplified;
};

/**
 * 手順から基本面（R, U, F等）を抽出
 */
const getBaseFace = (move: string): string => {
  return move.charAt(0);
};

/**
 * 手順の回転量を取得（1, 2, 3）
 * R = 1, R2 = 2, R' = 3
 */
const getRotationAmount = (move: string): number => {
  if (move.endsWith('2')) {
    return 2;
  } else if (move.endsWith("'")) {
    return 3; // R' は R を3回と同じ
  } else {
    return 1;
  }
};

/**
 * 面と回転量から手順文字列を生成
 */
const formatMove = (face: string, amount: number): string => {
  switch (amount) {
    case 1:
      return face;
    case 2:
      return face + '2';
    case 3:
      return face + "'";
    default:
      return face; // 念のため
  }
};

/**
 * 手順を統合して表示用の文字列を生成
 * 例: ["R", "R", "U", "U'"] → "R2"
 */
export const getSimplifiedMovesDisplay = (moves: string[]): { 
  original: string;
  simplified: string;
  count: number;
} => {
  const simplified = simplifyMoves(moves);
  
  return {
    original: moves.join(' '),
    simplified: simplified.join(' '),
    count: simplified.length
  };
};

/**
 * 最後に追加された手順グループを検出
 * 連続実行時のハイライト用
 */
export const getLastMoveGroup = (moves: string[]): string[] => {
  if (moves.length === 0) return [];
  
  const lastMove = moves[moves.length - 1];
  const baseFace = getBaseFace(lastMove);
  
  // 後ろから同じ面の手順を探す
  const group: string[] = [];
  for (let i = moves.length - 1; i >= 0; i--) {
    if (getBaseFace(moves[i]) === baseFace) {
      group.unshift(moves[i]);
    } else {
      break;
    }
  }
  
  return group;
};