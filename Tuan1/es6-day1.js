// // let và const
// let name = "Tâm";
// name = "Tam dz";

// const age = 21;
// // age = 22;

// console.log(name, age);
// -------------------------------------------

// // arrow function
// const sum = (a, b) => a + b; 
// console.log(`Kết quả a + b là: ${sum(178, 32)}`);

// const person = {
//     name: "Tâm",
//     age: 21,
//     getDescription: function() {
//         console.log(
//             `Tôi tên là ${this.name} năm nay ${this.age} tuổi`
//         );
//         const getAge = (feel) => 
//             console.log(`Năm tới tôi sẽ ${this.age + 1} tuổi và tôi rất ${feel}`);
//         getAge("buồn");
//     }
// }
// person.getDescription(); 
// -------------------------------------------

// // template string
// const name1 = "Tâm";
// const age1 = 21;

// console.log(`Năm nay tôi ${age1} tuổi
// Tôi tên là ${name1}`);
// -------------------------------------------

// // Enhanced object property
// function person(name, age) {
//     const club = "Manchester";
//     return {
//         name,
//         age,
//         getName() {
//             return this.name + " " + this.age;
//         },
//         [`${club} is Red`]: 'Manchester United'
//     }
// }
// console.log(person("Tâm", 21));
// console.log(person("Tâm", 21).getName());
//-------------------------------------------

// // Extened prameter handling
// const todoList = ["Da banh", "Choi game", "Di lam"];
// const todoListMore = ["An com", "Ngu", ...todoList];
// console.log("todoListMore", todoListMore);

// const person = {
//     name: "Tâm",
//     age: 21
// }
// const worker = {
//     job: "Web developer",
//     ...person
// }
// console.log("worker", worker);
//-------------------------------------------

// // Destructuring
// const getFullName = ({name, job}) => {
//     console.log(`Tôi tên là ${name} và tôi là ${job}`)
// }
// getFullName({name: "Tâm", job: "Web developer"});
//-------------------------------------------

// // Module import/export
// import { name, age, add } from "./testexport.js";
// console.log(name, age);
// console.log(add(2, 3));
//-------------------------------------------

// // Class
// class Person {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age;
//     }
//     getJob() {
//         console.log(`Toi tên là ${this.name} và tôi làm công việc ${this.job}`)
//     }
// }
// class Worker extends Person {
//     constructor(name, age, job) {
//         super(name, age);
//         this.job = job;
//     }
// }


// const worker = new Worker("Tâm", 21, "Web developer");
// console.log(worker);
// worker.getJob();
//-------------------------------------------

// // Promise
// const fetchData = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => resolve("Đã nhận data!"), 2000);
//   });
// };

// fetchData().then(data => console.log(data)); 
//-------------------------------------------

// // Async/await
// const getData = async () => {
//   try {
//     const response = await fetch("https://backend-footballwebsite.onrender.com/api/fields");
//     const data = await response.json();
//     console.log(data);
//   } catch (err) {
//     console.error("Error:", err);
//   }
// };
// getData();

