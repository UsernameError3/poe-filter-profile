const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { stringify } = require('querystring');
const inputPath = `${__dirname}/filter_data`;
const outputPath = `${__dirname}/exports`;
const examplePath = `${__dirname}/example_data`;

const listStrictness = [
    'Soft',
    'Regular',
    'Semi-Strict',
    'Strict',
    'Very-Strict',
    'Uber-Strict',
    'Uber-Plus-Strict'
];

const filterComponentFilePath = [
    '0100_OVERRIDE_AREA_1_Override_ALL_rules_here/0100_OVERRIDE_AREA_1_Override_ALL_rules_here',
    '0100_Global_overriding_rules/0100_Global_overriding_rules',
    '0200_High_tier_influenced_items/0200_High_tier_influenced_items',
    '0200_High_tier_influenced_items/0201_Influenced_Maps/0201_Influenced_Maps',
    '0200_High_tier_influenced_items/0202_Common_Tier_T1/0202_Common_Tier_T1',
    '0200_High_tier_influenced_items/0203_Specialised_Tier_T1/0203_Specialised_Tier_T1',
    '0200_High_tier_influenced_items/0204_Common_Tier_T2/0204_Common_Tier_T2',
    '0200_High_tier_influenced_items/0205_Specialised_Tier_T2/0205_Specialised_Tier_T2',
    '0200_High_tier_influenced_items/0206_Remaining/0206_Remaining',
    '0300_ELDRITCH_ITEMS/0300_ELDRITCH_ITEMS',
    '0400_Exotic_Bases/0400_Exotic_Bases',
    '0500_IDENTIFIED_MOD_FILTERING/0500_IDENTIFIED_MOD_FILTERING',
    '0500_IDENTIFIED_MOD_FILTERING/0501_ID_Mod_exceptions_override_id_mod_matching_section/0501_ID_Mod_exceptions_override_id_mod_matching_section',
    '0500_IDENTIFIED_MOD_FILTERING/0502_Physical/0502_Physical',
    '0500_IDENTIFIED_MOD_FILTERING/0503_Elemental/0503_Elemental',
    '0500_IDENTIFIED_MOD_FILTERING/0504_Gembased/0504_Gembased',
    '0500_IDENTIFIED_MOD_FILTERING/0505_Caster/0505_Caster',
    '0500_IDENTIFIED_MOD_FILTERING/0506_Spellslinger/0506_Spellslinger',
    '0500_IDENTIFIED_MOD_FILTERING/0507_Helmets/0507_Helmets',
    '0500_IDENTIFIED_MOD_FILTERING/0508_Boots/0508_Boots',
    '0500_IDENTIFIED_MOD_FILTERING/0509_Gloves/0509_Gloves',
    '0500_IDENTIFIED_MOD_FILTERING/0510_Shields/0510_Shields',
    '0500_IDENTIFIED_MOD_FILTERING/0511_Amulets/0511_Amulets',
    '0500_IDENTIFIED_MOD_FILTERING/0512_Rings/0512_Rings',
    '0500_IDENTIFIED_MOD_FILTERING/0513_Quivers/0513_Quivers',
    '0500_IDENTIFIED_MOD_FILTERING/0514_Body_Armours/0514_Body_Armours',
    '0500_IDENTIFIED_MOD_FILTERING/0515_Belts/0515_Belts',
    '0500_IDENTIFIED_MOD_FILTERING/0516_Jewels/0516_Jewels',
    '0600_Exotic_Mods_Filtering/0600_Exotic_Mods_Filtering',
    '0600_Exotic_Mods_Filtering/0601_Veiled_Betrayal_low_prio_veiled_items/0601_Veiled_Betrayal_low_prio_veiled_items',
    '0600_Exotic_Mods_Filtering/0602_Incursion_Temple_Mods/0602_Incursion_Temple_Mods',
    '0600_Exotic_Mods_Filtering/0603_Bestiary/0603_Bestiary',
    '0600_Exotic_Mods_Filtering/0604_Other/0604_Other',
    '0700_Exotic_Item_Classes/0700_Exotic_Item_Classes',
    '0700_Exotic_Item_Classes/0701_Voidstones/0701_Voidstones',
    '0700_Exotic_Item_Classes/0702_Trinkets/0702_Trinkets',
    '0700_Exotic_Item_Classes/0703_Secret_Society_Equipment/0703_Secret_Society_Equipment',
    '0700_Exotic_Item_Classes/0704_Craftable_Invitations/0704_Craftable_Invitations',
    '0800_Exotic_Item_Variations/0800_Exotic_Item_Variations',
    '0800_Exotic_Item_Variations/0801_Double_Corruptions/0801_Double_Corruptions',
    '0800_Exotic_Item_Variations/0802_Abyss_Jeweled_Rares/0802_Abyss_Jeweled_Rares',
    '0800_Exotic_Item_Variations/0803_Synthesised/0803_Synthesised',
    '0800_Exotic_Item_Variations/0804_Fractured/0804_Fractured',
    '0800_Exotic_Item_Variations/0805_Enchanted/0805_Enchanted',
    '0900_Recipes_and_5links/0900_Recipes_and_5links',
    '0900_Recipes_and_5links/0901_Link_Based/0901_Link_Based',
    '1000_High_Level_Crafting_Bases/1000_High_Level_Crafting_Bases',
    '1000_High_Level_Crafting_Bases/1001_Expensive_Atlas_86_Bases_matched_by_economy/1001_Expensive_Atlas_86_Bases_matched_by_economy',
    '1000_High_Level_Crafting_Bases/1002_PerfectionBasedFiltering/1002_PerfectionBasedFiltering',
    '1000_High_Level_Crafting_Bases/1003_ILVL_86/1003_ILVL_86',
    '1000_High_Level_Crafting_Bases/1004_ILVL_84/1004_ILVL_84',
    '1000_High_Level_Crafting_Bases/1005_ILVL_ANY/1005_ILVL_ANY',
    '1000_High_Level_Crafting_Bases/1006_RGB_Endgame/1006_RGB_Endgame',
    '1000_High_Level_Crafting_Bases/1007_Chisel_Recipes/1007_Chisel_Recipes',
    '1100_Chancing_Bases/1100_Chancing_Bases',
    '1200_Endgame_Flasks/1200_Endgame_Flasks',
    '1200_Endgame_Flasks/1201_Super_Endgame_Flasks/1201_Super_Endgame_Flasks',
    '1200_Endgame_Flasks/1202_High_quality_assorted_flasks/1202_High_quality_assorted_flasks',
    '1200_Endgame_Flasks/1203_Utility_OR_quality_flasks/1203_Utility_OR_quality_flasks',
    '1200_Endgame_Flasks/1204_Early_mapping_life_mana_utility_flasks/1204_Early_mapping_life_mana_utility_flasks',
    '1300_Misc_Rules/1300_Misc_Rules',
    '1400_Hide_Layer_1_Normal_and_Magic_Endgame_Gear/1400_Hide_Layer_1_Normal_and_Magic_Endgame_Gear',
    '1500_Rare_Item_Decorators/1500_Rare_Item_Decorators',
    '1600_Endgame_Rare_Exotic_Corrupted_Items/1600_Endgame_Rare_Exotic_Corrupted_Items',
    '1700_Endgame_Rare_Accessoires/1700_Endgame_Rare_Accessoires',
    '1800_Endgame_Rare_Accessoires/1800_Endgame_Rare_Accessoires',
    '1900_Endgame_Rare_Gear_T1_handpicked/1900_Endgame_Rare_Gear_T1_handpicked',
    '2000_Endgame_Rare_Gear_T2_handpicked/2000_Endgame_Rare_Gear_T2_handpicked',
    '2100_Endgame_Rare_Gear_T2_handpicked/2100_Endgame_Rare_Gear_T2_handpicked',
    '2200_Endgame_Rare_Gear_T3_droplevelbased/2200_Endgame_Rare_Gear_T3_droplevelbased',
    '2300_Endgame_Rare_Gear_T4_rest/2300_Endgame_Rare_Gear_T4_rest',
    '2400_Hide_Layer_2_Rare_Gear/2400_Hide_Layer_2_Rare_Gear',
    '2500_Jewels/2500_Jewels',
    '2500_Jewels/2501_Special_Cases/2501_Special_Cases',
    '2500_Jewels/2502_Abyss_Jewels/2502_Abyss_Jewels',
    '2500_Jewels/2503_Generic_Jewels/2503_Generic_Jewels',
    '2500_Jewels/2504_Cluster_Jewels_EcoBasedLarge/2504_Cluster_Jewels_EcoBasedLarge',
    '2500_Jewels/2505_Cluster_Jewels_Random/2505_Cluster_Jewels_Random',
    '2600_Heist_Gear/2600_Heist_Gear',
    '2600_Heist_Gear/2601_Heist_Cloak/2601_Heist_Cloak',
    '2600_Heist_Gear/2602_Heist_Brooch/2602_Heist_Brooch',
    '2600_Heist_Gear/2603_Heist_Gear/2603_Heist_Gear',
    '2600_Heist_Gear/2604_Heist_Tool/2604_Heist_Tool',
    '2700_Gem_Tierlists/2700_Gem_Tierlists',
    '2700_Gem_Tierlists/2701_Exceptional_Gems_Awakened_and_AltQuality/2701_Exceptional_Gems_Awakened_and_AltQuality',
    '2700_Gem_Tierlists/2702_Exceptional_Gems_Special_gems/2702_Exceptional_Gems_Special_gems',
    '2700_Gem_Tierlists/2703_High_Quality_and_Leveled_Gems/2703_High_Quality_and_Leveled_Gems',
    '2800_REPLICA_UNIQUES/2800_REPLICA_UNIQUES',
    '2900_Special_Maps/2900_Special_Maps',
    '2900_Special_Maps/2901_Unique_Maps/2901_Unique_Maps',
    '2900_Special_Maps/2902_Blighted_maps/2902_Blighted_maps',
    '2900_Special_Maps/2903_Delirium_Blight_Enchanted_Maps/2903_Delirium_Blight_Enchanted_Maps',
    '2900_Special_Maps/2904_BeyondNemesis_Maps_for_those_juicy_sextants/2904_BeyondNemesis_Maps_for_those_juicy_sextants',
    '3000_Normal_Map_Progression/3000_Normal_Map_Progression',
    '3000_Normal_Map_Progression/3001_Generic_Decorators/3001_Generic_Decorators',
    '3000_Normal_Map_Progression/3002_Map_progression/3002_Map_progression',
    '3000_Normal_Map_Progression/3003_Labyrinth_items_Offerings/3003_Labyrinth_items_Offerings',
    '3100_Heist_Contracts_and_Blueprints/3100_Heist_Contracts_and_Blueprints',
    '3200_Expedition_Logbooks/3200_Expedition_Logbooks',
    '3300_Fragments/3300_Fragments',
    '3300_Fragments/3301_Exceptions/3301_Exceptions',
    '3300_Fragments/3302_Scarabs/3302_Scarabs',
    '3300_Fragments/3303_Regular_Fragment_Tiering/3303_Regular_Fragment_Tiering',
    '3400_Currency_Exceptions_Leveling_Currencies/3400_Currency_Exceptions_Leveling_Currencies',
    '3500_Currency_Exceptions_Stacked_Currency/3500_Currency_Exceptions_Stacked_Currency',
    '3500_Currency_Exceptions_Stacked_Currency/3501_Supplies_High_Stacking/3501_Supplies_High_Stacking',
    '3500_Currency_Exceptions_Stacked_Currency/3502_Supplies_Low_Stacking/3502_Supplies_Low_Stacking',
    '3500_Currency_Exceptions_Stacked_Currency/3503_Supplies_Portal_Stacking/3503_Supplies_Portal_Stacking',
    '3500_Currency_Exceptions_Stacked_Currency/3504_Supplies_Wisdom_Stacking/3504_Supplies_Wisdom_Stacking',
    '3500_Currency_Exceptions_Stacked_Currency/3505_Stacked_Currencies_6x/3505_Stacked_Currencies_6x',
    '3500_Currency_Exceptions_Stacked_Currency/3506_Stacked_Currencies_3x/3506_Stacked_Currencies_3x',
    '3500_Currency_Exceptions_Stacked_Currency/3507_Heist_Coins/3507_Heist_Coins',
    '3600_Currency_Regular_Currency_Tiering/3600_Currency_Regular_Currency_Tiering',
    '3700_Currency_SPECIAL/3700_Currency_SPECIAL',
    '3700_Currency_SPECIAL/3701_Incursion_Vials/3701_Incursion_Vials',
    '3700_Currency_SPECIAL/3702_Delirum_Orbs/3702_Delirum_Orbs',
    '3700_Currency_SPECIAL/3703_Delve_Resonators/3703_Delve_Resonators',
    '3700_Currency_SPECIAL/3704_Delve_Fossils/3704_Delve_Fossils',
    '3700_Currency_SPECIAL/3705_Blight_Oils/3705_Blight_Oils',
    '3700_Currency_SPECIAL/3706_Expedition_Currencies/3706_Expedition_Currencies',
    '3700_Currency_SPECIAL/3707_Essences/3707_Essences',
    '3700_Currency_SPECIAL/3708_Incubators/3708_Incubators',
    '3700_Currency_SPECIAL/3709_Others/3709_Others',
    '3800_Currency_Splinters/3800_Currency_Splinters',
    '3800_Currency_Splinters/3801_Breach_and_Legion_Splinters_stacked/3801_Breach_and_Legion_Splinters_stacked',
    '3800_Currency_Splinters/3802_Breach_and_Legion_Splinters_single/3802_Breach_and_Legion_Splinters_single',
    '3800_Currency_Splinters/3803_Simulacrum_Splinters/3803_Simulacrum_Splinters',
    '3900_Divination_Cards/3900_Divination_Cards',
    '4000_Remaining_Currency/4000_Remaining_Currency',
    '4100_QuestlikeItems1_override_uniques/4100_QuestlikeItems1_override_uniques',
    '4200_Uniques/4200_Uniques',
    '4200_Uniques/4201_Exceptions_1/4201_Exceptions_1',
    '4200_Uniques/4202_Tier_1_uniques/4202_Tier_1_uniques',
    '4200_Uniques/4203_Exceptions_2/4203_Exceptions_2',
    '4200_Uniques/4204_Tier_2_uniques/4204_Tier_2_uniques',
    '4200_Uniques/4205_MultiUnique_bases/4205_MultiUnique_bases',
    '4200_Uniques/4206_Exceptions_Fated_Uniques/4206_Exceptions_Fated_Uniques',
    '4200_Uniques/4207_Low_tier_exceptions/4207_Low_tier_exceptions',
    '4200_Uniques/4208_Tier_3_uniques/4208_Tier_3_uniques',
    '4200_Uniques/4209_Tier_4_uniques/4209_Tier_4_uniques',
    '4300_Misc_Map_Items/4300_Misc_Map_Items',
    '4400_QuestlikeItems2/4400_QuestlikeItems2',
    '4500_Hide_outdated_leveling_flasks/4500_Hide_outdated_leveling_flasks',
    '4600_Leveling_Flasks/4600_Leveling_Flasks',
    '4600_Leveling_Flasks/4601_Utility_Flasks/4601_Utility_Flasks',
    '4600_Leveling_Flasks/4602_Hybrid_flasks/4602_Hybrid_flasks',
    '4600_Leveling_Flasks/4603_Life_flasks/4603_Life_flasks',
    '4600_Leveling_Flasks/4604_Mana_flasks/4604_Mana_flasks',
    '4700_Leveling_Rules/4700_Leveling_Rules',
    '4700_Leveling_Rules/4701_Links_and_Sockets/4701_Links_and_Sockets',
    '4700_Leveling_Rules/4702_Rares_Decorators/4702_Rares_Decorators',
    '4700_Leveling_Rules/4703_Rares_Universal/4703_Rares_Universal',
    '4700_Leveling_Rules/4704_Rares_Caster/4704_Rares_Caster',
    '4700_Leveling_Rules/4705_Rares_Archer/4705_Rares_Archer',
    '4700_Leveling_Rules/4706_Rares_Melee/4706_Rares_Melee',
    '4800_Leveling_Useful_magic_and_normal_items/4800_Leveling_Useful_magic_and_normal_items',
    '4800_Leveling_Useful_magic_and_normal_items/4801_Purpose_Picked_Items/4801_Purpose_Picked_Items',
    '4800_Leveling_Useful_magic_and_normal_items/4802_Normals/4802_Normals',
    '4800_Leveling_Useful_magic_and_normal_items/4803_Weapon_Progression/4803_Weapon_Progression',
    '4800_Leveling_Useful_magic_and_normal_items/4804_Remaining_Magics/4804_Remaining_Magics',
    '4800_Leveling_Useful_magic_and_normal_items/4805_Hide_All_known_Section/4805_Hide_All_known_Section',
    '4800_Leveling_Useful_magic_and_normal_items/4806_Show_All_unknown_Section/4806_Show_All_unknown_Section'
];

/*
const exportFilter = (exportPath, data, extension) => {
    const content = data.join('\n');
    const filterComponentOutputFile = path.join(exportPath, 'Custom_Filter' + extension);
    fs.writeFileSync(filterComponentOutputFile, content, 'utf-8');
};
*/

const importFilter = (strictness) => {
    const now = dayjs();
    const folderFormat = now.format('YYYY_MM_DD_HH_mm_ss');
    const exportPath = path.join(outputPath, `Custom_Filters_${folderFormat}`);
    fs.mkdirSync(exportPath);

    strictness.forEach(filterSetting => {
        const filterComponentFileExtension = `_${filterSetting}.filter`;
        const filterComponentData = [];
    
        filterComponentFilePath.forEach(file => {
            const filterComponentInputFile = path.join(inputPath, file + filterComponentFileExtension);
            filterComponentData.push(fs.readFileSync(filterComponentInputFile, 'utf-8'));
        });

        exportFilter(exportPath, filterComponentData, filterComponentFileExtension);
    });
};





















const checkString = (data, value) => {
    if (data.includes(value)) {
        return true;
    }
    return false;
};

const checkCommentHeader = (data) => {
    const regex = /#[ ]+\[/g;
    const matchResults = data.match(regex);
    if (matchResults) {
        return true;
    }
    return false;
};

const matchCommentHeaderName = (data) => {
    const regex = /[a-zA-Z]+.*/g;
    const matchResults = data.match(regex);
    const headerName = matchResults[0];
    return headerName;
};

const matchCommentHeaderNumber = (data) => {
    const regex = /[0-9]+/g;
    const matchResults = data.match(regex);
    const headerNumber = matchResults[0];
    
    // Verify Data Type
    if (typeof headerNumber !== 'number') {
        return parseInt(headerNumber);
    } else {
        return headerNumber;
    };
};

const matchCommentHeaderIndex = (lastChapterIndex, lastChapterNumber, chapterNumberList, lastSectionIndex, lastSectionNumber, sectionNumberList) => {
    // Chapter Variables
    const chapterIndex = lastChapterIndex;
    const chapterLength = chapterNumberList.length;
    const previousChapter = lastChapterNumber;
    const nextChapter = lastChapterNumber + 100;
    // Section Variables
    const sectionIndex = lastSectionIndex;
    const sectionLength = sectionNumberList.length;
    const previousSection = lastSectionNumber;
    const expectedSection = lastChapterNumber + lastSectionIndex +2;

    const tracker = {
        trackerChapterIndex: chapterIndex,
        trackerChapterLength: chapterLength,
        trackerPreviousChapter: previousChapter,
        trackerNextChapter: nextChapter,
        trackerSectionIndex: sectionIndex,
        trackerSectionLength: sectionLength,
        trackerPreviousSection: previousSection,
        trackerExpectedSection: expectedSection
    }

    // console.log('Matching Index: ', tracker);

    if (previousSection > previousChapter && previousSection < nextChapter) {
        return true
        /*
        if (previousSection === expectedSection) {
            return true
        } else {
            return false
        };
        */
    } else {
        return false
    };
};

const importAsJSON = () => {
    const filterComponentInputFile = path.join(examplePath, 'custom.filter');
    const filterData = fs.readFileSync(filterComponentInputFile, 'utf-8');

    // Remove Carriage Returns and tabs
    const newlinefilterData = filterData.replace(/\r\n/g, "\n");
    const cleanfilterData = newlinefilterData.replace(/\t/g, "");

    // Split file into Array of Rules
    const rules = cleanfilterData.split(/\n\n/);

    // Create Filter JSON
    const filterJSON = {
        chapters: []
    };
    
    // Tracker Vars
    var lastChapterTrigger = false;
    var lastChapterIndex = 0;
    var lastChapterNumber = 0;
    var chapterNumberList = [];
    
    var lastSectionTrigger = false;
    var lastSectionIndex = 0;
    var lastSectionNumber = 0;
    var sectionNumberList = [];

    // Process Filter Data
    rules.forEach(rule => {
        if (checkString(rule, '#==')) {
            // Parse Rule Chapter Header
            const chapterHeader = rule.split('\n');
            const chapterHeaderJSON = {
                chapterHeaderMisc: [],
                chapterSections: [],
                rules: []
            };
            
            // Increment on 2nd Run
            if (lastChapterTrigger) {
                lastChapterIndex++;
            };

            // Build Chapter Header JSON
            chapterHeader.forEach(comment => {
                const chapterHeaderCommentDecorator = checkString(comment, '#==');
                const chapterHeaderCommentLabel = checkCommentHeader(comment);

                if (chapterHeaderCommentDecorator) {
                    chapterHeaderJSON.chapterHeaderCommentLine = comment;
                } else if (chapterHeaderCommentLabel) {
                    const commentNumber = matchCommentHeaderNumber(comment);
                    lastChapterNumber = commentNumber;
                    chapterNumberList.push(lastChapterNumber);
                    chapterHeaderJSON.chapterHeaderNumber = commentNumber;
                    chapterHeaderJSON.chapterHeaderName = matchCommentHeaderName(comment);
                } else {
                    chapterHeaderJSON.chapterHeaderMisc.push(comment);
                };
            });
            
            // Push to Filter JSON
            lastChapterTrigger = true;
            lastSectionIndex = 0;
            filterJSON.chapters.push(chapterHeaderJSON);

        } else if (checkString(rule, '#--')) {
            // Parse Rule Section Header
            const sectionHeader = rule.split('\n');
            const sectionHeaderJSON = {
                sectionHeaderMisc: [],
                rules: []
            };

            // Increment on 2nd Run
            if (lastSectionTrigger) {
                lastSectionIndex++;
            };

            // Build Section Header JSON
            sectionHeader.forEach(comment => {
                const sectionHeaderCommentDecorator = checkString(comment, '#--');
                const sectionHeaderCommentLabel = checkCommentHeader(comment);

                if (sectionHeaderCommentDecorator) {
                    sectionHeaderJSON.sectionHeaderCommentLine = comment;
                } else if (sectionHeaderCommentLabel) {
                    const commentNumber = matchCommentHeaderNumber(comment);
                    lastSectionNumber = commentNumber;
                    sectionNumberList.push(lastSectionNumber);
                    sectionHeaderJSON.sectionHeaderNumber = commentNumber;
                    sectionHeaderJSON.sectionHeaderName = matchCommentHeaderName(comment);
                } else {
                    sectionHeaderJSON.sectionHeaderMisc.push(comment);
                };
            });

            // Push to Filter JSON
            lastSectionTrigger = true;
            filterJSON.chapters[lastChapterIndex].chapterSections.push(sectionHeaderJSON);

        } else {
            // Split Rule into Array of Properties
            const ruleProperties = rule.split('\n');
            const ruleJSON = {
                propertyMisc: []
            };

            // Build Section Header JSON
            ruleProperties.forEach(property => {
                const ruleDisabledShow = checkString(property, '#show');
                const ruleDisabledHide = checkString(property, '#hide');
                const ruleEnabledShow = checkString(property, 'show');
                const ruleEnabledHide = checkString(property, 'hide');

                // Debugging
                // console.log('Rule Property Parsing...');

                if (ruleDisabledShow) {
                    ruleJSON.disabled = true;
                    ruleJSON.visible = 'show';
                } else if (ruleDisabledHide) {
                    ruleJSON.disabled = true;
                    ruleJSON.visible = 'hide';
                } else if (ruleEnabledShow) {
                    ruleJSON.disabled = false;
                    ruleJSON.visible = 'show';
                } else if (ruleEnabledHide) {
                    ruleJSON.disabled = false;
                    ruleJSON.visible = 'hide';
                } else {
                    ruleJSON.propertyMisc.push(property);
                };
            });

            // Push to Filter JSON
            if (matchCommentHeaderIndex(lastChapterIndex, lastChapterNumber, chapterNumberList, lastSectionIndex, lastSectionNumber, sectionNumberList)) {
                try {
                    // console.log('Section Last Index: ', lastSectionIndex);
                    // console.log('Section Length: ', filterJSON.chapters[lastChapterIndex].chapterSections.length);
                    // console.log('Sections: ', filterJSON.chapters[lastChapterIndex].chapterSections);
                    filterJSON.chapters[lastChapterIndex].chapterSections[lastSectionIndex-2].rules.push(ruleJSON);
                } catch (error) {
                    // If undefined section, apply to chapter rules
                    filterJSON.chapters[lastChapterIndex].rules.push(ruleJSON);
                }
            } else {
                filterJSON.chapters[lastChapterIndex].rules.push(ruleJSON);
            }
        };
    });

    convertJSONtoFilter(filterJSON);
    // fs.writeFileSync(filterComponentOutputFile, JSON.stringify(filterJSON, null, 4), 'utf-8');
};

const convertJSONtoFilter = (data) => {
    const filterData = [];

    for (let chapter = 0; chapter < data.chapters.length; chapter++) {
        // Add leading zeros
        const chapterNumber = data.chapters[chapter].chapterHeaderNumber;
        let chapterNumberString = '';
        if (chapterNumber < 1000) {
            chapterNumberString = `0${chapterNumber}`;
        } else {
            chapterNumberString = `${chapterNumber}`;
        }

        // Build Chapter Headers
        filterData.push(`${data.chapters[chapter].chapterHeaderCommentLine}`);
        filterData.push(`# [[${chapterNumberString}]] ${data.chapters[chapter].chapterHeaderName}`);
        filterData.push(`${data.chapters[chapter].chapterHeaderCommentLine}`);

        // Add Chapter Misc
        if (data.chapters[chapter].chapterHeaderMisc.length) {
            const chapterMisc = data.chapters[chapter].chapterHeaderMisc;
            for (let misc = 0; misc < chapterMisc.length; misc++) {
                filterData.push(`${data.chapters[chapter].chapterHeaderMisc[misc]}`);
            }
            filterData.push('');
        } else {
            filterData.push('\n');
        }

        // Build Chapter Rules
        if (data.chapters[chapter].rules.length) {
            const chapterRules = data.chapters[chapter].rules;
            for (let rule = 0; rule < chapterRules.length; rule++) {
                const chapterRuleProperties = data.chapters[chapter].rules[rule].propertyMisc;
                filterData.push(`${chapterRuleProperties.join('\n\t')}`);
                filterData.push('');
            }
        }

        if (data.chapters[chapter].chapterSections.length) {
            for (let section = 0; section < data.chapters[chapter].chapterSections.length; section++) {
                // Add leading zeros
                const sectionNumber = data.chapters[chapter].chapterSections[section].sectionHeaderNumber;
                let sectionNumberString = '';
                if (chapterNumber < 1000) {
                    sectionNumberString = `0${sectionNumber}`;
                } else {
                    sectionNumberString = `${sectionNumber}`;
                }

                // Build Section Headers
                filterData.push(`${data.chapters[chapter].chapterSections[section].sectionHeaderCommentLine}`);
                filterData.push(`#   [${sectionNumberString}] ${data.chapters[chapter].chapterHeaderName}`);
                filterData.push(`${data.chapters[chapter].chapterSections[section].sectionHeaderCommentLine}`);
        
                // Add Section Misc
                if (data.chapters[chapter].chapterSections[section].sectionHeaderMisc.length) {
                    const sectionMisc = data.chapters[chapter].chapterSections[section].sectionHeaderMisc;
                    for (let misc = 0; misc < sectionMisc.length; misc++) {
                        filterData.push(`${data.chapters[chapter].chapterSections[section].sectionHeaderMisc[misc]}`);
                    }
                    filterData.push('');
                } else {
                    filterData.push('\n');
                }

                // Build Section Rules
                if (data.chapters[chapter].chapterSections[section].rules.length) {
                    const sectionRules = data.chapters[chapter].chapterSections[section].rules;
                    for (let rule = 0; rule < sectionRules.length; rule++) {
                        const sectionRuleProperties = data.chapters[chapter].chapterSections[section].rules[rule].propertyMisc;
                        filterData.push(`${sectionRuleProperties.join('\n\t')}`);
                        filterData.push('');
                    }
                }
            }
        }
    }
    exportFilter(data, filterData.join('\n'));
};

const exportFilter = (json, filterData) => {
    const now = dayjs();
    const folderFormat = now.format('YYYY_MM_DD_HH_mm_ss');
    const exportPath = path.join(outputPath, `Exported_Filters_${folderFormat}`);
    const filterJSONOutputFile = path.join(exportPath, 'Exported_Custom.json');
    const filterOutputFile = path.join(exportPath, 'Exported_Custom.filter');
    fs.mkdirSync(exportPath);
    fs.writeFileSync(filterJSONOutputFile, JSON.stringify(json, null, 4), 'utf-8');
    fs.writeFileSync(filterOutputFile, filterData, 'utf-8');
};

const main = () => {
    //importFilter(listStrictness);
    importAsJSON();
};

main();
