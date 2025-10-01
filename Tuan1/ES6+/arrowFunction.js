// arrow function
const sum = (a, b) => a + b; 
console.log(`Kết quả a + b là: ${sum(178, 32)}`);

const person = {
    name: "Tâm",
    age: 21,
    getDescription: function() {
        console.log(
            `Tôi tên là ${this.name} năm nay ${this.age} tuổi`
        );
        const getAge = (feel) => 
            console.log(`Năm tới tôi sẽ ${this.age + 1} tuổi và tôi rất ${feel}`);
        getAge("buồn");
    }
}
person.getDescription(); 