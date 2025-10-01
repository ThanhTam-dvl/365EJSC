
// // Enhanced object property
function person(name, age) {
    const club = "Manchester";
    return {
        name,
        age,
        getName() {
            return this.name + " " + this.age;
        },
        [`${club} is Red`]: 'Manchester United'
    }
}
console.log(person("Tâm", 21));
console.log(person("Tâm", 21).getName());
//-------------------------------------------

// // Extened prameter handling
const todoList = ["Da banh", "Choi game", "Di lam"];
const todoListMore = ["An com", "Ngu", ...todoList];
console.log("todoListMore", todoListMore);

const person = {
    name: "Tâm",
    age: 21
}
const worker = {
    job: "Web developer",
    ...person
}
console.log("worker", worker);
//-------------------------------------------




