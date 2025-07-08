const arrofnumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function get6RandomNumber() {
  let randomNumber = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * arrofnumbers.length);
    randomNumber += arrofnumbers[randomIndex];
  }

  return randomNumber; // ✅ Return the value
}
export default get6RandomNumber;
