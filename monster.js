class Monster {
  constructor(id, x, y, direct) {
    this.Id = 0;
    this.InitPosition = null;
    this.Position = null;
    this.Direct = Direct.None;
    this.StandbyCount = 0;
    this.IsIjike = false;
    this.IsGoingHome = false;
    this.Id = id;
    this.InitPosition = new Position();
    this.Position = new Position();
    this.InitPosition.CenterX = x;
    this.InitPosition.CenterY = y;
    this.Position.CenterX = x;
    this.Position.CenterY = y;
    this.Direct = direct;
  }
  BeginGoToHome() {
    this.IsIjike = false;
    let x = this.Position.CenterX;
    let y = this.Position.CenterY;
    if (x < 12.5) {
      if (CanMoveEast(x, y)) {
        this.Direct = Direct.East;
        if ((x * 10) % 2 != 0) this.Position.CenterX += 0.1;
      } else {
        if (y <= 11 && CanMoveSouth(x, y)) {
          this.Direct = Direct.South;
          if ((y * 10) % 2 != 0) this.Position.CenterY += 0.1;
        } else {
          this.Direct = Direct.North;
          if ((y * 10) % 2 != 0) this.Position.CenterY -= 0.1;
        }
      }
    } else {
      if (CanMoveWest(x, y)) {
        this.Direct = Direct.West;
        if ((x * 10) % 2 != 0) this.Position.CenterX -= 0.1;
      } else {
        if (y <= 11 && CanMoveSouth(x, y)) {
          this.Direct = Direct.South;
          if ((y * 10) % 2 != 0) this.Position.CenterY += 0.1;
        } else {
          this.Direct = Direct.North;
          if ((y * 10) % 2 != 0) this.Position.CenterY -= 0.1;
        }
      }
    }
  }
  MoveGoToHome() {
    this.Position.CenterX = Math.round(this.Position.CenterX * 10) / 10;
    this.Position.CenterY = Math.round(this.Position.CenterY * 10) / 10;
    let x = this.Position.CenterX;
    let y = this.Position.CenterY;
    if ((x == 12.4 && y == 10) || (x == 12.6 && y == 10)) {
      this.Position.CenterX = 12.5;
      this.Position.CenterY = 13;
      this.Direct = Direct.North;
      this.IsGoingHome = false;
      return;
    }
    if (this.IsCrossPosition())
      this.Direct = GetMonsterDirect(this, 12.5, 10, true);
    if (this.Direct == Direct.West) this.Position.CenterX -= 0.2;
    if (this.Direct == Direct.East) this.Position.CenterX += 0.2;
    if (this.Direct == Direct.North) this.Position.CenterY -= 0.2;
    if (this.Direct == Direct.South) this.Position.CenterY += 0.2;
  }
  Move() {
    this.Position.CenterX = Math.round(this.Position.CenterX * 10) / 10;
    this.Position.CenterY = Math.round(this.Position.CenterY * 10) / 10;
    if (this.IsGoingHome) {
      if (this.Direct == Direct.None) this.BeginGoToHome();
      else this.MoveGoToHome();
      return;
    }

    // もし角にいるなら進行方向を変える
    if (this.IsCrossPosition() || this.Direct == Direct.None) {
      //ThinkDirect(this.Id);
      let SecondDirect = this.IsMonsterRandomMove();
      if (SecondDirect == Direct.West) this.Position.CenterX -= 0.2;
      if (SecondDirect == Direct.East) this.Position.CenterX += 0.2;
      if (SecondDirect == Direct.North) this.Position.CenterY -= 0.2;
      if (SecondDirect == Direct.South) this.Position.CenterY += 0.2;
      this.Direct = SecondDirect;
    }

    // もし巣のなかにいるなら前後に移動させる
    if (this.IsMonsterInHome()) {
      this.MonsterMoveInHome();
    }

    //  巣から出た直後は交差点ではないので、ここで進路選択をする
    if (
      this.Direct == Direct.North &&
      this.Position.CenterX == 12.5 &&
      this.Position.CenterY == 10
    ) {
      let SecondDirect = this.IsMonsterRandomMove();
      if (SecondDirect == Direct.West) this.Position.CenterX -= 0.2;
      if (SecondDirect == Direct.East) this.Position.CenterX += 0.2;
      if (SecondDirect == Direct.North) this.Position.CenterY -= 0.2;
      if (SecondDirect == Direct.South) this.Position.CenterY += 0.2;
      this.Direct = SecondDirect;
    }

    if (this.Direct == Direct.West)
      // 移動させる
      this.Position.CenterX -= 0.1;
    if (this.Direct == Direct.East) this.Position.CenterX += 0.1;
    if (this.Direct == Direct.North) this.Position.CenterY -= 0.1;
    if (this.Direct == Direct.South) this.Position.CenterY += 0.1;

    // ワープさせる
    if (
      this.Position.CenterX == 0 &&
      this.Position.CenterY == 13 &&
      this.Direct == Direct.West
    )
      this.Position.CenterX = 25;
    if (
      this.Position.CenterX == 25 &&
      this.Position.CenterY == 13 &&
      this.Direct == Direct.East
    )
      this.Position.CenterX = 0;

    // イジケ状態から回復させる
    if (CounterattackTime <= 0) this.IsIjike = false;
  }

  // 巣の中にいるモンスターを上下に移動させる
  MonsterMoveInHome() {
    // this.StandbyCount が0になったら巣の中央に移動させ巣の外に移動させる
    if (this.StandbyCount == 0) {
      if (this.Position.CenterX == 12.5 && this.Position.CenterY > 10) {
        console.log("X=" + this.Position.CenterX);
        this.Direct = Direct.North;
      } else if (this.Position.CenterX < 12.5) {
        this.Direct = Direct.East;
      } else if (this.Position.CenterX > 12.5) {
        this.Direct = Direct.West;
      }
    } else {
      // this.StandbyCount が0よりも大きいときは上下に移動させる
      if (this.Position.CenterY == 12) this.Direct = Direct.South;
      if (this.Position.CenterY == 14) {
        this.Direct = Direct.North;
        this.StandbyCount--;
      }
    }
  }

  // モンスターは巣の中にいるのか？
  IsMonsterInHome() {
    if (
      8.5 < this.Position.CenterX &&
      this.Position.CenterX < 17 &&
      10 < this.Position.CenterY &&
      this.Position.CenterY < 16
    )
      return true;
    else return false;
  }

  // モンスターが進行可能な方向の配列を取得する

  GetDirectsMonsterMove() {
    let x = this.Position.CenterX;
    let y = this.Position.CenterY;
    let ret = [];
    if (this.IsCrossPosition()) {
      if (CanMoveNorth(x, y) && this.Direct != Direct.South)
        ret.push(Direct.North);
      if (CanMoveEast(x, y) && this.Direct != Direct.West)
        ret.push(Direct.East);
      if (CanMoveSouth(x, y) && this.Direct != Direct.North)
        ret.push(Direct.South);
      if (CanMoveWest(x, y) && this.Direct != Direct.East)
        ret.push(Direct.West);
    } else {
      if (CanMoveNorth(x, y)) ret.push(Direct.North);
      if (CanMoveEast(x, y)) ret.push(Direct.East);
      if (CanMoveSouth(x, y)) ret.push(Direct.South);
      if (CanMoveWest(x, y)) ret.push(Direct.West);
    }
    return ret;
  }

  IsMonsterRandomMove() {
    let direction = this.GetDirectsMonsterMove(); //北と南,西→ direct[1, 2, 3] // 進める方向の配列
    let index = Math.floor(Math.random() * direction.length); //０or１or2 帰ってくる
    if (direction.length <= 1) {
      return direction[0];
    } else {
      return direction[index];
    }
  }
  // モンスターは曲がり角や十字路、T字路にいるのか？
  IsCrossPosition() {
    let x = this.Position.CenterX;
    let y = this.Position.CenterY;
    if (y == 0) {
      if (x == 0 || x == 5 || x == 11 || x == 14 || x == 20 || x == 25)
        return true;
      return false;
    }
    if (y == 4) {
      if (
        x == 0 ||
        x == 5 ||
        x == 8 ||
        x == 11 ||
        x == 14 ||
        x == 17 ||
        x == 20 ||
        x == 25
      )
        return true;
      return false;
    }
    if (y == 7) {
      if (
        x == 0 ||
        x == 5 ||
        x == 8 ||
        x == 11 ||
        x == 14 ||
        x == 17 ||
        x == 20 ||
        x == 25
      )
        return true;
      return false;
    }
    if (y == 10) {
      if (x == 8 || x == 11 || x == 14 || x == 17) return true;
      return false;
    }
    if (y == 13) {
      if (x == 5 || x == 8 || x == 17 || x == 20) return true;
      return false;
    }
    if (y == 16) {
      if (x == 8 || x == 17) return true;
      return false;
    }
    if (y == 19) {
      if (
        x == 0 ||
        x == 5 ||
        x == 8 ||
        x == 11 ||
        x == 14 ||
        x == 17 ||
        x == 20 ||
        x == 25
      )
        return true;
      return false;
    }
    if (y == 22) {
      if (
        x == 0 ||
        x == 2 ||
        x == 5 ||
        x == 8 ||
        x == 11 ||
        x == 14 ||
        x == 17 ||
        x == 20 ||
        x == 23 ||
        x == 25
      )
        return true;
      return false;
    }
    if (y == 25) {
      if (
        x == 0 ||
        x == 2 ||
        x == 5 ||
        x == 8 ||
        x == 11 ||
        x == 14 ||
        x == 17 ||
        x == 20 ||
        x == 23 ||
        x == 25
      )
        return true;
      return false;
    }
    if (y == 28) {
      if (x == 0 || x == 11 || x == 14 || x == 25) return true;
      return false;
    }
    return false;
  }
  Draw() {
    let monsterImage = monsterImages[this.Id];
    if (this.IsIjike) {
      if (CounterattackTime > 5000 || stoping) {
        monsterImage = ijikeImages[0];
      } else {
        if (CounterattackTime % 1000 < 500) {
          monsterImage = ijikeImages[0];
        } else {
          monsterImage = ijikeImages[1];
        }
      }
    }
    if (this.IsGoingHome) {
      monsterImage = monsterEyeImage;
    }
    let x = this.Position.CenterX * magnification - charctorSize / 2 + offsetX;
    let y = this.Position.CenterY * magnification - charctorSize / 2 + offsetY;
    con.drawImage(monsterImage, x, y, charctorSize, charctorSize);
  }

  // パックマンに撃退されたモンスターを巣の中に移動させる
  MonsterGoHome() {
    this.Direct = Direct.None;
    this.IsGoingHome = true;
  }

  // パックマンがパワー餌を食べたときに方向転換させる
  ReverseMove() {
    if (this.IsMonsterInHome()) return;
    let x = this.Position.CenterX;
    let y = this.Position.CenterY;
    if (this.Direct == Direct.North && CanMoveSouth(x, y))
      this.Direct = Direct.South;
    else if (this.Direct == Direct.South && CanMoveNorth(x, y))
      this.Direct = Direct.North;
    else if (this.Direct == Direct.East && CanMoveWest(x, y))
      this.Direct = Direct.West;
    else if (this.Direct == Direct.West && CanMoveEast(x, y))
      this.Direct = Direct.East;
  }
}
