export interface TeamData {
  id: number             // 编号
  name: string           // 名字
  score: number           // 当前排名
  wins: number           // 胜场
  losses: number         // 负场
  streak: number         // 连胜连败记录（正数表示连胜，负数连败）
  lastSeasonRank: number // 上赛季排名  
  bonus: number          // 士气加成
}
export class Team {
  id!: number;
  name!: string;
  score!: number;
  wins!: number;
  losses!: number;
  streak!: number;
  lastSeasonRank!: number;
  bonus!: number;

  constructor(data: TeamData) {
    Object.assign(this, data)
  }
}

