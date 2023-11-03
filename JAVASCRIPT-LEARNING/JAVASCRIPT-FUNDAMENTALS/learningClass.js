class People{
    _num = 10
    constructor(name){
        this.name = name;
    }
    introduceYourself() {
        console.log(`Hi i am ${this.name}`);
    }
}
class Professor extends People{
    constructor(name, teaches) {
        super(name);
        this.name = name;
        this.teaches = teaches;
    };
    introduceYourself() {
        console.log(`Hi i am professor ${this.name} and i will teach ${this.teaches}`);
    }

}

class Student extends People{
    _year = 1
    constructor(name) {
        super(name);
    };
    introduceYourself() {
        console.log(`Hi i am ${this.name} and i am student of this University ${this._year}`);
    }
}

let professor1 = new Professor("Walsh", "Psychology");
professor1.introduceYourself();
let student1 = new Student("Ram");
student1.introduceYourself()
console.log(student1.name)
console.log(student1._year)
console.log(student1._num)
