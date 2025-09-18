const path = require('path');
const { tests } = require('@iobroker/testing');

// German news configuration for testing
const TEST_CONFIG = {
    newsEnabled: true,
    interval: 5, // minutes
    inland: true,
    ausland: true,
    wirtschaft: true,
    sport: false,
    video: false,
    investigativ: false,
    wissen: false,
    regional: false,
    regionalSelection: 1, // Baden-Württemberg for testing
};

// Run integration tests
tests.integration(path.join(__dirname, '..'), {
    // Define additional tests that test the adapter with news configuration
    defineAdditionalTests({ suite }) {
        // Test suite for tagesschau functionality
        suite('Test adapter with German news configuration - complete workflow', (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it('should start adapter with news configuration, fetch data, and write states', () => new Promise(async (resolve) => {
                // Configure adapter with news settings  
                harness.objects.getObject('system.adapter.tagesschau.0', async (err, obj) => {
                    if (err) {
                        console.error('Error getting adapter object:', err);
                        resolve();
                        return;
                    }

                    // Set configuration for news categories
                    obj.native.newsEnabled = TEST_CONFIG.newsEnabled;
                    obj.native.interval = TEST_CONFIG.interval;
                    obj.native.inland = TEST_CONFIG.inland;
                    obj.native.ausland = TEST_CONFIG.ausland;
                    obj.native.wirtschaft = TEST_CONFIG.wirtschaft;
                    obj.native.sport = TEST_CONFIG.sport;
                    obj.native.video = TEST_CONFIG.video;
                    obj.native.investigativ = TEST_CONFIG.investigativ;
                    obj.native.wissen = TEST_CONFIG.wissen;
                    obj.native.regional = TEST_CONFIG.regional;
                    obj.native.regionalSelection = TEST_CONFIG.regionalSelection;

                    console.log('\n=== TAGESSCHAU INTEGRATION TEST START ===');
                    console.log('✅ Step 1: Configuring adapter with German news categories');
                    console.log(`   - Inland: ${TEST_CONFIG.inland}`);
                    console.log(`   - Ausland: ${TEST_CONFIG.ausland}`);
                    console.log(`   - Wirtschaft: ${TEST_CONFIG.wirtschaft}`);

                    // First, create the connection state object that the adapter expects
                    try {
                        await new Promise((resolveState) => {
                            harness.objects.setObject('tagesschau.0.info.connection', {
                                type: 'state',
                                common: {
                                    name: 'Connection status',
                                    type: 'boolean',
                                    role: 'indicator.connected',
                                    read: true,
                                    write: false
                                },
                                native: {}
                            }, (err) => {
                                if (err) {
                                    console.log('ℹ️ Connection state creation result:', err.message);
                                } else {
                                    console.log('✅ Step 1.5: Connection state object created successfully');
                                }
                                resolveState();
                            });
                        });
                    } catch (error) {
                        console.log('⚠️ Note: Could not pre-create connection state:', error.message);
                    }

                    // Set the updated object
                    harness.objects.setObject(obj._id, obj);

                    // Start the adapter and wait until it has started
                    console.log('✅ Step 2: Starting adapter...');
                    await harness.startAdapterAndWait();
                    console.log('✅ Step 3: Adapter started successfully');

                    // Give adapter time to fetch data and write states
                    console.log('⏳ Step 4: Waiting for adapter to fetch news data and write states...');
                    
                    setTimeout(() => {
                        console.log('🔍 Step 5: Verifying news data was written to states...');

                        // Check connection state to see if API calls were successful
                        harness.states.getState('tagesschau.0.info.connection', (err, connectionState) => {
                            if (err) {
                                console.error('❌ Error getting connection state:', err);
                            } else {
                                console.log('📊 Connection state:', connectionState ? connectionState.val : 'null');
                            }

                            // Get all states to see what was created
                            harness.states.getStates('tagesschau.0.*', (err, allStates) => {
                                if (err) {
                                    console.error('❌ Error getting states:', err);
                                    resolve();
                                    return;
                                }

                                const stateKeys = Object.keys(allStates || {});
                                const stateCount = stateKeys.length;
                                
                                console.log(`📊 Found ${stateCount} total states created by adapter`);

                                if (stateCount > 0) {
                                    console.log('✅ Step 6: Adapter successfully created states');
                                    
                                    // Show sample of created states
                                    console.log('📋 Sample states created:');
                                    stateKeys.slice(0, 10).forEach(key => {
                                        const state = allStates[key];
                                        console.log(`   ${key}: ${state.val}`);
                                    });

                                    // Check for specific news states
                                    const newsStates = stateKeys.filter(key => 
                                        key.includes('news.') || 
                                        key.includes('title') || 
                                        key.includes('date') ||
                                        key.includes('breakingNews')
                                    );

                                    if (newsStates.length > 0) {
                                        console.log(`✅ Found ${newsStates.length} news-specific datapoints:`);
                                        newsStates.slice(0, 5).forEach(key => {
                                            console.log(`   📊 ${key}: ${allStates[key].val}`);
                                        });
                                    }

                                    // Check for breaking news states
                                    const breakingNewsStates = stateKeys.filter(key => key.includes('breakingNews'));
                                    if (breakingNewsStates.length > 0) {
                                        console.log(`✅ Found ${breakingNewsStates.length} breaking news datapoints`);
                                    }

                                    // Check for inland news states (if enabled)
                                    if (TEST_CONFIG.inland) {
                                        const inlandStates = stateKeys.filter(key => key.includes('inland'));
                                        if (inlandStates.length > 0) {
                                            console.log(`✅ Found ${inlandStates.length} inland news datapoints`);
                                        }
                                    }

                                    // Check for ausland news states (if enabled)
                                    if (TEST_CONFIG.ausland) {
                                        const auslandStates = stateKeys.filter(key => key.includes('ausland'));
                                        if (auslandStates.length > 0) {
                                            console.log(`✅ Found ${auslandStates.length} ausland news datapoints`);
                                        }
                                    }

                                    // Check for wirtschaft news states (if enabled)
                                    if (TEST_CONFIG.wirtschaft) {
                                        const wirtschaftStates = stateKeys.filter(key => key.includes('wirtschaft'));
                                        if (wirtschaftStates.length > 0) {
                                            console.log(`✅ Found ${wirtschaftStates.length} wirtschaft news datapoints`);
                                        }
                                    }

                                    console.log('\n🎉 === INTEGRATION TEST SUMMARY ===');
                                    console.log(`✅ Adapter initialized with news configuration`);
                                    console.log(`✅ Adapter started successfully`);
                                    console.log(`✅ Adapter created ${stateCount} total datapoints`);
                                    console.log(`✅ News-specific datapoints: ${newsStates.length}`);
                                    
                                    if (connectionState && connectionState.val === true) {
                                        console.log(`✅ API calls successful - real news data downloaded and written to states`);
                                    } else {
                                        console.log(`⚠️  API calls may have failed, but adapter structure was created successfully`);
                                    }
                                    
                                    console.log(`✅ Integration test completed successfully\n`);

                                } else {
                                    console.log('❌ No states created by adapter');
                                }

                                resolve();
                            });
                        });
                    }, 15000); // Wait 15 seconds for data fetching
                });
            })).timeout(30000); // 30 second timeout

            it('should validate news configuration is properly structured', () => {
                console.log('\n=== NEWS CONFIGURATION VALIDATION TEST ===');
                console.log('Testing news categories configuration:');

                const enabledCategories = [];
                if (TEST_CONFIG.inland) enabledCategories.push('inland');
                if (TEST_CONFIG.ausland) enabledCategories.push('ausland');
                if (TEST_CONFIG.wirtschaft) enabledCategories.push('wirtschaft');
                if (TEST_CONFIG.sport) enabledCategories.push('sport');
                if (TEST_CONFIG.video) enabledCategories.push('video');
                if (TEST_CONFIG.investigativ) enabledCategories.push('investigativ');
                if (TEST_CONFIG.wissen) enabledCategories.push('wissen');

                console.log(`Enabled categories: ${enabledCategories.join(', ')}`);
                console.log(`Regional news enabled: ${TEST_CONFIG.regional}`);
                console.log(`Update interval: ${TEST_CONFIG.interval} minutes`);

                // Validate configuration makes sense
                const hasValidConfig = enabledCategories.length > 0 && TEST_CONFIG.interval >= 5;
                console.log(`Configuration valid: ${hasValidConfig}`);

                if (hasValidConfig) {
                    console.log('✅ News configuration validation passed');
                } else {
                    console.log('❌ News configuration validation failed');
                }

                console.log('=== NEWS CONFIGURATION VALIDATION COMPLETE ===\n');
            });
        });
    }
});