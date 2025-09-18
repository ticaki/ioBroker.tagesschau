/**
 * Test data provider for tagesschau adapter offline testing
 * Provides structured test data that mimics real Tagesschau API responses
 */

const fs = require('fs');
const path = require('path');

/**
 * Get test data for homepage endpoint
 */
function getHomepageTestData() {
    return {
        news: [
            {
                sophoraId: 'story-homepage-001',
                externalId: 'homepage-breaking-001',
                title: 'Bundestag beschließt wichtiges Gesetz',
                date: '2024-01-15T14:30:00.000Z',
                teaserImage: {
                    title: 'Bundestag Sitzung',
                    alttext: 'Plenarsaal des Deutschen Bundestages',
                    copyright: 'dpa',
                    imageVariants: {
                        '1x1-144': 'https://images.tagesschau.de/image/test-bundestag-1x1-144.jpg',
                        '1x1-256': 'https://images.tagesschau.de/image/test-bundestag-1x1-256.jpg',
                        '1x1-432': 'https://images.tagesschau.de/image/test-bundestag-1x1-432.jpg',
                        '16x9-384': 'https://images.tagesschau.de/image/test-bundestag-16x9-384.jpg',
                        '16x9-512': 'https://images.tagesschau.de/image/test-bundestag-16x9-512.jpg',
                        '16x9-960': 'https://images.tagesschau.de/image/test-bundestag-16x9-960.jpg'
                    },
                    type: 'image'
                },
                topline: 'Bundestag',
                firstSentence: 'Der Bundestag hat heute ein wichtiges Gesetz zur Digitalisierung verabschiedet.',
                details: 'Mit großer Mehrheit stimmten die Abgeordneten für das Gesetz zur Förderung der Digitalisierung in Deutschland. Das Gesetz sieht Investitionen in Höhe von mehreren Milliarden Euro vor.',
                shareURL: 'https://www.tagesschau.de/inland/bundestag-digitalisierung-gesetz-test',
                tags: [
                    { tag: 'Bundestag' },
                    { tag: 'Politik' },
                    { tag: 'Digitalisierung' },
                    { tag: 'Deutschland' }
                ],
                breakingNews: true,
                type: 'story',
                ressort: 'inland'
            },
            {
                sophoraId: 'story-homepage-002', 
                externalId: 'homepage-wirtschaft-002',
                title: 'DAX erreicht neues Allzeithoch',
                date: '2024-01-15T13:15:00.000Z',
                teaserImage: {
                    title: 'Frankfurter Börse',
                    alttext: 'Händler an der Frankfurter Börse',
                    copyright: 'Reuters',
                    imageVariants: {
                        '1x1-144': 'https://images.tagesschau.de/image/test-boerse-1x1-144.jpg',
                        '1x1-256': 'https://images.tagesschau.de/image/test-boerse-1x1-256.jpg',
                        '16x9-384': 'https://images.tagesschau.de/image/test-boerse-16x9-384.jpg',
                        '16x9-512': 'https://images.tagesschau.de/image/test-boerse-16x9-512.jpg'
                    },
                    type: 'image'
                },
                topline: 'Börse',
                firstSentence: 'Der deutsche Leitindex DAX hat heute erstmals die Marke von 18.000 Punkten überschritten.',
                details: 'Angetrieben von positiven Quartalszahlen erreichte der DAX ein neues Allzeithoch. Besonders Technologieaktien legten stark zu.',
                shareURL: 'https://www.tagesschau.de/wirtschaft/dax-allzeithoch-test',
                tags: [
                    { tag: 'DAX' },
                    { tag: 'Börse' },
                    { tag: 'Wirtschaft' },
                    { tag: 'Aktien' }
                ],
                breakingNews: false,
                type: 'story',
                ressort: 'wirtschaft'
            }
        ],
        newsCount: 2,
        regional: [
            {
                sophoraId: 'story-regional-bayern-001',
                externalId: 'bayern-regional-001',
                title: 'Neues Verkehrskonzept für München',
                date: '2024-01-15T12:00:00.000Z',
                topline: 'Bayern',
                firstSentence: 'München plant ein neues Verkehrskonzept zur Reduzierung der Innenstadtbelastung.',
                details: 'Das neue Konzept sieht eine Ausweitung der Fußgängerzonen und bessere ÖPNV-Anbindung vor.',
                shareURL: 'https://www.tagesschau.de/regional/bayern/muenchen-verkehr-test',
                tags: [{ tag: 'München' }, { tag: 'Verkehr' }],
                breakingNews: false,
                type: 'story',
                regionalId: 2
            }
        ],
        type: 'homepage'
    };
}

/**
 * Get test data for inland news
 */
function getInlandTestData() {
    return {
        news: [
            {
                sophoraId: 'story-inland-001',
                externalId: 'inland-politik-001',
                title: 'Regierung plant Steuerreform',
                date: '2024-01-15T11:30:00.000Z',
                teaserImage: {
                    title: 'Bundeskanzleramt',
                    alttext: 'Das Bundeskanzleramt in Berlin',
                    copyright: 'ARD',
                    imageVariants: {
                        '1x1-144': 'https://images.tagesschau.de/image/test-kanzleramt-1x1-144.jpg',
                        '1x1-256': 'https://images.tagesschau.de/image/test-kanzleramt-1x1-256.jpg',
                        '16x9-512': 'https://images.tagesschau.de/image/test-kanzleramt-16x9-512.jpg'
                    },
                    type: 'image'
                },
                topline: 'Steuerpolitik',
                firstSentence: 'Die Bundesregierung hat Pläne für eine umfassende Steuerreform vorgestellt.',
                details: 'Die Reform sieht Entlastungen für mittlere Einkommen und eine Vereinfachung des Steuersystems vor.',
                shareURL: 'https://www.tagesschau.de/inland/steuerreform-plaene-test',
                tags: [
                    { tag: 'Steuern' },
                    { tag: 'Bundesregierung' },
                    { tag: 'Politik' }
                ],
                breakingNews: false,
                type: 'story',
                ressort: 'inland'
            }
        ],
        newsCount: 1
    };
}

/**
 * Get test data for ausland news
 */
function getAuslandTestData() {
    return {
        news: [
            {
                sophoraId: 'story-ausland-001',
                externalId: 'ausland-international-001',
                title: 'EU-Gipfel berät über Klimaziele',
                date: '2024-01-15T10:45:00.000Z',
                teaserImage: {
                    title: 'EU-Flaggen',
                    alttext: 'Flaggen der EU-Mitgliedstaaten',
                    copyright: 'AFP',
                    imageVariants: {
                        '1x1-144': 'https://images.tagesschau.de/image/test-eu-flags-1x1-144.jpg',
                        '16x9-384': 'https://images.tagesschau.de/image/test-eu-flags-16x9-384.jpg',
                        '16x9-512': 'https://images.tagesschau.de/image/test-eu-flags-16x9-512.jpg'
                    },
                    type: 'image'
                },
                topline: 'Europäische Union',
                firstSentence: 'Die EU-Staats- und Regierungschefs beraten heute über verschärfte Klimaziele.',
                details: 'Im Zentrum der Diskussion stehen die Pläne zur CO2-Reduzierung bis 2030 und die Finanzierung grüner Technologien.',
                shareURL: 'https://www.tagesschau.de/ausland/eu-gipfel-klima-test',
                tags: [
                    { tag: 'EU' },
                    { tag: 'Klimawandel' },
                    { tag: 'Umwelt' },
                    { tag: 'Politik' }
                ],
                breakingNews: false,
                type: 'story',
                ressort: 'ausland'
            }
        ],
        newsCount: 1
    };
}

/**
 * Get test data for wirtschaft news
 */
function getWirtschaftTestData() {
    return {
        news: [
            {
                sophoraId: 'story-wirtschaft-001',
                externalId: 'wirtschaft-unternehmen-001',
                title: 'Deutsche Autoindustrie investiert in E-Mobilität',
                date: '2024-01-15T09:20:00.000Z',
                teaserImage: {
                    title: 'Elektroauto Produktion',
                    alttext: 'Produktionslinie für Elektrofahrzeuge',
                    copyright: 'dpa',
                    imageVariants: {
                        '1x1-256': 'https://images.tagesschau.de/image/test-emobility-1x1-256.jpg',
                        '16x9-512': 'https://images.tagesschau.de/image/test-emobility-16x9-512.jpg',
                        '16x9-960': 'https://images.tagesschau.de/image/test-emobility-16x9-960.jpg'
                    },
                    type: 'image'
                },
                topline: 'Automobilindustrie',
                firstSentence: 'Deutsche Automobilhersteller kündigen Milliarden-Investitionen in Elektromobilität an.',
                details: 'Die Investitionen sollen den Ausbau der Batterieproduktion und die Entwicklung neuer E-Auto-Modelle vorantreiben.',
                shareURL: 'https://www.tagesschau.de/wirtschaft/auto-emobilitaet-investition-test',
                tags: [
                    { tag: 'Automobilindustrie' },
                    { tag: 'Elektromobilität' },
                    { tag: 'Investitionen' },
                    { tag: 'Technologie' }
                ],
                breakingNews: false,
                type: 'story',
                ressort: 'wirtschaft'
            }
        ],
        newsCount: 1
    };
}

/**
 * Get test data for regional news (Baden-Württemberg)
 */
function getRegionalTestData(regionalId = 1) {
    const regionalNames = {
        1: 'Baden-Württemberg',
        2: 'Bayern',
        3: 'Berlin',
        4: 'Brandenburg',
        5: 'Bremen',
        6: 'Hamburg',
        7: 'Hessen',
        8: 'Mecklenburg-Vorpommern',
        9: 'Niedersachsen',
        10: 'Nordrhein-Westfalen',
        11: 'Rheinland-Pfalz',
        12: 'Saarland',
        13: 'Sachsen',
        14: 'Sachsen-Anhalt',
        15: 'Schleswig-Holstein',
        16: 'Thüringen'
    };

    const regionName = regionalNames[regionalId] || 'Baden-Württemberg';

    return {
        regional: [
            {
                sophoraId: `story-regional-${regionalId}-001`,
                externalId: `regional-${regionalId}-test-001`,
                title: `Neue Entwicklungen in ${regionName}`,
                date: '2024-01-15T08:30:00.000Z',
                teaserImage: {
                    title: `${regionName} Landtag`,
                    alttext: `Gebäude des ${regionName} Landtags`,
                    copyright: 'ARD',
                    imageVariants: {
                        '1x1-144': `https://images.tagesschau.de/image/test-${regionalId}-landtag-1x1-144.jpg`,
                        '16x9-384': `https://images.tagesschau.de/image/test-${regionalId}-landtag-16x9-384.jpg`
                    },
                    type: 'image'
                },
                topline: regionName,
                firstSentence: `In ${regionName} gibt es wichtige politische Entwicklungen zu berichten.`,
                details: `Der Landtag von ${regionName} hat heute über wichtige regionale Themen debattiert.`,
                shareURL: `https://www.tagesschau.de/regional/${regionName.toLowerCase().replace('ü', 'ue').replace('ä', 'ae').replace('ö', 'oe')}/politik-test`,
                tags: [
                    { tag: regionName },
                    { tag: 'Regional' },
                    { tag: 'Politik' }
                ],
                breakingNews: false,
                type: 'story',
                regionalId: regionalId
            }
        ]
    };
}

/**
 * Save test data to data directory (if it exists)
 */
function saveTestDataFiles() {
    const dataDir = path.join(__dirname, 'data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
        try {
            fs.mkdirSync(dataDir);
            console.log('📁 Created test data directory');
        } catch (err) {
            console.log('ℹ️ Could not create data directory:', err.message);
            return;
        }
    }

    const testDataFiles = {
        'homepage.json': getHomepageTestData(),
        'inland.json': getInlandTestData(),
        'ausland.json': getAuslandTestData(),
        'wirtschaft.json': getWirtschaftTestData(),
        'regional-bw.json': getRegionalTestData(1),
        'regional-bayern.json': getRegionalTestData(2)
    };

    try {
        Object.entries(testDataFiles).forEach(([filename, data]) => {
            const filePath = path.join(dataDir, filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            console.log(`💾 Saved test data: ${filename}`);
        });
        console.log('✅ All test data files saved successfully');
    } catch (err) {
        console.log('⚠️ Error saving test data files:', err.message);
    }
}

module.exports = {
    getHomepageTestData,
    getInlandTestData,
    getAuslandTestData,
    getWirtschaftTestData,
    getRegionalTestData,
    saveTestDataFiles
};

// Auto-save test data files when this module is loaded in test environment
if (process.env.NODE_ENV === 'test' || process.env.npm_lifecycle_event === 'test') {
    saveTestDataFiles();
}