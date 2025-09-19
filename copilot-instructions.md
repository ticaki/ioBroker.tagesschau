# GitHub Copilot Instructions for ioBroker.tagesschau

## Project Overview

This is an ioBroker adapter for the [Tagesschau API](https://www.tagesschau.de/), which provides free German news data from ARD Tagesschau. The adapter converts Tagesschau news data into an easy-to-use format for ioBroker installations.

**Key Features:**
- News data from ARD Tagesschau API
- Current breaking news, regional news, and topic-specific news
- Automatic news updates with configurable intervals
- Support for multiple news categories (inland, ausland, wirtschaft, sport, video, investigativ, wissen)
- Regional news support for all 16 German states
- Multilingual support for all user-facing content

## Development Guidelines

### Follow ioBroker Standards
This adapter must conform to the [ioBroker adapter development documentation](https://www.iobroker.net/#en/documentation/dev/adapterdev.md). Always reference this documentation for:
- Adapter structure and lifecycle
- State and object definitions
- Configuration patterns
- Testing requirements

### Coding Style and Comments

#### Code Comments
- **ALWAYS write code comments in English only**
- Use clear, descriptive comments for complex logic
- Comment public methods and their parameters
- Explain business logic related to news data processing
- Example:
```typescript
/**
 * Processes news data from Tagesschau API and creates ioBroker states
 * @param newsData Raw news data from the API
 * @param topic News topic/category for organization
 */
private async processNewsData(newsData: TagesschauNews, topic: string): Promise<void> {
    // Convert news timestamp to JavaScript Date for better handling
    // Tagesschau uses ISO 8601 format: "2024-01-15T10:30:00.000Z"
    const newsDate = new Date(newsData.date);
}
```

#### TypeScript Usage
- Use TypeScript for all source files
- Define proper interfaces for API responses (see `src/lib/definition.ts`)
- Use strict typing - avoid `any` type
- Example type definitions:
```typescript
interface TagesschauNews {
    sophoraId: string;
    externalId: string;
    title: string;
    date: string;
    teaserImage?: {
        imageVariants: {
            '1x1-144': string;
            '1x1-256': string;
            // ... other variants
        };
    };
    // ... other properties
}
```

### Changelog Entries

#### Format Rules
All changelog entries must follow this exact format:
```
- (ticaki) Description of the change
```

#### Examples
```
- (ticaki) Added new datapoint for news article images support
- (ticaki) News categories are now translated into ioBroker system language  
- (ticaki) Fixed issue with regional news selection for Bavaria
```

#### Guidelines
- Use past tense ("Added", "Fixed", "Updated")
- Be concise but descriptive
- Reference issue numbers when applicable: `fixes [#11](https://github.com/ticaki/ioBroker.tagesschau/issues/11)`
- Group related changes together
- Always use `(ticaki)` as the author prefix

### Translation Requirements

#### Multilingual Support
All user-facing strings MUST be translated into these languages:
- `en` (English) - base language
- `de` (German)
- `ru` (Russian)
- `pt` (Portuguese)
- `nl` (Dutch)
- `fr` (French)
- `it` (Italian)
- `es` (Spanish)
- `pl` (Polish)
- `uk` (Ukrainian)
- `zh-cn` (Chinese Simplified)

#### Translation Files
- Admin UI translations: `admin/i18n/{lang}/translations.json`
- Package descriptions: `io-package.json` - `common.news.{version}` and `common.desc`

#### Translation Guidelines
- Provide accurate translations, not literal word-for-word translations
- Maintain consistency with existing ioBroker terminology
- Technical terms (like "datapoint", "breaking news") should use established translations
- When in doubt, check other ioBroker adapters for similar terminology

#### Example Translation Structure
```json
{
    "en": "Breaking news from German public television",
    "de": "Eilmeldungen des deutschen öffentlichen Fernsehens",
    "ru": "Экстренные новости немецкого общественного телевидения",
    // ... other languages
}
```

### Datapoints and Object Structure

#### Object Hierarchy
```
tagesschau.0/
├── info/
│   └── connection (boolean)
├── news/                    # News categories
│   ├── breakingNewsHomepage/
│   ├── inland/             # Domestic news
│   ├── ausland/            # International news
│   ├── wirtschaft/         # Business news
│   ├── sport/              # Sports news
│   ├── video/              # Video news
│   ├── investigativ/       # Investigative journalism
│   ├── wissen/             # Science news
│   └── regional/           # Regional news (16 states)
│       ├── baden-wuerttemberg/
│       ├── bayern/
│       └── ...
├── breakingNewsHomepageCount  # Number of breaking news
└── breakingNewsHomepageArray  # JSON array of breaking news
```

#### State Definition Patterns
Follow these patterns when creating new states:

```typescript
// For news text content
{
    _id: 'title',
    type: 'state',
    common: {
        name: 'News Title',
        type: 'string',
        role: 'text',
        read: true,
        write: false
    },
    native: {}
}

// For news dates
{
    _id: 'date',
    type: 'state',
    common: {
        name: 'News Date',
        type: 'string',
        role: 'value.time',
        read: true,
        write: false
    },
    native: {}
}

// For news images
{
    _id: 'teaserImage',
    type: 'state',
    common: {
        name: 'News Image URL',
        type: 'string',
        role: 'text.url',
        read: true,
        write: false
    },
    native: {}
}
```

#### Naming Conventions
- Use camelCase for state IDs matching Tagesschau API responses
- Use descriptive names for channels and folders
- Include category names when relevant (e.g., `inland`, `ausland`, `regional`)
- Use appropriate ioBroker roles (e.g., `text`, `text.url`, `value.time`)

### API Integration Guidelines

#### Tagesschau API Usage
- Base URL: `https://www.tagesschau.de/api2u/`
- Endpoints:
  - Homepage news: `/homepage/`
  - News by topic: `/news/`
  - Regional news: `/regions/`
- Always handle API errors gracefully
- Implement proper timeout handling (default: 15 seconds)
- Respect rate limits and use appropriate polling intervals

#### Error Handling
```typescript
try {
    const response = await axios.get(apiUrl, { timeout: 15000 });
    // Process response
} catch (error) {
    this.log.error(`Tagesschau API request failed: ${error instanceof Error ? error.message : String(error)}`);
    await this.setState('info.connection', false, true);
}
```

### News Category Handling

#### Supported Categories
- `inland`: Domestic German news
- `ausland`: International news
- `wirtschaft`: Business and economics
- `sport`: Sports news
- `video`: Video news content
- `investigativ`: Investigative journalism
- `wissen`: Science and technology
- `regional`: Regional news (16 German states)

#### Regional News
Support for all 16 German federal states:
1. Baden-Württemberg
2. Bayern (Bavaria)
3. Berlin
4. Brandenburg
5. Bremen
6. Hamburg
7. Hessen
8. Mecklenburg-Vorpommern
9. Niedersachsen
10. Nordrhein-Westfalen
11. Rheinland-Pfalz
12. Saarland
13. Sachsen
14. Sachsen-Anhalt
15. Schleswig-Holstein
16. Thüringen

### News Data Processing

#### News Article Structure
Each news article contains:
- `sophoraId`: Unique Tagesschau identifier
- `externalId`: External reference ID
- `title`: Article headline
- `date`: Publication timestamp (ISO 8601)
- `teaserImage`: Preview image with multiple resolutions
- `topline`: Category/topic line
- `firstSentence`: Article lead sentence
- `details`: Full article content
- `shareURL`: Sharing link
- `tags`: Article keywords/tags

#### Image Handling
Tagesschau provides multiple image resolutions:
- `1x1-144`, `1x1-256`, `1x1-432`, `1x1-640`, `1x1-840`
- `16x9-256`, `16x9-384`, `16x9-512`, `16x9-640`, `16x9-960`, `16x9-1280`, `16x9-1920`

Choose appropriate resolutions based on use case and available bandwidth.

### Testing Guidelines

#### Test Structure
- Unit tests: `src/**/*.test.ts`
- Integration tests: `test/integration-tagesschau-offline.js` (offline only)
- Package tests: `test/package.js`

#### Test Commands
```bash
npm run test:ts            # TypeScript unit tests
npm run test:package       # Package validation
npm run test               # Basic tests (unit + package)
npm run test:all           # All tests including offline integration
npm run test:integration-custom  # Run only the custom integration test
```

**CRITICAL**: Always use `npm run test:integration-custom` for integration testing. This runs the enhanced offline tests that include both success and failure scenarios.

#### ioBroker Integration Testing

**IMPORTANT**: This adapter uses ONLY offline integration testing with mocked API responses. No real API calls are made during testing to avoid rate limiting and ensure consistent test results.

**Official Documentation**: https://github.com/ioBroker/testing

##### Framework Structure  
Integration tests MUST use the working pattern with BOTH success and failure scenarios:

```javascript
// Load test setup FIRST to configure mocking for offline testing
require('./test-setup');

const path = require('path');
const { tests } = require('@iobroker/testing');

const TEST_CONFIG = {
    newsEnabled: true,
    interval: 5,
    inland: true,
    ausland: true,
    // ... other configuration
};

tests.integration(path.join(__dirname, '..'), {
    defineAdditionalTests({ suite }) {
        // SUCCESS TEST: Test normal operation with enabled features
        suite('Test adapter with news configuration - offline mode', (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it('should create connection state and start adapter with offline data', () => new Promise(async (resolve, reject) => {
                console.log('\n=== OFFLINE TAGESSCHAU INTEGRATION TEST START ===');
                
                // Configure adapter  
                harness.objects.getObject('system.adapter.tagesschau.0', async (err, obj) => {
                    if (err) {
                        console.error('❌ Error getting adapter object:', err);
                        reject(err);
                        return;
                    }

                    // Set test configuration
                    Object.assign(obj.native, TEST_CONFIG);
                    obj.native.L1 = true; // Need at least one region for API calls
                    
                    harness.objects.setObject(obj._id, obj);
                    await harness.startAdapterAndWait();
                    
                    // Wait for processing
                    setTimeout(async () => {
                        try {
                            const stateIds = await harness.dbConnection.getStateIDs('tagesschau.0.*');
                            
                            if (stateIds.length === 0) {
                                reject(new Error('No states were created by the adapter'));
                                return;
                            }
                            
                            // CRITICAL: Test that expected states exist
                            const newsStates = stateIds.filter(key => 
                                key.includes('news.') || 
                                key.includes('title') || 
                                key.includes('date')
                            );
                            
                            if (newsStates.length === 0) {
                                reject(new Error('No news states found'));
                                return;
                            }
                            
                            const inlandStates = stateIds.filter(key => key.includes('inland'));
                            if (TEST_CONFIG.inland && inlandStates.length === 0) {
                                reject(new Error('Expected inland states but none were found'));
                                return;
                            }
                            
                            const auslandStates = stateIds.filter(key => key.includes('ausland'));
                            if (TEST_CONFIG.ausland && auslandStates.length === 0) {
                                reject(new Error('Expected ausland states but none were found'));
                                return;
                            }
                            
                            console.log(`✅ Integration test completed successfully - ${stateIds.length} states created`);
                            resolve();
                            
                        } catch (error) {
                            reject(error);
                        }
                    }, 30000);
                });
            })).timeout(60000);
        });

        // FAILURE TEST: Test when features are disabled
        suite('should NOT create news states when news categories are disabled', (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it('should NOT create inland/ausland states when both are disabled', () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        console.log('\n=== NEGATIVE TEST: News categories disabled ===');
                        
                        harness = getHarness();
                        const obj = await harness.objects.getObject('system.adapter.tagesschau.0');
                        
                        // Configure with ALL news categories disabled
                        Object.assign(obj.native, {
                            newsEnabled: true,
                            interval: 5,
                            inland: false,    // DISABLED
                            ausland: false,   // DISABLED
                            wirtschaft: false,
                            sport: false,
                            video: false,
                            investigativ: false,
                            wissen: false,
                            regional: false,
                            L1: false
                        });
                        
                        await new Promise((resolve, reject) => {
                            harness.objects.setObject(obj._id, obj, (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                        });
                        await harness.startAdapterAndWait();
                        
                        setTimeout(async () => {
                            const stateIds = await harness.dbConnection.getStateIDs('tagesschau.0.*');
                            
                            // Verify news states DON'T exist (disabled)
                            const inlandStates = stateIds.filter(key => 
                                key.includes('inland') && 
                                !key.includes('controls') && 
                                !key.includes('newsCount')
                            );
                            
                            if (inlandStates.length > 0) {
                                reject(new Error(`Expected no inland news states but found ${inlandStates.length}`));
                                return;
                            }
                            
                            const auslandStates = stateIds.filter(key => 
                                key.includes('ausland') && 
                                !key.includes('controls') && 
                                !key.includes('newsCount')
                            );
                            
                            if (auslandStates.length > 0) {
                                reject(new Error(`Expected no ausland news states but found ${auslandStates.length}`));
                                return;
                            }
                            
                            console.log('✅ Negative test completed successfully');
                            await harness.stopAdapter();
                            resolve(true);
                            
                        }, 15000);
                        
                    } catch (error) {
                        reject(error);
                    }
                });
            }).timeout(40000);
        });
    }
});
```

##### Key Integration Testing Rules

**CRITICAL PRINCIPLES:**
1. **ALWAYS use offline testing** - Load `require('./test-setup')` at the top to enable mocking
2. **Split test suites** - Use separate suites for different scenarios (can't restart adapter within same `it`)
3. **Test SUCCESS and FAILURE** - For every "it works" test, add corresponding "it fails when disabled" test
4. **MUST FAIL when expected states missing** - Use `reject(new Error(...))` not just logging
5. **Use proper async patterns** - `await harness.startAdapterAndWait()`, proper Promise handling
6. **Allow sufficient time** - `await setTimeout()` for data processing, `.timeout(40000)` for tests

**Required Test Structure:**
- ✅ Success test: News categories enabled → Verify news state types exist
- ✅ Failure test: Categories disabled → Verify no news states created  
- ✅ Partial test: Only inland enabled → Verify only inland states exist
- ✅ Use `reject(new Error(...))` when validation fails
- ✅ Use offline mocked data (no real API calls)

**Testing Workflow:**
1. **Initialize** - `getHarness()` and get adapter object
2. **Configure** - Use `harness.objects.setObject()` to set adapter configuration  
3. **Start** - Use `harness.startAdapterAndWait()` to start the adapter
4. **Wait** - Allow time for processing: `setTimeout(() => {}, 15000-30000)`
5. **Verify** - Get states and validate expected behavior with `reject()` for failures
6. **Cleanup** - `await harness.stopAdapter()` when done

##### Offline Testing Features
- **Dynamic test data**: All timestamps are generated at test runtime to avoid date comparison issues
- **Comprehensive mocking**: All Tagesschau API endpoints are mocked with realistic data
- **No rate limiting**: Tests can run frequently without API restrictions
- **Consistent results**: Same test data every time, ensuring reproducible tests

##### What NOT to Do
❌ Real API testing: `axios.get('https://www.tagesschau.de/api2u')`
❌ Mock adapters: `new MockAdapter()`  
❌ Direct internet calls in tests
❌ Bypassing the mocking system
❌ Using fixed timestamps in test data
❌ Single test suite for all scenarios (adapter restart issues)
❌ Only logging failures without rejecting
❌ Testing only success cases without corresponding failure cases
❌ Insufficient timeouts for async operations

##### What TO Do
✅ Use `@iobroker/testing` framework
✅ Load `./test-setup` to enable mocking
✅ Configure via `harness.objects.setObject()`
✅ Start via `harness.startAdapterAndWait()`
✅ Test complete adapter lifecycle with mocked data
✅ Verify states via `harness.dbConnection.getStateIDs()` and `harness.states.getStates()`
✅ Use dynamic timestamps in test data
✅ Allow proper timeouts for async operations
✅ Use separate test suites for different scenarios
✅ Test both success (states created) and failure (states not created) scenarios
✅ Use `reject(new Error(...))` when expected states are missing
✅ Use proper timeouts: `.timeout(40000)` for tests, `setTimeout(..., 15000-30000)` for processing
✅ Follow the exact pattern from working integration tests

##### Workflow Dependencies
Integration tests should run ONLY after lint and adapter tests pass:

```yaml
integration-tests:
  needs: [check-and-lint, adapter-tests]
  runs-on: ubuntu-latest
  steps:
    - name: Run integration tests
      run: npx mocha test/integration-*.js --exit
```

### Build and Development

#### Build Process
```bash
npm run build        # Compile TypeScript
npm run watch        # Watch mode for development
npm run check        # Type checking without build
npm run lint         # ESLint checking
```

#### Code Quality
- Use ESLint configuration from `@iobroker/eslint-config`
- Follow Prettier formatting rules
- Ensure TypeScript compilation without errors
- All code must pass linting before commits

## Documentation Links

### Essential References
- [Tagesschau API Documentation](https://www.tagesschau.de/api2u/)
- [ioBroker Adapter Development Guide](https://www.iobroker.net/#en/documentation/dev/adapterdev.md)
- [ARD Tagesschau](https://www.tagesschau.de/)

### ioBroker Specific
- [State Roles Documentation](https://github.com/ioBroker/ioBroker.docs/blob/master/docs/en/dev/objectsschema.md)
- [Adapter Configuration Schema](https://github.com/ioBroker/ioBroker.docs/blob/master/docs/en/dev/adapterconfigschema.md)
- [Translation Guidelines](https://github.com/ioBroker/ioBroker.docs/blob/master/docs/en/dev/translating.md)

## Common Patterns and Examples

### Creating New News Datapoints
When adding new news data from the Tagesschau API:

1. Add the field to the TypeScript interface in `src/lib/definition.ts`
2. Create the state object definition with appropriate role and unit
3. Add translation strings for the datapoint name
4. Update processing logic to handle the new field
5. Consider fallback behavior if data is missing
6. Update changelog with the addition

### Adding Configuration Options
For new adapter configuration options:
1. Update `admin/jsonConfig.json` with the new field
2. Add translations in all supported languages
3. Update the TypeScript configuration interface
4. Handle the configuration in the main adapter logic
5. Document the option in README.md if user-facing

### News Category Management
When adding support for new news categories:
1. Define the category in the topic list
2. Add configuration checkbox in admin interface
3. Create state structure for the category
4. Implement API endpoint mapping
5. Add proper error handling for category-specific issues
6. Update translations for category names

Remember: Always prioritize code clarity, proper error handling, and comprehensive multilingual support. This adapter serves German-speaking users primarily but must maintain high quality standards consistent with the ioBroker ecosystem.