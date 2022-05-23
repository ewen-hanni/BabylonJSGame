
import Salve from "./Salve.js"; 

export default class Wave extends Salve {
    constructor(numeroS, NombreDennemis , numeroW, NombreDesalve ) {
       super(numeroS, NombreDennemis );
      this.numeroW = numeroW;
      this.NombreDesalve = NombreDesalve;

    }
  }