
// Scrape Div Card Title to Get List of Div Cards
// const selectElement = document.querySelector(".wikitable");
const divCards = document.querySelectorAll(".wikitable .c-item-hoverbox__activator > a");
const divCardNames = [];

divCards.forEach(element => {
    divCardNames.push(element.textContent);
})
console.log(divCardNames);

// Excel Compare: =IF(ISNA(VLOOKUP(A938,gems!$A$1:$A$2000,1,FALSE)),"No","Yes")


// Item Mod Data
// https://www.pathofexile.com/item-data/mods

const itemMods = document.querySelectorAll(".itemDataTable > tbody > tr");
const itemModObjList = [];

itemMods.forEach(element => {
    let itemModProperties = element.querySelectorAll("td");

    let itemModObj = {
        itemModPool: itemModProperties[0].textContent,
        itemModName: itemModProperties[1].textContent,
        itemModLevel: itemModProperties[2].textContent,
        itemModStat: itemModProperties[3].textContent,
        itemModTags: itemModProperties[4].textContent
    }

    itemModObjList.push(itemModObj);
})
console.log(itemModObjList);


// Item Mod Data (wiki)
// https://www.poewiki.net/wiki/List_of_one-handed_axe_modifiers

const itemModTables = document.querySelectorAll(".mw-collapsible > tbody");
const itemModObjList = [];
const alphaRegex = /[^a-zA-Z0-9']/g;
const numberRegex = /[^0-9]/g;

itemModTables.forEach(itemModTable => {
    let itemModTierObjList = {
        itemModPool:    'tbd',
        itemModTags:    'tbd',
        itemModHeader:  null,    
        itemModTiers:   []
    }
    try {
        let itemModTiers = itemModTable.querySelectorAll("tr");

        for (let i = 0; i < itemModTiers.length; i++) {
            if (i === 0) {
                let itemModTableColHeader = itemModTiers[i].querySelector("th");
                itemModTierObjList.itemModHeader = itemModTableColHeader.querySelector("em").textContent;
            } else {
                let itemModTableCol = itemModTiers[i].querySelectorAll("td");
                let itemModTierObj = {
                    itemModWikiLink:    itemModTableCol[0].querySelector("a").href,
                    itemModName:        itemModTableCol[0].querySelector("a").textContent.replace(alphaRegex, " "),
                    itemModLevel:       itemModTableCol[1].textContent.replace(numberRegex, ""),
                    itemModStat:        itemModTableCol[2].querySelector("em").textContent
                }
                itemModTierObjList.itemModTiers.push(itemModTierObj);
            }
        };

    } catch (error) {
        console.log("Error While Parsing Tables...", error);
    }
    itemModObjList.push(itemModTierObjList);  
})
console.log(itemModObjList);











