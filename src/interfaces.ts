import { Sprite, Graphics } from "pixi.js";

export interface ICoordinates {
  x: number;
  y: number;
}
export interface IObjectPolygon {
  type: string;
  name: string;

  visible: boolean;

  width: number;
  height: number;
  x: number;
  y: number;
  id: number;
  rotation: number;

  polygon: ICoordinates[];
}

export interface ILayer {
  draworder?: string;
  id: number;
  name: string;
  objects: IObjectPolygon[];
}
export interface IColisionsJSON {
  layers: ILayer[];
}

export interface IPlayer extends Sprite {
  speedX: number;
  speedY: number;
  positionX: number;
  positionY: number;
}

export interface IGraphics extends Graphics {
  type?: string;
}
export interface IParentGraphics extends Graphics {
  children: IGraphics;
}
