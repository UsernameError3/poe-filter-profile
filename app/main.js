const dotenv = require('dotenv')
const fs = require('fs');
const path = require('path');

// Prepare Environment
dotenv.config();


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

// Single Property Line with no formatting for Lists
const filterRulePropertyListRaw = (property, operator, list) => {
    if (list.length) {
        let value = list.map(r => `${r}`).join(' ');
        if (operator && operator != "") {
            return `    ${property} ${operator} ${value}`
        } else {
            return `    ${property} ${value}`
        }
    } else {
        return;
    }
};

// Single Property Line for Lists
const filterRulePropertyList = (property, operator, list) => {
    if (list.length) {
        let value = list.map(r => `"${r}"`).join(' ');
        
        if (operator && operator != "") {
            return `    ${property} ${operator} ${value}`
        } else {
            return `    ${property} ${value}`
        }
    } else {
        return;
    }
};

// Single Property Line
const filterRuleProperty = (property, operator, value) => {
    if (value !== "" && value !== null) {
        if (operator && operator != "") {
            return `    ${property} ${operator} ${value}`
        } else {
            return `    ${property} ${value}`
        }
    } else {
        return;
    }
};

// Single Property Line for Styles
const filterStyleProperty = (property, value) => {
    if (value !== "" && value !== null || property == "Continue") {
        if (property == "Continue") {
            return `    ${property}`
        } else {
            return `    ${property} ${value}`
        }
    } else {
        return;
    }
};

// Build Filter Rules
const buildFilterRule = (rule, style) => {
    let properties = [];
    properties.push(`${rule.visibility} # Tier: ${rule.ruleTier}-${rule.ruleSortIndex} - ${rule.ruleName}`);
    
    // Add Conditional Array Validation
    if (rule.ItemLevel) {
        if (rule.ItemLevelOperator  || rule.ItemLevelOperator == "") {
            let ItemLevelOperator = rule.ItemLevelOperator;
            properties.push(filterRuleProperty(`ItemLevel`, ItemLevelOperator, rule.ItemLevel));
        } else {
            let ItemLevelOperator = '==';
            properties.push(filterRuleProperty(`ItemLevel`, ItemLevelOperator, rule.ItemLevel));
        }
    }
    if (rule.GemLevel) {
        properties.push(filterRuleProperty(`GemLevel`, null, rule.GemLevel));
    }
    if (rule.AreaLevel) {
        properties.push(filterRuleProperty(`AreaLevel`, null, rule.AreaLevel));
    }
    if (rule.DropLevel) {
        properties.push(filterRuleProperty(`DropLevel`, null, rule.DropLevel));
    }
    if (rule.Identified) {
        properties.push(filterRuleProperty(`Identified`, null, rule.Identified));
    }
    if (rule.Corrupted) {
        properties.push(filterRuleProperty(`Corrupted`, null, rule.Corrupted));
    }
    if (rule.CorruptedMods) {
        properties.push(filterRuleProperty(`CorruptedMods`, null, rule.CorruptedMods));
    }
    if (rule.Mirrored) {
        properties.push(filterRuleProperty(`Mirrored`, null, rule.Mirrored));
    }
    if (rule.LinkedSockets) {
        properties.push(filterRuleProperty(`LinkedSockets`, null, rule.LinkedSockets));
    }
    if (rule.SocketGroup) {
        properties.push(filterRuleProperty(`SocketGroup`, null, rule.SocketGroup));
    }
    if (rule.Sockets) {
        properties.push(filterRuleProperty(`Sockets`, null, rule.Sockets));
    }
    if (rule.Rarity) {
        properties.push(filterRuleProperty(`Rarity`, null, rule.Rarity));
    }
    if (rule.Class) {
        if (rule.ClassOperator  || rule.ClassOperator == "") {
            let ClassOperator = rule.ClassOperator;
            properties.push(filterRulePropertyList(`Class`, ClassOperator, rule.Class));
        } else {
            let ClassOperator = '==';
            properties.push(filterRulePropertyList(`Class`, ClassOperator, rule.Class));
        }
    }
    if (rule.BaseDefencePercentile) {
        properties.push(filterRuleProperty(`BaseDefencePercentile`, null, rule.BaseDefencePercentile));
    }
    if (rule.BaseType) {
        if (rule.BaseTypeOperator || rule.BaseTypeOperator == "") {
            let BaseTypeOperator = rule.BaseTypeOperator;
            properties.push(filterRulePropertyList(`BaseType`, BaseTypeOperator, rule.BaseType));
        } else {
            let BaseTypeOperator = '==';
            properties.push(filterRulePropertyList(`BaseType`, BaseTypeOperator, rule.BaseType));
        }
    }
    if (rule.HasExplicitMod) {
        properties.push(filterRulePropertyList(`HasExplicitMod`, null, rule.HasExplicitMod));
    }
    if (rule.HasInfluence) {
        properties.push(filterRulePropertyListRaw(`HasInfluence`, null, rule.HasInfluence));
    }
    if (rule.HasSearingExarchImplicit) {
        properties.push(filterRuleProperty(`HasSearingExarchImplicit`, null, rule.HasSearingExarchImplicit));
    }
    if (rule.HasEaterOfWorldsImplicit) {
        properties.push(filterRuleProperty(`HasEaterOfWorldsImplicit`, null, rule.HasEaterOfWorldsImplicit));
    }
    if (rule.HasCruciblePassiveTree) {
        properties.push(filterRuleProperty(`HasCruciblePassiveTree`, null, rule.HasCruciblePassiveTree));
    }
    if (rule.MemoryStrands) {
        properties.push(filterRuleProperty(`MemoryStrands`, null, rule.MemoryStrands));
    }
    if (rule.SynthesisedItem) {
        properties.push(filterRuleProperty(`SynthesisedItem`, null, rule.SynthesisedItem));
    }
    if (rule.Foulborn) {
        properties.push(filterRuleProperty(`Foulborn`, null, rule.Foulborn));
    }
    if (rule.FracturedItem) {
        properties.push(filterRuleProperty(`FracturedItem`, null, rule.FracturedItem));
    }
    if (rule.AnyEnchantment) {
        properties.push(filterRuleProperty(`AnyEnchantment`, null, rule.AnyEnchantment));
    }
    if (rule.EnchantmentPassiveNum) {
        properties.push(filterRuleProperty(`EnchantmentPassiveNum`, null, rule.EnchantmentPassiveNum));
    }
    if (rule.EnchantmentPassiveNode) {
        properties.push(filterRuleProperty(`EnchantmentPassiveNode`, null, rule.EnchantmentPassiveNode));
    }
    if (rule.TransfiguredGem) {
        properties.push(filterRuleProperty(`TransfiguredGem`, null, rule.TransfiguredGem));
    }
    if (rule.GemQualityType) {
        properties.push(filterRuleProperty(`GemQualityType`, null, rule.GemQualityType));
    }
    if (rule.AlternateQuality) {
        properties.push(filterRuleProperty(`AlternateQuality`, null, rule.AlternateQuality));
    }
    if (rule.Quality) {
        properties.push(filterRuleProperty(`Quality`, null, rule.Quality));
    }
    if (rule.Replica) {
        properties.push(filterRuleProperty(`Replica`, null, rule.Replica));
    }
    if (rule.MapTier) {
        properties.push(filterRuleProperty(`MapTier`, '==', rule.MapTier));
    }
    if (rule.ZanaMemory) {
        properties.push(filterRuleProperty(`ZanaMemory`, '==', rule.ZanaMemory));
    }
    if (rule.BlightedMap) {
        properties.push(filterRuleProperty(`BlightedMap`, null, rule.BlightedMap));
    }
    if (rule.UberBlightedMap) {
        properties.push(filterRuleProperty(`UberBlightedMap`, null, rule.UberBlightedMap));
    }
    if (rule.Scourged) {
        properties.push(filterRuleProperty(`Scourged`, null, rule.Scourged));
    }
    if (rule.StackSize) {
        properties.push(filterRuleProperty(`StackSize`, null, rule.StackSize));
    }
    if (rule.Width) {
        properties.push(filterRuleProperty(`Width`, '==', rule.Width));
    }
    if (rule.Height) {
        properties.push(filterRuleProperty(`Height`, '==', rule.Height));
    }
    
    // Styles Added Last:
    if (style) {
        properties.push(style);
        // properties.push('\n');        
    }
    
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
    return rules.join('\n\n');
};

// Build Filter Styles
const buildFilterStyle = async (json) => {
    let style = [];
    // Fix this so it doesn't output empty lines
    if (json.SetFontSize) {
        style.push(filterStyleProperty('SetFontSize', json.SetFontSize));
    }
    if (json.SetTextColor) {
        style.push(filterStyleProperty('SetTextColor', hexToRGB(json.SetTextColor)));
    }
    if (json.SetBorderColor) {
        style.push(filterStyleProperty('SetBorderColor', hexToRGB(json.SetBorderColor)));
    }
    if (json.SetBackgroundColor) {
        style.push(filterStyleProperty('SetBackgroundColor', hexToRGB(json.SetBackgroundColor)));
    }
    if (json.PlayAlertSound) {
        style.push(filterStyleProperty('PlayAlertSound', json.PlayAlertSound));
    }
    if (json.MinimapIcon) {
        style.push(filterStyleProperty('MinimapIcon', json.MinimapIcon));
    }
    if (json.PlayEffect) {
        style.push(filterStyleProperty('PlayEffect', json.PlayEffect));
    }
    if (json.Continue == "") {
        style.push(filterStyleProperty('Continue', json.Continue));
    }
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
        questRules: importRuleJSON('data/poe1/quest.json'),
        currencyRules: importRuleJSON('data/poe1/currency.json'),
        divCardRules: importRuleJSON('data/poe1/div_cards.json'),
        scarabRules: importRuleJSON('data/poe1/scarabs.json'),
        fragmentRules: importRuleJSON('data/poe1/fragments.json'),
        mapRules: importRuleJSON('data/poe1/maps.json'),
        idolRules: importRuleJSON('data/poe1/idols.json'),
        relicRules: importRuleJSON('data/poe1/relics.json'),
        leagueCoreRules: importRuleJSON('data/poe1/leagues_core.json'),
        leagueNewRules: importRuleJSON('data/poe1/leagues_new.json'),
        gemRules: importRuleJSON('data/poe1/gems.json'),
        corpseRules: importRuleJSON('data/poe1/corpses.json'),
        jewelRules: importRuleJSON('data/poe1/jewels.json'),
        clusterRules: importRuleJSON('data/poe1/clusters.json'),
        gearFlaskRules: importRuleJSON('data/poe1/gear_normal.json'),
        gearUniqueRules: importRuleJSON('data/poe1/gear_unique.json'),
        gearRareRules: importRuleJSON('data/poe1/gear_rare.json'),
        gearMagicRules: importRuleJSON('data/poe1/gear_magic.json'),
        gearNormalRules: importRuleJSON('data/poe1/gear_normal.json'),
        safetyRules: importRuleJSON('data/poe1/safety.json'),
    };

    // Log Export
    const fileOutputName = path.resolve(`${process.env.GAMEDIR_POE1}/test.filter`);
    console.log('Exporting: ', fileOutputName);

    // Build Style Objects
    const filterStyleLegend = await mapFilterStyleList(filterStyleRules);

    // Main File Data
    const filterFileData = [];
    filterFileData.push(mapFilterRuleList(filterRuleObj.questRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.currencyRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.divCardRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.scarabRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.fragmentRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.mapRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.idolRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.relicRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.leagueCoreRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.leagueNewRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.gemRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.corpseRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.jewelRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.clusterRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.gearFlaskRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.gearUniqueRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.gearRareRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.gearMagicRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.gearNormalRules, filterStyleLegend));
    filterFileData.push(mapFilterRuleList(filterRuleObj.safetyRules, filterStyleLegend));

    // Export Main File List
    fs.writeFileSync(fileOutputName, filterFileData.join('\n\n'));
    console.log('Finished Filter Export...');
    return;
};

module.exports.buildFilterFile = buildFilterFile;
