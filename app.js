console.log("敵キャラが初期位置から動かない");

let can = null;
let con = null;
const offsetX = 40;
const offsetY = 60;
const magnification = 18.0;
const charctorSize = 35;
const dotSize = 4;
let dots = [];
let powerDots = [];
let pacman = null;
let monsters = [];
let pacmanNorthImage = null;
let pacmanSorthImage = null;
let pacmanEastImage = null;
let pacmanWestImage = null;
let monsterImages = [];
let ijikeImages = [];
let monsterEyeImage = null;
let CounterattackTime = 0;
let CounterattackTimeMax = 10 * 1000;
let score = 0;
let rest = 3;
let restMax = 3;
let isGameOver = false;
let stoping = false;
let eatMonsterCount = 0;
Main();
function Main() {
  can = document.getElementById("can");
  con = can.getContext("2d");
  can.width = offsetX * 2 + magnification * 25; //600;
  can.height = offsetY * 2 + magnification * 28; //500 + 100;
  can.style.border = "1px solid #111";
  pacmanNorthImage = GetHTMLImageElement("./images/pac_north.png");
  pacmanSouthImage = GetHTMLImageElement("./images/pac_south.png");
  pacmanEastImage = GetHTMLImageElement("./images/pac_east.png");
  pacmanWestImage = GetHTMLImageElement("./images/pac_west.png");
  monsterImages.push(GetHTMLImageElement("./images/red.png"));
  monsterImages.push(GetHTMLImageElement("./images/pink.png"));
  monsterImages.push(GetHTMLImageElement("./images/blue.png"));
  monsterImages.push(GetHTMLImageElement("./images/orange.png"));
  ijikeImages.push(GetHTMLImageElement("./images/ijike1.png"));
  ijikeImages.push(GetHTMLImageElement("./images/ijike2.png"));
  monsterEyeImage = GetHTMLImageElement("./images/eye.png");
  rest = restMax;
  pacman = new Pacman();
  pacman.GoHome();
  MonstersInit();
  CreateDots();
  CreatePowerDots();
  document.onkeydown = OnKeyDown;
  setInterval(PacmanMove, 15);
  setInterval(MoveMonsters, 15);
  setInterval(Draw, 10);
  setInterval(() => {
    if (CounterattackTime > 0) CounterattackTime -= 100;
  }, 100);
}
function ThinkDirect(id) {
  let monster = monsters[id];
  let pacX = pacman.Position.CenterX;
  let pacY = pacman.Position.CenterY;
  // if (id == 0) {
  //   // 赤はパックマンをそのまま追う
  //   monster.Direct = GetMonsterDirect(monster, pacX, pacY, !monster.IsIjike);
  // }
  // if (id == 1) {
  //   // パックマンが向いている方向の少し先を目指す
  //   let pacDirect = pacman.Direct;
  //   if (pacDirect == Direct.None)
  //     // pacDirect == Direct.Noneのときは前回移動成功時の方向
  //     pacDirect = pacman.PrevDirect;
  //   if (pacDirect == Direct.North)
  //     monster.Direct = GetMonsterDirect(
  //       monster,
  //       pacX,
  //       pacY - 5,
  //       !monster.IsIjike
  //     );
  //   if (pacDirect == Direct.South)
  //     monster.Direct = GetMonsterDirect(
  //       monster,
  //       pacX,
  //       pacY + 5,
  //       !monster.IsIjike
  //     );
  //   if (pacDirect == Direct.East)
  //     monster.Direct = GetMonsterDirect(
  //       monster,
  //       pacX + 5,
  //       pacY,
  //       !monster.IsIjike
  //     );
  //   if (pacDirect == Direct.West)
  //     monster.Direct = GetMonsterDirect(
  //       monster,
  //       pacX - 5,
  //       pacY,
  //       !monster.IsIjike
  //     );
  // }
  // if (id == 2) {
  //   // パックマンを中心にして、赤の点対称の位置を目指す
  //   let red = monsters[0];
  //   let targetX = red.Position.CenterX * 2 - pacX;
  //   let targetY = red.Position.CenterY * 2 - pacY;
  //   monster.Direct = GetMonsterDirect(
  //     monster,
  //     targetX,
  //     targetY,
  //     !monster.IsIjike
  //   );
  // }
  // if (id == 3) {
  //   // 距離の２乗
  //   // 遠ければ追い、近ければ逃げる
  //   let dis2 =
  //     Math.pow(monster.Position.CenterX - pacX, 2) +
  //     Math.pow(monster.Position.CenterY - pacY, 2);
  //   if (dis2 > 100)
  //     monster.Direct = GetMonsterDirect(monster, pacX, pacY, !monster.IsIjike);
  //   else
  //     monster.Direct = GetMonsterDirect(monster, pacX, pacY, monster.IsIjike);
  // }
}
function GetMonsterDirect(monster, pacX, pacY, approach) {
  let directs = monster.GetDirectsMonsterMove();
  // if (directs.length == 1) {
  //   // 移動できる方向がひとつしかないならそれを選択するしかない
  //   return directs[0];
  // }
  // let monX = monster.Position.CenterX;
  // let monY = monster.Position.CenterY;
  // let dx = monX - pacX;
  // let dy = monY - pacY;
  // let nextDirect = Direct.None;
  // if (Math.abs(dx) > Math.abs(dy)) {
  //   // 左右優先
  //   if (dx > 0) {
  //     if (approach && directs.find((direct) => direct == Direct.West))
  //       nextDirect = Direct.West;
  //     if (!approach && directs.find((direct) => direct == Direct.East))
  //       nextDirect = Direct.East;
  //   }
  //   if (dx < 0) {
  //     if (approach && directs.find((direct) => direct == Direct.East))
  //       nextDirect = Direct.East;
  //     if (!approach && directs.find((direct) => direct == Direct.West))
  //       nextDirect = Direct.West;
  //   }
  //   if (nextDirect == Direct.None) {
  //     if (dy > 0) {
  //       if (approach && directs.find((direct) => direct == Direct.North))
  //         nextDirect = Direct.North;
  //       if (!approach && directs.find((direct) => direct == Direct.South))
  //         nextDirect = Direct.South;
  //     }
  //     if (dy < 0) {
  //       if (approach && directs.find((direct) => direct == Direct.South))
  //         nextDirect = Direct.South;
  //       if (!approach && directs.find((direct) => direct == Direct.North))
  //         nextDirect = Direct.North;
  //     }
  //   }
  // } else {
  //   // 上下優先
  //   if (dy > 0) {
  //     if (approach && directs.find((direct) => direct == Direct.North))
  //       nextDirect = Direct.North;
  //     if (!approach && directs.find((direct) => direct == Direct.South))
  //       nextDirect = Direct.South;
  //   }
  //   if (dy < 0) {
  //     if (approach && directs.find((direct) => direct == Direct.South))
  //       nextDirect = Direct.South;
  //     if (!approach && directs.find((direct) => direct == Direct.North))
  //       nextDirect = Direct.North;
  //   }
  //   if (nextDirect == Direct.None) {
  //     if (dx > 0) {
  //       if (approach && directs.find((direct) => direct == Direct.West))
  //         nextDirect = Direct.West;
  //       if (!approach && directs.find((direct) => direct == Direct.East))
  //         nextDirect = Direct.East;
  //     }
  //     if (dx < 0) {
  //       if (approach && directs.find((direct) => direct == Direct.East))
  //         nextDirect = Direct.East;
  //       if (!approach && directs.find((direct) => direct == Direct.West))
  //         nextDirect = Direct.West;
  //     }
  //   }
  // }
  //   // この方法で決まらないなら適当に選ぶしかない
  //   if (nextDirect == Direct.None) {
  //     let index = Math.floor(Math.random() * directs.length);
  //     nextDirect = directs[index];
  //   }
  //   return nextDirect;
}
function GetHTMLImageElement(path) {
  let img = new Image();
  img.src = path;
  return img;
}
//パックマンの動作
function PacmanMove() {
  if (stoping) return;
  pacman.Move();
}
function OnKeyDown(e) {
  if (e.keyCode == 37) pacman.NextDirect = Direct.West;
  if (e.keyCode == 38) pacman.NextDirect = Direct.North;
  if (e.keyCode == 39) pacman.NextDirect = Direct.East;
  if (e.keyCode == 40) pacman.NextDirect = Direct.South;
  if (e.keyCode == 83 && isGameOver == true) GameRetart();
}
function GameRetart() {
  rest = restMax;
  score = 0;
  pacman.GoHome();
  MonstersInit();
  dots.forEach((dot) => (dot.IsEaten = false));
  powerDots.forEach((dot) => (dot.IsEaten = false));
  isGameOver = false;
  setTimeout(() => {
    stoping = false;
  }, 3000);
}
function CheckEatDot() {
  let dot = dots.find(
    (dot) =>
      dot.X == pacman.Position.CenterX && dot.Y == pacman.Position.CenterY
  );
  if (dot != null) {
    if (!dot.IsEaten) {
      dot.IsEaten = true;
      OnEatDot();
    }
  }
  let powerDot = powerDots.find(
    (dot) =>
      dot.X == pacman.Position.CenterX && dot.Y == pacman.Position.CenterY
  );
  if (powerDot != null) {
    if (!powerDot.IsEaten) {
      powerDot.IsEaten = true;
      OnEatPowerDot();
    }
  }
}
function OnEatDot() {
  // 得点追加の処理
  score += 10;
  if (CheckStageClear()) {
    OnStageClear();
  }
}
function OnEatPowerDot() {
  score += 50;
  eatMonsterCount = 0;
  if (CheckStageClear()) {
    OnStageClear();
  } else {
    // モンスターをいじけ状態にする
    monsters.forEach((monster) => {
      monster.IsIjike = true;
      monster.ReverseMove();
    });
    CounterattackTime = CounterattackTimeMax;
  }
}
function OnFinishCounterattack() {
  monsters.forEach((monster) => (monster.IsIjike = false));
}
function CheckStageClear() {
  let dot = dots.find((dot) => !dot.IsEaten);
  let powerDot = powerDots.find((dot) => !dot.IsEaten);
  if (dot == null && powerDot == null) return true;
  else return false;
}
function CheckHitMonster() {
  for (let i = 0; i < monsters.length; i++) {
    let monster = monsters[i];
    if (IsHitMonster(monster)) {
      if (monster.IsIjike) {
        EatMonster(monster);
      } else {
        PacmanDead();
        break;
      }
    }
  }
}
function IsHitMonster(monster) {
  if (monster.IsGoingHome) return false;
  let x2 = Math.pow(pacman.Position.CenterX - monster.Position.CenterX, 2);
  let y2 = Math.pow(pacman.Position.CenterY - monster.Position.CenterY, 2);
  if (x2 + y2 < 1) {
    return true;
  } else return false;
}
let showMonsterPoint = false;
let monsterX = 0;
let monsterY = 0;
function EatMonster(monster) {
  monster.IsGoingHome = true;
  showMonsterPoint = true;
  monsterX = monster.Position.CenterX;
  monsterY = monster.Position.CenterY;
  stoping = true;
  CounterattackTime += 1000; // モンスターを食べたあと1秒間動作を止めるので、その分追加する
  eatMonsterCount++;
  score += Math.pow(2, eatMonsterCount) * 100;
  setTimeout(AfterEatMonster, 1000, monster);
}
function AfterEatMonster(monster) {
  showMonsterPoint = false;
  monster.GoHome();
  stoping = false;
}
function PacmanDead() {
  stoping = true;
  setTimeout(AfterPacmanDead, 3000);
}
function AfterPacmanDead() {
  rest--;
  if (rest > 0) {
    pacman.GoHome();
    MonstersInit();
    stoping = false;
  } else {
    isGameOver = true;
  }
}
function OnStageClear() {
  stoping = true;
  setTimeout(AfterStageClear, 3000);
}
function AfterStageClear() {
  pacman.GoHome();
  MonstersInit();
  dots.forEach((dot) => (dot.IsEaten = false));
  powerDots.forEach((dot) => (dot.IsEaten = false));
  stoping = false;
}
function DrawPac() {
  pacman.Draw();
}

//モンスター
function MonstersInit() {
  monsters = [];
  monsters.push(new Monster(0, 12.5, 10, Direct.None));
  monsters.push(new Monster(1, 12.5, 13, Direct.South));
  monsters.push(new Monster(2, 10, 13, Direct.North));
  monsters.push(new Monster(3, 15, 13, Direct.North));
  SetMonstersStandbyCount([0, 3, 6, 10]);
}
function SetMonstersStandbyCount(counts) {
  let count = monsters.length;
  for (let i = 0; i < count; i++) {
    if (counts.length >= i) monsters[i].StandbyCount = counts[i];
  }
}
let moveCount = 0;
function MoveMonsters() {
  if (stoping) return;
  moveCount++;
  if (moveCount >= 10000) moveCount = 0;
  for (let i = 0; i < monsters.length; i++) {
    let monster = monsters[i];
    if (!monster.IsIjike || moveCount % 2 == 0) monster.Move();
  }
}
function DrawMonsters() {
  monsters.forEach((monster) => {
    monster.Draw();
  });
}

function Draw() {
  DrawMazes();
  DrawDots();
  DrawPowerDots();
  if (!isGameOver) DrawPac();
  DrawMonsters();
  DrawScore();
  DrawRest();
  if (isGameOver) {
    con.fillStyle = "white";
    con.font = "28px 'ＭＳ ゴシック'";
    con.fillText("Game Over", offsetX + 170, offsetY + 295, 250);
  }
  if (showMonsterPoint) {
    con.fillStyle = "white";
    con.font = "28px 'ＭＳ ゴシック'";
    let addscore = Math.pow(2, eatMonsterCount) * 100;
    con.fillText(
      addscore.toString(),
      monsterX * magnification + offsetX,
      monsterY * magnification + offsetY,
      250
    );
  }
}
function DrawScore() {
  let strScore = "";
  if (score < 10000) strScore = ("00000" + score).slice(-5);
  else strScore = score.toString();
  con.fillStyle = "white";
  con.font = "24px 'ＭＳ ゴシック'";
  con.fillText(strScore, offsetX - 10, offsetY - 30, 200);
}
function DrawRest() {
  for (let i = 0; i < rest - 1; i++)
    con.drawImage(
      pacmanEastImage,
      offsetX + 110 + 25 * i,
      offsetY - 53,
      charctorSize * 0.7,
      charctorSize * 0.7
    );
}
function CreateDots() {
  for (let x = 0; x <= 11; x++) dots.push(new Dot(x, 0));
  for (let x = 14; x <= 25; x++) dots.push(new Dot(x, 0));
  for (let y = 1; y <= 3; y++) {
    if (y != 2) dots.push(new Dot(0, y));
    dots.push(new Dot(5, y));
    dots.push(new Dot(11, y));
    dots.push(new Dot(14, y));
    dots.push(new Dot(20, y));
    if (y != 2) dots.push(new Dot(25, y));
  }
  for (let x = 0; x <= 25; x++) dots.push(new Dot(x, 4));
  for (let y = 5; y <= 6; y++) {
    dots.push(new Dot(0, y));
    dots.push(new Dot(5, y));
    dots.push(new Dot(8, y));
    dots.push(new Dot(17, y));
    dots.push(new Dot(20, y));
    dots.push(new Dot(25, y));
  }
  for (let x = 0; x <= 5; x++) dots.push(new Dot(x, 7));
  for (let x = 8; x <= 11; x++) dots.push(new Dot(x, 7));
  for (let x = 14; x <= 17; x++) dots.push(new Dot(x, 7));
  for (let x = 20; x <= 25; x++) dots.push(new Dot(x, 7));
  for (let y = 8; y <= 18; y++) {
    dots.push(new Dot(5, y));
    dots.push(new Dot(20, y));
  }
  for (let x = 0; x <= 11; x++) dots.push(new Dot(x, 19));
  for (let x = 14; x <= 25; x++) dots.push(new Dot(x, 19));
  for (let y = 20; y <= 21; y++) {
    dots.push(new Dot(0, y));
    dots.push(new Dot(5, y));
    dots.push(new Dot(11, y));
    dots.push(new Dot(14, y));
    dots.push(new Dot(20, y));
    dots.push(new Dot(25, y));
  }
  for (let x = 1; x <= 2; x++) dots.push(new Dot(x, 22));
  for (let x = 5; x <= 20; x++) dots.push(new Dot(x, 22));
  for (let x = 23; x <= 24; x++) dots.push(new Dot(x, 22));
  for (let y = 23; y <= 24; y++) {
    dots.push(new Dot(2, y));
    dots.push(new Dot(5, y));
    dots.push(new Dot(8, y));
    dots.push(new Dot(17, y));
    dots.push(new Dot(20, y));
    dots.push(new Dot(23, y));
  }
  for (let y = 26; y <= 27; y++) {
    dots.push(new Dot(0, y));
    dots.push(new Dot(11, y));
    dots.push(new Dot(14, y));
    dots.push(new Dot(25, y));
  }
  for (let x = 0; x <= 5; x++) dots.push(new Dot(x, 25));
  for (let x = 8; x <= 11; x++) dots.push(new Dot(x, 25));
  for (let x = 14; x <= 17; x++) dots.push(new Dot(x, 25));
  for (let x = 20; x <= 25; x++) dots.push(new Dot(x, 25));
  for (let x = 0; x <= 25; x++) dots.push(new Dot(x, 28));
}
function CreatePowerDots() {
  powerDots.push(new PowerDot(0, 2));
  powerDots.push(new PowerDot(25, 2));
  powerDots.push(new PowerDot(0, 22));
  powerDots.push(new PowerDot(25, 22));
}
function DrawPowerDots() {
  for (let i = 0; i < powerDots.length; i++) {
    let dot = powerDots[i];
    if (!dot.IsEaten) {
      let dotSize = 8;
      con.fillStyle = "yellow";
      let x = dot.X * magnification - dotSize / 2 + offsetX;
      let y = dot.Y * magnification - dotSize / 2 + offsetY;
      con.fillRect(x, y, dotSize, dotSize);
    }
  }
}
function DrawDots() {
  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];
    if (!dot.IsEaten) {
      con.fillStyle = "white";
      let x = dot.X * magnification - dotSize / 2 + offsetX;
      let y = dot.Y * magnification - dotSize / 2 + offsetY;
      con.fillRect(x, y, dotSize, dotSize);
    }
  }
}

function DrawAisle(x1, y1, x2, y2) {
  con.strokeStyle = "black";
  con.lineWidth = 30;
  if (y1 == y2) {
    x1 -= 0.8;
    x2 += 0.8;
  }
  if (x1 == x2) {
    y1 -= 0.8;
    y2 += 0.8;
  }
  con.beginPath();
  con.moveTo(x1 * magnification + offsetX, y1 * magnification + offsetY);
  con.lineTo(x2 * magnification + offsetX, y2 * magnification + offsetY);
  con.stroke();
}
function DrawWall(x1, y1, x2, y2) {
  con.strokeStyle = "blue";
  con.lineWidth = 35;
  if (y1 == y2) {
    x1 -= 0.8;
    x2 += 0.8;
  }
  if (x1 == x2) {
    y1 -= 0.8;
    y2 += 0.8;
  }
  con.beginPath();
  con.moveTo(x1 * magnification + offsetX, y1 * magnification + offsetY);
  con.lineTo(x2 * magnification + offsetX, y2 * magnification + offsetY);
  con.stroke();
}

function DrawAisles() {
  DrawAisle(0, 0, 11, 0);
  DrawAisle(0, 4, 25, 4);
  DrawAisle(0, 7, 5, 7);
  DrawAisle(11, 0, 11, 4);
  DrawAisle(0, 0, 0, 7);
  DrawAisle(5, 0, 5, 25);
  DrawAisle(0, 7, 5, 7);
  DrawAisle(0, 13, 8, 13);
  DrawAisle(14, 0, 25, 0);
  DrawAisle(14, 4, 25, 4);
  DrawAisle(20, 7, 25, 7);
  DrawAisle(25, 0, 25, 7);
  DrawAisle(20, 0, 20, 25);
  DrawAisle(14, 0, 14, 4);
  DrawAisle(8, 4, 8, 7);
  DrawAisle(17, 4, 17, 7);
  DrawAisle(8, 7, 11, 7);
  DrawAisle(14, 7, 17, 7);
  DrawAisle(8, 7, 11, 7);
  DrawAisle(14, 7, 17, 7);
  DrawAisle(11, 7, 11, 10);
  DrawAisle(14, 7, 14, 10);
  DrawAisle(8, 10, 17, 10);
  DrawAisle(8, 16, 17, 16);
  DrawAisle(8, 10, 8, 19);
  DrawAisle(17, 10, 17, 19);
  DrawAisle(17, 13, 25, 13);
  DrawAisle(0, 19, 11, 19);
  DrawAisle(14, 19, 25, 19);
  DrawAisle(0, 19, 0, 22);
  DrawAisle(11, 19, 11, 22);
  DrawAisle(14, 19, 14, 22);
  DrawAisle(25, 19, 25, 22);
  DrawAisle(5, 22, 20, 22);
  DrawAisle(0, 22, 2, 22);
  DrawAisle(23, 22, 25, 22);
  DrawAisle(2, 22, 2, 25);
  DrawAisle(8, 22, 8, 25);
  DrawAisle(17, 22, 17, 25);
  DrawAisle(23, 22, 23, 25);
  DrawAisle(0, 25, 5, 25);
  DrawAisle(8, 25, 11, 25);
  DrawAisle(14, 25, 17, 25);
  DrawAisle(20, 25, 25, 25);
  DrawAisle(0, 25, 0, 28);
  DrawAisle(11, 25, 11, 28);
  DrawAisle(14, 25, 14, 28);
  DrawAisle(25, 25, 25, 28);
  DrawAisle(0, 28, 25, 28);
}
function DrawWalls() {
  DrawWall(0, 0, 11, 0);
  DrawWall(0, 4, 25, 4);
  DrawWall(0, 7, 5, 7);
  DrawWall(11, 0, 11, 4);
  DrawWall(0, 0, 0, 7);
  DrawWall(5, 0, 5, 25);
  DrawWall(0, 7, 5, 7);
  DrawWall(0, 13, 8, 13);
  DrawWall(14, 0, 25, 0);
  DrawWall(20, 7, 25, 7);
  DrawWall(25, 0, 25, 7);
  DrawWall(20, 0, 20, 25);
  DrawWall(14, 0, 14, 4);
  DrawWall(8, 4, 8, 7);
  DrawWall(17, 4, 17, 7);
  DrawWall(8, 7, 11, 7);
  DrawWall(14, 7, 17, 7);
  DrawWall(8, 7, 11, 7);
  DrawWall(14, 7, 17, 7);
  DrawWall(11, 7, 11, 10);
  DrawWall(14, 7, 14, 10);
  DrawWall(8, 10, 17, 10);
  DrawWall(8, 16, 17, 16);
  DrawWall(8, 10, 8, 19);
  DrawWall(17, 10, 17, 19);
  DrawWall(17, 13, 25, 13);
  DrawWall(0, 19, 11, 19);
  DrawWall(14, 19, 25, 19);
  DrawWall(0, 19, 0, 22);
  DrawWall(11, 19, 11, 22);
  DrawWall(14, 19, 14, 22);
  DrawWall(25, 19, 25, 22);
  DrawWall(5, 22, 20, 22);
  DrawWall(0, 22, 2, 22);
  DrawWall(23, 22, 25, 22);
  DrawWall(2, 22, 2, 25);
  DrawWall(8, 22, 8, 25);
  DrawWall(17, 22, 17, 25);
  DrawWall(23, 22, 23, 25);
  DrawWall(0, 25, 5, 25);
  DrawWall(8, 25, 11, 25);
  DrawWall(14, 25, 17, 25);
  DrawWall(20, 25, 25, 25);
  DrawWall(0, 25, 0, 28);
  DrawWall(11, 25, 11, 28);
  DrawWall(14, 25, 14, 28);
  DrawWall(25, 25, 25, 28);
  DrawWall(0, 28, 25, 28);
}

function DrawMazes() {
  con.fillStyle = "black";
  con.fillRect(0, 0, can.width, can.height);
  DrawWalls();
  DrawAisles();
}
function CanMoveNorth(x, y) {
  if (x == 0 || x == 25) {
    if (0 < y && y <= 7) return true;
    if (19 < y && y <= 22) return true;
    if (25 < y && y <= 28) return true;
    return false;
  }
  if (x == 2 || x == 23) {
    if (22 < y && y <= 25) return true;
    return false;
  }
  if (x == 5 || x == 20) {
    if (0 < y && y <= 25) return true;
    return false;
  }
  if (x == 8 || x == 17) {
    if (4 < y && y <= 7) return true;
    if (10 < y && y <= 19) return true;
    if (22 < y && y <= 25) return true;
    return false;
  }
  if (x == 11 || x == 14) {
    if (0 < y && y <= 4) return true;
    if (7 < y && y <= 10) return true;
    if (19 < y && y <= 22) return true;
    if (25 < y && y <= 28) return true;
    return false;
  }
  return false;
}
function CanMoveSouth(x, y) {
  if (x == 0 || x == 25) {
    if (0 <= y && y < 7) return true;
    if (19 <= y && y < 22) return true;
    if (25 <= y && y < 28) return true;
    return false;
  }
  if (x == 2 || x == 23) {
    if (22 <= y && y < 25) return true;
    return false;
  }
  if (x == 5 || x == 20) {
    if (0 <= y && y < 25) return true;
    return false;
  }
  if (x == 8 || x == 17) {
    if (4 <= y && y < 7) return true;
    if (10 <= y && y < 19) return true;
    if (22 <= y && y < 25) return true;
    return false;
  }
  if (x == 11 || x == 14) {
    if (0 <= y && y < 4) return true;
    if (7 <= y && y < 10) return true;
    if (19 <= y && y < 22) return true;
    if (25 <= y && y < 28) return true;
    return false;
  }
  return false;
}
function CanMoveEast(x, y) {
  if (y == 0) {
    if (0 <= x && x < 11) return true;
    if (14 <= x && x < 25) return true;
    return false;
  }
  if (y == 4) {
    if (0 <= x && x < 25) return true;
    return false;
  }
  if (y == 7) {
    if (0 <= x && x < 5) return true;
    if (8 <= x && x < 11) return true;
    if (14 <= x && x < 17) return true;
    if (20 <= x && x < 25) return true;
    return false;
  }
  if (y == 10) {
    if (8 <= x && x < 17) return true;
    return false;
  }
  if (y == 13) {
    if (0 <= x && x < 8) return true;
    if (17 <= x && x < 25) return true;
    return false;
  }
  if (y == 16) {
    if (8 <= x && x < 17) return true;
    return false;
  }
  if (y == 19) {
    if (0 <= x && x < 11) return true;
    if (14 <= x && x < 25) return true;
    return false;
  }
  if (y == 22) {
    if (0 <= x && x < 2) return true;
    if (5 <= x && x < 20) return true;
    if (23 <= x && x < 25) return true;
    return false;
  }
  if (y == 25) {
    if (0 <= x && x < 5) return true;
    if (8 <= x && x < 11) return true;
    if (14 <= x && x < 17) return true;
    if (20 <= x && x < 25) return true;
    return false;
  }
  if (y == 28) {
    if (0 <= x && x < 25) return true;
    return false;
  }
  return false;
}
function CanMoveWest(x, y) {
  if (y == 0) {
    if (0 < x && x <= 11) return true;
    if (14 < x && x <= 25) return true;
    return false;
  }
  if (y == 4) {
    if (0 < x && x <= 25) return true;
    return false;
  }
  if (y == 7) {
    if (0 < x && x <= 5) return true;
    if (8 < x && x <= 11) return true;
    if (14 < x && x <= 17) return true;
    if (20 < x && x <= 25) return true;
    return false;
  }
  if (y == 10) {
    if (8 < x && x <= 17) return true;
    return false;
  }
  if (y == 13) {
    if (0 < x && x <= 8) return true;
    if (17 < x && x <= 25) return true;
    return false;
  }
  if (y == 16) {
    if (8 < x && x <= 17) return true;
    return false;
  }
  if (y == 19) {
    if (0 < x && x <= 11) return true;
    if (14 < x && x <= 25) return true;
    return false;
  }
  if (y == 22) {
    if (0 < x && x <= 2) return true;
    if (5 < x && x <= 20) return true;
    if (23 < x && x <= 25) return true;
    return false;
  }
  if (y == 25) {
    if (0 < x && x <= 5) return true;
    if (8 < x && x <= 11) return true;
    if (14 < x && x <= 17) return true;
    if (20 < x && x <= 25) return true;
    return false;
  }
  if (y == 28) {
    if (0 < x && x <= 25) return true;
    return false;
  }
  return false;
}
