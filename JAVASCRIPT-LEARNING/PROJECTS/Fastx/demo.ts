class a{
    name:string = "a";
    constructor(){
        console.log(this.name);
    }
}

class b extends a{
    name:string = "b";
}

let b1 = new b();

