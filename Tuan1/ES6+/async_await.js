// Async/await
const getData = async () => {
  try {
    const response = await fetch("https://backend-footballwebsite.onrender.com/api/fields");
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error("Error:", err);
  }
};
getData();

