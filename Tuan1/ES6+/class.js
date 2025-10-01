// Class
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    getJob() {
        console.log(`Toi tên là ${this.name} và tôi làm công việc ${this.job}`)
    }
}
class Worker extends Person {
    constructor(name, age, job) {
        super(name, age);
        this.job = job;
    }
}


const worker = new Worker("Tâm", 21, "Web developer");
console.log(worker);
worker.getJob();