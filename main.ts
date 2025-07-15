import {randomInt} from 'crypto';
import teamsData from './data/default.json'; 
import { Team, TeamData } from './models/team';
import * as readline from 'readline';

/**
 * 命令行输入封装
 * @param question 
 * @returns 
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * 主控制区
 */

const defaultTeams: Team[] = (teamsData as TeamData[]).map(data => new Team(data));

function ask(question: string): Promise<string> {
  return new Promise(resolve => rl.question(question, resolve));
}
// async function main() {
//   const answer = await ask("请输入内容：");
//   console.log("你输入的是", answer);
//   rl.close();
//   console.log(teams[1].name);
// }

// main();

// rl.question("这是一个测试",(answer)=>{
//   console.log("你说的是："+answer);
//   rl.close();
// })

/**
 * 更新排名，分数高的在前
 */
function updateRank(teams:Team[]): void{
  teams.sort((a: Team, b: Team) => b.score - a.score);

}
/**
 * 模拟比赛，返回比赛结果，1为获胜，0为失败
 * @param teamA 
 * @param teamB 
 * @returns result
 */
function gameSimulation(teamA: Team, teamB: Team): number{
  const paramA = randomInt(0, 10)*teamA.bonus;
  const paramB = randomInt(0, 10)*teamB.bonus;
  let result = 0;
  if (paramA >= paramB){
    result = 1;
  }
  return result;
}
/**
 * 用到gameSimulation模拟比赛同时更新数据
 * @param teamA 
 * @param teamB 
 */
function afterGameUpdate(teamA: Team, teamB: Team): void{
  const result = gameSimulation(teamA, teamB);
  if (result === 1){
    teamA.score += 1;
    teamA.wins += 1;
    teamB.losses += 1;
  }else{
    teamB.score += 1;
    teamA.losses += 1;
    teamB.wins += 1;
  }
}

/**
 * 生成赛程表
 * @param teams 
 * @returns schedule
 */
function generateSchedule(teams: Team[],loop: number): [Team, Team][][]{
  const schedule: [Team, Team][][] = [];
  const n = teams.length;
  const half = n/2;
  const original = [...teams];
  for(let l = 0; l < loop;l++){
  const rotated = [...original];
  for(let i = 0;i < n-1;i++){
    const matches:[Team,Team][]=[];
    for(let j = 0; j < half; j++){
      matches.push([rotated[j],rotated[n-j-1]]);
    }

    schedule.push(matches);//将每轮的对阵安排结果push到总的表中

    //将rotated重新洗牌
    const fixed = rotated[0];
    const rest = rotated.slice(1);
    rest.unshift(rest.pop()!); // 右移一格
    rotated.splice(0, rotated.length, fixed, ...rest);
  }
  }
  return schedule;
}


//TODO 改成可实现两轮，以及潜在的每一轮显示
/**
 * 每一轮的模拟
 * @param round 
 * @param teams 
 * @param schedule 
 */
function oneRoundSimulation(round:number,schedule:[Team,Team][][]):void{
  const matches = schedule[round];
  for(const [teamA,teamB] of matches){
    afterGameUpdate(teamA,teamB);
  }
}

/**
 * 赛季模拟
 * @param teams 赛季开始之前的队伍表 
 * @param loop 循环次数
 */
async function oneSeasonSimulation(teams:Team[],loop:number){
  //生成对阵表
  let schedule = generateSchedule(teams,loop);
  for(let i = 0;i<schedule.length; i++){
    oneRoundSimulation(i,schedule);
    updateRank(teams);
  }
  console.log("本赛季结束");
  for(let i=0;i<teams.length;i++){
    console.log(`${i+1}  ${teams[i].name}\x1b[31m 胜:${teams[i].wins}\x1b[0m\x1b[32m 负:${teams[i].losses}\x1b[0m   上赛季的排名:${teams[i].lastSeasonRank}  bonus:${teams[i].bonus};`);
    teams[i].lastSeasonRank=i+1;
  }
  const answer = await ask("请输入'1'继续下赛季，否则游戏结束");
  console.log("你输入的是", answer);
  if(answer === '1'){
    //console.clear();
    beforeSeasonRestart(teams);
    oneSeasonSimulation(teams,loop);
  }
  
}

function beforeSeasonRestart(teams:Team[]){
  for(let i=0;i<teams.length;i++){
    let team=teams[i];
    team.score=0;
    team.wins=0;
    team.losses=0;
    team.bonus=teams.length-i;
  }
}

oneSeasonSimulation(defaultTeams,4)



