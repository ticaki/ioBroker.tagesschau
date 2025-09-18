/**
 * Test setup for offline mode - mocks API calls to use local test data
 */

const axios = require('axios');

// Store original axios methods for potential restoration
const originalAxiosGet = axios.get;
const originalAxiosRequest = axios.request;

// Flag to track if mocking is enabled
let isMockingEnabled = false;

/**
 * Simple mock function implementation (without jest)
 */
function createMockFunction(implementation) {
    const mockFn = function(...args) {
        return implementation.apply(this, args);
    };
    mockFn.mockImplementation = function(impl) {
        implementation = impl;
        return mockFn;
    };
    return mockFn;
}

/**
 * Enable API mocking with local test data
 */
function enableMocking() {
    if (isMockingEnabled) return;
    
    console.log('🔧 Setting up offline API mocking for tagesschau tests...');
    
    // Mock axios.get for API calls
    axios.get = createMockFunction((url, config) => {
        console.log(`🔄 Mocked API call to: ${url}`);
        
        // Simulate different API endpoints
        if (url.includes('tagesschau.de/api2u/homepage')) {
            return Promise.resolve({
                data: getMockHomepageData(),
                status: 200,
                statusText: 'OK'
            });
        } else if (url.includes('tagesschau.de/api2u/news')) {
            return Promise.resolve({
                data: getMockNewsData(),
                status: 200,
                statusText: 'OK'
            });
        } else if (url.includes('tagesschau.de/api2u/regions')) {
            return Promise.resolve({
                data: getMockRegionalData(),
                status: 200,
                statusText: 'OK'
            });
        }
        
        // For any other URL, return empty response
        return Promise.resolve({
            data: {},
            status: 200,
            statusText: 'OK'
        });
    });
    
    // Also mock axios.request if used
    axios.request = createMockFunction((config) => {
        return axios.get(config.url, config);
    });
    
    isMockingEnabled = true;
    console.log('✅ API mocking enabled - using offline test data');
}

/**
 * Disable API mocking and restore original axios
 */
function disableMocking() {
    if (!isMockingEnabled) return;
    
    axios.get = originalAxiosGet;
    axios.request = originalAxiosRequest;
    isMockingEnabled = false;
    console.log('🔧 API mocking disabled - using real API calls');
}

/**
 * Get mock homepage data simulating Tagesschau API response
 */
function getMockHomepageData() {
    // Generate current timestamps for mock data
    const now = new Date();

    return {
        news: [
            {
                sophoraId: 'story-12345',
                externalId: 'meldung-12345',
                title: 'Test Breaking News Title',
                date: now.toISOString(),
                teaserImage: {
                    imageVariants: {
                        '1x1-144': 'https://test.example.com/image-144.jpg',
                        '1x1-256': 'https://test.example.com/image-256.jpg',
                        '16x9-512': 'https://test.example.com/image-512.jpg'
                    }
                },
                topline: 'Eilmeldung',
                firstSentence: 'This is a test breaking news article for offline testing.',
                details: 'Full test article content goes here for integration testing purposes.',
                shareURL: 'https://test.tagesschau.de/test-article',
                tags: [
                    { tag: 'Test' },
                    { tag: 'Integration' },
                    { tag: 'News' }
                ],
                breakingNews: true,
                type: 'story'
            }
        ],
        newsCount: 1,
        regional: [],
        type: 'homepage'
    };
}

/**
 * Get mock news data for specific categories
 */
function getMockNewsData() {
    // Generate current timestamps for mock data
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    return {
        news: [
            {
                sophoraId: 'story-inland-123',
                externalId: 'inland-meldung-123',
                title: 'Test Inland News Article',
                date: now.toISOString(),
                teaserImage: {
                    imageVariants: {
                        '1x1-144': 'https://test.example.com/inland-144.jpg',
                        '16x9-512': 'https://test.example.com/inland-512.jpg'
                    }
                },
                topline: 'Deutschland',
                firstSentence: 'This is a test inland news article.',
                details: 'Full test inland news content.',
                shareURL: 'https://test.tagesschau.de/inland-test',
                tags: [{ tag: 'Deutschland' }, { tag: 'Politik' }],
                breakingNews: false,
                type: 'story',
                ressort: 'inland'
            },
            {
                sophoraId: 'story-ausland-456',
                externalId: 'ausland-meldung-456',
                title: 'Test International News Article',
                date: oneHourAgo.toISOString(),
                teaserImage: {
                    imageVariants: {
                        '1x1-256': 'https://test.example.com/ausland-256.jpg',
                        '16x9-512': 'https://test.example.com/ausland-512.jpg'
                    }
                },
                topline: 'International',
                firstSentence: 'This is a test international news article.',
                details: 'Full test international news content.',
                shareURL: 'https://test.tagesschau.de/ausland-test',
                tags: [{ tag: 'International' }, { tag: 'Politik' }],
                breakingNews: false,
                type: 'story',
                ressort: 'ausland'
            }
        ],
        newsCount: 2
    };
}

/**
 * Get mock regional data
 */
function getMockRegionalData() {
    // Generate current timestamps for mock data
    const now = new Date();

    return {
        regional: [
            {
                sophoraId: 'regional-bw-789',
                externalId: 'bw-meldung-789',
                title: 'Test Baden-Württemberg News',
                date: now.toISOString(),
                teaserImage: {
                    imageVariants: {
                        '1x1-144': 'https://test.example.com/bw-144.jpg'
                    }
                },
                topline: 'Baden-Württemberg',
                firstSentence: 'Test regional news for Baden-Württemberg.',
                details: 'Full test regional content.',
                shareURL: 'https://test.tagesschau.de/regional-bw-test',
                tags: [{ tag: 'Baden-Württemberg' }],
                breakingNews: false,
                type: 'story',
                regionalId: 1
            }
        ]
    };
}

// Check if we're in a test environment and auto-enable mocking
if (process.env.NODE_ENV === 'test') {
    console.log('🧪 Test environment detected - enabling API mocking');
    enableMocking();
}

module.exports = {
    enableMocking,
    disableMocking,
    getMockHomepageData,
    getMockNewsData,
    getMockRegionalData,
    isMockingEnabled: () => isMockingEnabled
};