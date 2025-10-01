// Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Đã nhận data!"), 2000);
  });
};

fetchData().then(data => console.log(data)); 