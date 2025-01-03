export interface ICoordinates {
    "x":number
    "y":number
}
export interface IObjectPolygon {
    "type":string
    "name":string

    "visible":boolean,

    "width":number
    "height":number
    "x":number
    "y":number
    "id":number
    "rotation":number

    "polygon": ICoordinates[]
}

export interface ILayer {
    draworder?: string
    id:number
    name:string
    objects:IObjectPolygon[]
}
export interface IColisionsJSON {
    layers: ILayer[]
}