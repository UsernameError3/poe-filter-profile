const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const inputPath = `${__dirname}/example_data/filterblade_tabula`;
const outputPath = `${__dirname}/exports`;

const listStrictness = [
    'Soft',
    'Regular',
    'Semi-Strict',
    'Strict',
    'Very-Strict',
    'Uber-Strict',
    'Uber-Plus-Strict'
];

const now = dayjs();
const folderFormat = now.format('YYYY_MM_DD_HH_mm_ss');
const exportPath = path.join(outputPath, `Exported_Filters_${folderFormat}`);
const exportPathFilter = path.join(outputPath, `Exported_Filters_${folderFormat}/filter`);
const exportPathJson = path.join(outputPath, `Exported_Filters_${folderFormat}/json`);
fs.mkdirSync(exportPath);
fs.mkdirSync(exportPathFilter);
fs.mkdirSync(exportPathJson);

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

const importFilter = (strictness) => {
    var inputFileIndex = 0;
    strictness.forEach(filterSetting => {
        const filterInputFileExtension = `${filterSetting}.filter`;
        const filterInputFileName = `FilterBlade_${inputFileIndex}_${filterInputFileExtension}`;
        const filterInputFile = path.join(inputPath, filterInputFileName);
        const filterData = fs.readFileSync(filterInputFile, 'utf-8');
    
        convertFilterToJSON(filterData, filterSetting);
        inputFileIndex++;
    });
};

const convertFilterToJSON = (filterData, filterSetting) => {
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

    convertJSONtoFilter(filterJSON, filterSetting);
};

const convertJSONtoFilter = (data, filterSetting) => {
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
    exportFilter(data, filterData.join('\n'), filterSetting);
};

const exportFilter = (json, filterData, filterSetting) => {
    const filterJSONOutputFile = path.join(exportPathJson, `Exported_${filterSetting}.json`);
    const filterOutputFile = path.join(exportPathFilter, `Exported_${filterSetting}.filter`);
    
    fs.writeFileSync(filterJSONOutputFile, JSON.stringify(json, null, 4), 'utf-8');
    fs.writeFileSync(filterOutputFile, filterData, 'utf-8');
};

const main = () => {
    importFilter(listStrictness);
};

main();
