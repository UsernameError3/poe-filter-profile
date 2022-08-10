
// Scrape Div Card Title to Get List of Div Cards
// const selectElement = document.querySelector(".wikitable");
const divCards = document.querySelectorAll(".wikitable .c-item-hoverbox__activator > a");
const divCardNames = [];

divCards.forEach(element => {
    divCardNames.push(element.textContent);
})
console.log(divCardNames);

// Excel Compare: =IF(ISNA(VLOOKUP(A938,gems!$A$1:$A$2000,1,FALSE)),"No","Yes")