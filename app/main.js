const fs = require('fs');
const path = require('path');

// Convert Hex to Flat RGBA
const hexToRGB = (hex) => {
    // Convert Hex Codes
    if (hex.length > 7) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const a = parseInt(hex.slice(7, 9), 16) / 255;

        // Always return RGBA Value
        return `${r} ${g} ${b} ${a}`;
    } else {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const a = 255;
        
        // Always return RGBA Value
        return `${r} ${g} ${b} ${a}`;
    }
};

// Single Property Line for Lists
const filterRulePropertyList = (property, operator, list) => {
    if (list.length) {
        let value = list.map(r => `"${r}"`).join(' ');
        return `    ${property} ${operator} ${value}`
    } else {
        return;
    }
};

// Single Property Line
const filterRuleProperty = (property, operator, value) => {
    if (value !== "" && value !== null) {
        return `    ${property} ${operator} ${value}`
    } else {
        return;
    }
};

// Single Property Line for Styles
const filterStyleProperty = (property, value) => {
    if (value !== "" && value !== null) {
        return `    ${property} ${value}`
    } else {
        return;
    }
};

// Build Filter Rules
const buildFilterRule = (rule, style) => {
    let properties = [];
    properties.push(`${rule.visibility} # Tier: ${rule.ruleTier}-${rule.ruleSortIndex} - ${rule.ruleName}`);
    properties.push(filterRuleProperty(`Class`, '==', rule.Class));
    properties.push(filterRulePropertyList(`BaseType`, '==', rule.BaseType));
    properties.push(style);
    properties.push('\n');

    // Join Properties into Rule
    return properties.join('\n');
};

// Map Filter Rules
const mapFilterRuleList = (json, styles) => {
    // Build Rules from Object
    const filterRules = json.rules;
    let rules = [];

    for (let i = 0; i < filterRules.length; i++) {
        // Find Matching Style
        for (let s = 0; s < styles.length; s++) {
            if (filterRules[i].styleName === styles[s].styleName) {
                rules.push(buildFilterRule(filterRules[i], styles[s].styleData));
            }
        }
    }

    // Join Rule List
    return rules.join('\n');
};

// Build Filter Styles
const buildFilterStyle = async (json) => {
    let style = [];
    // Fix this so it doesn't output empty lines
    style.push(filterStyleProperty('SetFontSize', json.SetFontSize));
    style.push(filterStyleProperty('SetTextColor', hexToRGB(json.SetTextColor)));
    style.push(filterStyleProperty('SetBorderColor', hexToRGB(json.SetBorderColor)));
    style.push(filterStyleProperty('SetBackgroundColor', hexToRGB(json.SetBackgroundColor)));
    style.push(filterStyleProperty('PlayAlertSound', json.PlayAlertSound));
    style.push(filterStyleProperty('MinimapIcon', json.MinimapIcon));
    style.push(filterStyleProperty('PlayEffect', json.PlayEffect));

    // Join Style Array
    return style.join('\n');
};

// Map Filter Styles
const mapFilterStyleList = async (json) => {
    const styles = [];

    for (let i = 0; i < json.length; i++) {
        let filterStyleObj = {
            styleName: json[i].styleName,
            styleData: await buildFilterStyle(json[i])
        };

        // Push Style Data to Legend
        styles.push(filterStyleObj);
    }

    return styles;
};


// Parse JSON Configs
const importRuleJSON = (file) => {
    let filePath = path.resolve(file);
    let data = JSON.parse(fs.readFileSync(filePath));
    return data;
};

// Main File
const buildFilterFile = async () => {
    const filterStyleRules = importRuleJSON('data/styles/default.json');
    const filterRuleObj = {
        currencyRules: importRuleJSON('data/poe1/currency.json'),
        fragmentRules: importRuleJSON('data/poe1/fragments.json'),
        divCardRules: importRuleJSON('data/poe1/div_cards.json'),
        leagueRules: importRuleJSON('data/poe1/leagues.json'),
        mapRules: importRuleJSON('data/poe1/maps.json'),
        gearUniqueRules: importRuleJSON('data/poe1/gear_unique.json'),
        gearRareRules: importRuleJSON('data/poe1/gear_rare.json'),
        gearMagicRules: importRuleJSON('data/poe1/gear_magic.json'),
        gearNormalRules: importRuleJSON('data/poe1/gear_normal.json'),
        gearFlaskRules: importRuleJSON('data/poe1/gear_normal.json')
    };

    // Log Export
    const fileOutputName = path.resolve('exports/test.filter');
    console.log('Exporting: ', fileOutputName);

    // Build Style Objects
    const filterStyleLegend = await mapFilterStyleList(filterStyleRules);

    // Main File Data
    const filterFileData = [];
    filterFileData.push(mapFilterRuleList(filterRuleObj.currencyRules, filterStyleLegend));

    // Finish Other FIlter Rule Sets

    // Export Main File List
    fs.writeFileSync(fileOutputName, filterFileData.join('\n'));
    console.log('Finished Filter Export...');
    return;
};

module.exports.buildFilterFile = buildFilterFile;
