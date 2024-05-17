class Pacman {
  constructor() {
    this.Position = null;
    this.Direct = Direct.West;
    this.NextDirect = Direct.West;
    this.PrevDirect = Direct.West;
    this.Position = new Position();
    this.Direct = Direct.West;
    this.NextDirect = Direct.West;
  }
  GoHome() {
    this.Position.CenterX = 12.5;
    this.Position.CenterY = 22;
    this.Direct = Direct.West;
    this.NextDirect = Direct.West;
  }
  Move() {
    if (this.Direct == Direct.West) this.Position.CenterX -= 0.1;
    if (this.Direct == Direct.East) this.Position.CenterX += 0.1;
    if (this.Direct == Direct.North) this.Position.CenterY -= 0.1;
    if (this.Direct == Direct.South) this.Position.CenterY += 0.1;
    let x = Math.round(this.Position.CenterX * 10) / 10;
    let y = Math.round(this.Position.CenterY * 10) / 10;
    this.Position.CenterX = x;
    this.Position.CenterY = y;

    if (CanMoveSouth(x, y) && this.NextDirect == Direct.South)
      this.Direct = Direct.South;
    if (CanMoveNorth(x, y) && this.NextDirect == Direct.North)
      this.Direct = Direct.North;
    if (CanMoveEast(x, y) && this.NextDirect == Direct.East)
      this.Direct = Direct.East;
    if (CanMoveWest(x, y) && this.NextDirect == Direct.West)
      this.Direct = Direct.West;

    if (x == 0 && y == 13 && this.Direct == Direct.West)
      this.Position.CenterX = 25;
    if (x == 25 && y == 13 && this.Direct == Direct.East)
      this.Position.CenterX = 0;
    if (!CanMoveSouth(x, y) && this.Direct == Direct.South)
      this.Direct = Direct.None;
    if (!CanMoveNorth(x, y) && this.Direct == Direct.North)
      this.Direct = Direct.None;
    if (!CanMoveEast(x, y) && this.Direct == Direct.East)
      this.Direct = Direct.None;
    if (!CanMoveWest(x, y) && this.Direct == Direct.West)
      this.Direct = Direct.None;
    CheckEatDot();
    CheckHitMonster();
    if (this.Direct != Direct.None) this.PrevDirect = this.Direct;
  }
  GetImageFromDirect(direct) {
    if (direct == Direct.North) return pacmanNorthImage;
    else if (direct == Direct.South) return pacmanSouthImage;
    else if (direct == Direct.East) return pacmanEastImage;
    else if (direct == Direct.West) return pacmanWestImage;
    else return pacmanWestImage;
  }
  Draw() {
    let x = this.Position.CenterX * magnification - charctorSize / 2 + offsetX;
    let y = this.Position.CenterY * magnification - charctorSize / 2 + offsetY;
    let pacmanImage = pacmanNorthImage;
    if (this.Direct != Direct.None)
      pacmanImage = this.GetImageFromDirect(this.Direct);
    else pacmanImage = this.GetImageFromDirect(this.PrevDirect);
    con.drawImage(pacmanImage, x, y, charctorSize, charctorSize);
  }
}
