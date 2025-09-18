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
- Integration tests: `test/integration-*.js`
- Package tests: `test/package.js`

#### Test Commands
```bash
npm run test:ts      # TypeScript unit tests
npm run test:package # Package validation
npm run test         # All tests
```

#### ioBroker Integration Testing

**IMPORTANT**: Use the official `@iobroker/testing` framework for all integration tests. This is the ONLY correct way to test ioBroker adapters.

**Official Documentation**: https://github.com/ioBroker/testing

##### Framework Structure
Integration tests MUST follow this exact pattern:

```javascript
const path = require('path');
const { tests } = require('@iobroker/testing');

// Define test configuration
const TEST_CONFIG = {
    newsEnabled: true,
    interval: 5, // minutes
    inland: true,
    ausland: true,
    // ... other config
};

// Use tests.integration() with defineAdditionalTests
tests.integration(path.join(__dirname, '..'), {
    defineAdditionalTests({ suite }) {
        suite('Test adapter with news configuration', (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it('should configure and start adapter', () => new Promise(async (resolve) => {
                // Get adapter object and configure
                harness.objects.getObject('system.adapter.tagesschau.0', async (err, obj) => {
                    if (err) {
                        console.error('Error getting adapter object:', err);
                        resolve();
                        return;
                    }

                    // Configure adapter properties
                    obj.native.newsEnabled = TEST_CONFIG.newsEnabled;
                    obj.native.interval = TEST_CONFIG.interval;
                    obj.native.inland = TEST_CONFIG.inland;
                    obj.native.ausland = TEST_CONFIG.ausland;
                    // ... other configuration

                    // Set the updated configuration
                    harness.objects.setObject(obj._id, obj);

                    // Start adapter and wait
                    await harness.startAdapterAndWait();

                    // Wait for adapter to process data
                    setTimeout(() => {
                        // Verify states were created
                        harness.states.getState('tagesschau.0.info.connection', (err, state) => {
                            if (state && state.val === true) {
                                console.log('✅ Adapter started successfully');
                            }
                            resolve();
                        });
                    }, 15000); // Allow time for API calls
                });
            })).timeout(30000);
        });
    }
});
```

##### Key Integration Testing Rules

1. **NEVER test API URLs directly** - Let the adapter handle API calls
2. **ALWAYS use the harness** - `getHarness()` provides the testing environment  
3. **Configure via objects** - Use `harness.objects.setObject()` to set adapter configuration
4. **Start properly** - Use `harness.startAdapterAndWait()` to start the adapter
5. **Check states** - Use `harness.states.getState()` to verify results
6. **Use timeouts** - Allow time for async operations with appropriate timeouts
7. **Test real workflow** - Initialize → Configure → Start → Verify States

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

##### What NOT to Do
❌ Direct API testing: `axios.get('https://www.tagesschau.de/api2u')`
❌ Mock adapters: `new MockAdapter()`  
❌ Direct internet calls in tests
❌ Bypassing the harness system

##### What TO Do
✅ Use `@iobroker/testing` framework
✅ Configure via `harness.objects.setObject()`
✅ Start via `harness.startAdapterAndWait()`
✅ Test complete adapter lifecycle
✅ Verify states via `harness.states.getState()`
✅ Allow proper timeouts for async operations

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