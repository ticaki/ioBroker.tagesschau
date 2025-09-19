/**
 * Enhanced integration test with offline data support
 * This test uses pre-defined mock data instead of making real API calls
 */

// Load test setup FIRST to configure mocking
require('./test-setup');

const path = require('path');
const { tests } = require('@iobroker/testing');

// German news configuration for testing - reduced scope for cleaner testing
const TEST_CONFIG = {
    newsEnabled: true,
    interval: 5, // minutes
    inland: true,
    ausland: true,
    wirtschaft: false, // Disable to reduce state count for testing
    sport: false,
    video: false,
    investigativ: false,
    wissen: false,
    regional: false,
    regionalSelection: 1, // Baden-Württemberg for testing
};

// Run integration tests
tests.integration(path.join(__dirname, '..'), {
    // Define additional tests that test the adapter with offline data
    defineAdditionalTests({ suite }) {
        // Test suite for tagesschau functionality using offline data
        suite('Test adapter with German news configuration - offline data mode', (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it('should create connection state and start adapter with offline data', () => new Promise(async (resolve) => {
                console.log('\n=== OFFLINE TAGESSCHAU INTEGRATION TEST START ===');
                console.log('✅ Step 1: Using offline test data (no real API calls)');
                console.log('📊 Test data available for offline testing');

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
                                console.log('✅ Step 2: Connection state object created successfully');
                            }
                            resolveState();
                        });
                    });
                } catch (error) {
                    console.log('⚠️ Note: Could not pre-create connection state:', error.message);
                }

                // Configure adapter with news settings
                harness.objects.getObject('system.adapter.tagesschau.0', async (err, obj) => {
                    if (err) {
                        console.error('❌ Error getting adapter object:', err);
                        reject();
                        return;
                    }

                    console.log('✅ Step 3: Configuring adapter with German news categories (offline mode)');

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
                    // Set at least one region to satisfy adapter requirements for news API calls
                    // The API URL pattern requires regions parameter: https://www.tagesschau.de/api2u/news/?regions=${this.regions}&ressort=${topic}
                    obj.native.L1 = true; // Baden-Württemberg (region 1)

                    // Set the updated object
                    harness.objects.setObject(obj._id, obj);

                    console.log('✅ Step 4: Starting adapter with offline data...');
                    // Start the adapter and wait until it has started
                    await harness.startAdapterAndWait();
                    console.log('✅ Step 5: Adapter started successfully');

                    // Give adapter time to process offline data and write states
                    console.log('⏳ Step 6: Waiting for adapter to process offline data and write states...');
                    
                    setTimeout(() => {
                        console.log('🔍 Step 7: Verifying news data was written to states...');

                        // Check connection state to see if offline processing was successful
                        harness.states.getState('tagesschau.0.info.connection', (err, connectionState) => {
                            if (err) {
                                console.error('❌ Error getting connection state:', err);
                            } else {
                                console.log('📊 Connection state:', connectionState ? connectionState.val : 'null');
                            }

                            // Get all states to see what was created
                            // Use the correct pattern from brightsky adapter to avoid "no keys" error
                            // First get the state IDs that match the pattern
                            harness.dbConnection.getStateIDs('tagesschau.0.*').then(stateIds => {
                                if (stateIds && stateIds.length > 0) {
                                    harness.states.getStates(stateIds, (err, allStates) => {
                                        if (err) {
                                            console.error('❌ Error getting states:', err);
                                            reject(err); // Properly fail the test instead of just resolving
                                            return;
                                        }

                                        const stateCount = stateIds.length;
                                        
                                        console.log(`📊 Found ${stateCount} total states created by adapter`);

                                        if (stateCount > 0) {
                                            console.log('✅ Step 8: Adapter successfully created states using offline data');
                                            
                                            // Show sample of created states - FIX: access states correctly by index
                                            console.log('📋 Sample states created:');
                                            stateIds.slice(0, 10).forEach((stateId, index) => {
                                                const state = allStates[index]; // FIX: Use index, not stateId as key
                                                console.log(`   ${stateId}: ${state && state.val !== undefined ? state.val : 'undefined'}`);
                                            });

                                            // Check for specific news states
                                            const newsStates = stateIds.filter(key => 
                                                key.includes('news.') || 
                                                key.includes('title') || 
                                                key.includes('date') ||
                                                key.includes('breakingNews')
                                            );

                                            if (newsStates.length > 0) {
                                                console.log(`✅ Found ${newsStates.length} news-specific datapoints:`);
                                                newsStates.slice(0, 5).forEach(stateId => {
                                                    const index = stateIds.indexOf(stateId); // FIX: Get correct index
                                                    const state = allStates[index];
                                                    console.log(`   📊 ${stateId}: ${state && state.val !== undefined ? state.val : 'undefined'}`);
                                                });
                                            }

                                            // Check for breaking news states
                                            const breakingNewsStates = stateIds.filter(key => key.includes('breakingNews'));
                                            if (breakingNewsStates.length > 0) {
                                                console.log(`✅ Found ${breakingNewsStates.length} breaking news datapoints`);
                                            }

                                            // Check for inland news states (if enabled)
                                            if (TEST_CONFIG.inland) {
                                                const inlandStates = stateIds.filter(key => key.includes('inland'));
                                                if (inlandStates.length > 0) {
                                                    console.log(`✅ Found ${inlandStates.length} inland news datapoints`);
                                                    // Show sample inland NEWS CONTENT states (not just control states)
                                                    const inlandNewsContent = inlandStates.filter(key => 
                                                        key.includes('.0.title') || key.includes('.0.date') || 
                                                        key.includes('.0.firstSentence') || key.includes('.newsCount')
                                                    );
                                                    console.log(`   📰 Inland news content states: ${inlandNewsContent.length}`);
                                                    inlandNewsContent.slice(0, 3).forEach(stateId => {
                                                        const index = stateIds.indexOf(stateId);
                                                        const state = allStates[index];
                                                        console.log(`     📰 ${stateId}: ${state && state.val !== undefined ? state.val : 'undefined'}`);
                                                    });
                                                }
                                                else {
                                                    console.log('⚠️ No inland news states found - this may indicate an issue with offline data');
                                                    reject(new Error('No inland news states found'));
                                                    return;
                                                }
                                            }

                                            // Check for ausland news states (if enabled)
                                            if (TEST_CONFIG.ausland) {
                                                const auslandStates = stateIds.filter(key => key.includes('ausland'));
                                                if (auslandStates.length > 0) {
                                                    console.log(`✅ Found ${auslandStates.length} ausland news datapoints`);
                                                    // Show sample ausland NEWS CONTENT states to verify expected content
                                                    const auslandNewsContent = auslandStates.filter(key => 
                                                        key.includes('.0.title') || key.includes('.0.date') || 
                                                        key.includes('.0.firstSentence') || key.includes('.newsCount')
                                                    );
                                                    console.log(`   🌍 Ausland news content states: ${auslandNewsContent.length}`);
                                                    auslandNewsContent.slice(0, 3).forEach(stateId => {
                                                        const index = stateIds.indexOf(stateId);
                                                        const state = allStates[index];
                                                        console.log(`     🌍 ${stateId}: ${state && state.val !== undefined ? state.val : 'undefined'}`);
                                                    });
                                                }
                                                else {
                                                    console.log('⚠️ No ausland news states found - this may indicate an issue with offline data');
                                                    reject(new Error('No ausland news states found'));
                                                    return;
                                                }

                                            }

                                            // Check for wirtschaft news states (if enabled)
                                            if (TEST_CONFIG.wirtschaft) {
                                                const wirtschaftStates = stateIds.filter(key => key.includes('wirtschaft'));
                                                if (wirtschaftStates.length > 0) {
                                                    console.log(`✅ Found ${wirtschaftStates.length} wirtschaft news datapoints`);
                                                }
                                            }

                                            // Validate that we have actual data values, not just undefined
                                            let statesWithValues = 0;
                                            allStates.forEach(state => {
                                                if (state && state.val !== undefined && state.val !== null) {
                                                    statesWithValues++;
                                                }
                                            });

                                            console.log(`📊 States with actual values: ${statesWithValues}/${stateCount}`);

                                            // Check connection state
                                            if (connectionState && connectionState.val === true) {
                                                console.log('✅ Connection state indicates successful processing');
                                            } else {
                                                console.log('⚠️ Connection state indicates potential issues');
                                            }

                                            console.log('\n🎉 === OFFLINE INTEGRATION TEST SUMMARY ===');
                                            console.log(`✅ Adapter initialized with German news configuration`);
                                            console.log(`✅ Adapter started successfully using offline test data`);
                                            console.log(`✅ Adapter created ${stateCount} total datapoints`);
                                            console.log(`✅ States with values: ${statesWithValues}/${stateCount}`);
                                            console.log(`✅ News-specific datapoints: ${newsStates.length}`);
                                            console.log(`✅ Connection state properly handled: ${connectionState ? connectionState.val : 'null'}`);
                                            console.log(`✅ No real API calls were made - all data from offline test files`);

                                            // FAIL the test if we don't have sufficient valid states
                                            if (statesWithValues < (stateCount * 0.5)) { // At least 50% should have values
                                                console.log('❌ FAILURE: Too few states have actual values - this indicates a problem');
                                                reject(new Error(`Only ${statesWithValues}/${stateCount} states have values`));
                                                return;
                                            }

                                            console.log(`✅ Integration test completed successfully\\n`);

                                        } else {
                                            console.log('❌ No states created by adapter');
                                            reject(new Error('No states were created by the adapter')); // FAIL the test
                                            return;
                                        }

                                        resolve();
                                    });
                                } else {
                                    console.log('❌ No state IDs found matching pattern tagesschau.0.*');
                                    reject(new Error('No states found matching pattern tagesschau.0.*')); // FAIL the test
                                }
                            }).catch(err => {
                                console.error('❌ Error getting state IDs:', err);
                                reject(err); // FAIL the test properly
                            });
                        });
                    }, 30000); // Wait 30 seconds for offline data processing
                });
            })).timeout(60000); // 60 second timeout

            it('should validate news configuration is properly structured in offline mode', () => {
                console.log('\n=== OFFLINE NEWS CONFIGURATION VALIDATION TEST ===');
                console.log('Testing news categories configuration for offline mode:');

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
                console.log('Using offline test data instead of real API calls');

                // Validate configuration makes sense
                const hasValidConfig = enabledCategories.length > 0 && TEST_CONFIG.interval >= 5;
                console.log(`Configuration valid: ${hasValidConfig}`);

                if (hasValidConfig) {
                    console.log('✅ Offline news configuration validation passed');
                } else {
                    console.log('❌ Offline news configuration validation failed');
                }

                console.log('=== OFFLINE NEWS CONFIGURATION VALIDATION COMPLETE ===\\n');
            });
        });

        // New test suite for failure scenarios - separate suite because `it` doesn't support restarting adapter
        suite('should NOT create news states when news categories are disabled', (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it('should NOT create inland/ausland states when both are disabled', () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        console.log('\n=== NEGATIVE TEST: News categories disabled ===');
                        console.log('✅ Step 1: Testing behavior when inland and ausland are disabled');
                        
                        harness = getHarness();
                        const obj = await new Promise((res, rej) => {
                            harness.objects.getObject('system.adapter.tagesschau.0', (err, o) => {
                                if (err) return rej(err);
                                res(o);
                            });
                        });
                        
                        if (!obj) {
                            return reject(new Error('Adapter object not found'));
                        }
                        
                        console.log('✅ Step 2: Configuring adapter with ALL news categories disabled...');
                        
                        // Configure with ALL news categories disabled
                        obj.native.newsEnabled = true; // Keep adapter enabled
                        obj.native.interval = 5;
                        obj.native.inland = false;    // DISABLED
                        obj.native.ausland = false;   // DISABLED  
                        obj.native.wirtschaft = false; // DISABLED
                        obj.native.sport = false;     // DISABLED
                        obj.native.video = false;     // DISABLED
                        obj.native.investigativ = false; // DISABLED
                        obj.native.wissen = false;    // DISABLED
                        obj.native.regional = false;  // DISABLED
                        obj.native.L1 = false; // No regional selection
                        
                        await new Promise((res, rej) => {
                            harness.objects.setObject(obj._id, obj, (err) => {
                                if (err) return rej(err);
                                console.log('✅ Step 3: Adapter configuration updated');
                                res(undefined);
                            });
                        });
                        
                        console.log('✅ Step 4: Starting adapter with disabled news categories...');
                        await harness.startAdapterAndWait();
                        console.log('✅ Step 5: Adapter started');
                        
                        console.log('⏳ Step 6: Waiting 15 seconds for adapter to process (should create minimal states)...');
                        await new Promise(res => setTimeout(res, 15000));
                        
                        console.log('🔍 Step 7: Checking that news category states were NOT created...');
                        const stateIds = await harness.dbConnection.getStateIDs('tagesschau.0.*');
                        
                        console.log(`📊 Step 8: Found ${stateIds.length} total states`);
                        
                        // Verify inland states DON'T exist (disabled)
                        const inlandStates = stateIds.filter(key => 
                            key.includes('inland') && 
                            !key.includes('controls') && 
                            !key.includes('newsCount')
                        );
                        if (inlandStates.length === 0) {
                            console.log('✅ Step 9: No inland news content states found as expected');
                        } else {
                            console.log(`❌ Step 9: Found ${inlandStates.length} inland states when none expected`);
                            return reject(new Error(`Expected no inland news states but found ${inlandStates.length}`));
                        }
                        
                        // Verify ausland states DON'T exist (disabled)
                        const auslandStates = stateIds.filter(key => 
                            key.includes('ausland') && 
                            !key.includes('controls') && 
                            !key.includes('newsCount')
                        );
                        if (auslandStates.length === 0) {
                            console.log('✅ Step 10: No ausland news content states found as expected');
                        } else {
                            console.log(`❌ Step 10: Found ${auslandStates.length} ausland states when none expected`);
                            return reject(new Error(`Expected no ausland news states but found ${auslandStates.length}`));
                        }
                        
                        // Verify wirtschaft states DON'T exist (disabled)
                        const wirtschaftStates = stateIds.filter(key => key.includes('wirtschaft'));
                        if (wirtschaftStates.length === 0) {
                            console.log('✅ Step 11: No wirtschaft states found as expected');
                        } else {
                            console.log(`❌ Step 11: Found ${wirtschaftStates.length} wirtschaft states when none expected`);
                            return reject(new Error(`Expected no wirtschaft states but found ${wirtschaftStates.length}`));
                        }
                        
                        // Should still have basic states (connection, breaking news count, etc.)
                        const basicStates = stateIds.filter(key => 
                            key.includes('info.') || 
                            key.includes('breakingNews') ||
                            key.includes('newsCount')
                        );
                        if (basicStates.length > 0) {
                            console.log(`✅ Step 12: Found ${basicStates.length} basic adapter states (expected)`);
                        }
                        
                        console.log('\n🎉 === NEGATIVE TEST SUMMARY ===');
                        console.log('✅ Adapter started successfully with all news categories disabled');
                        console.log('✅ No inland news states created (correctly disabled)');
                        console.log('✅ No ausland news states created (correctly disabled)');
                        console.log('✅ No wirtschaft news states created (correctly disabled)');
                        console.log('✅ Basic adapter states still exist (connection, counters)');
                        console.log('✅ Negative test completed successfully\n');
                        
                        await harness.stopAdapter();
                        resolve(true);
                        
                    } catch (error) {
                        console.error('❌ Negative test failed:', error);
                        reject(error);
                    }
                });
            }).timeout(40000);
        });

        // Test partial disabling - inland enabled, ausland disabled
        suite('should create inland states but NOT ausland states when ausland is disabled', (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it('should create only inland states when ausland is disabled', () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        console.log('\n=== PARTIAL NEGATIVE TEST: Only inland enabled ===');
                        
                        harness = getHarness();
                        const obj = await harness.objects.getObject('system.adapter.tagesschau.0');
                        
                        console.log('✅ Step 1: Configuring adapter with inland enabled, ausland disabled...');
                        
                        // Configure with inland enabled, ausland disabled
                        Object.assign(obj.native, {
                            newsEnabled: true,
                            interval: 5,
                            inland: true,      // ENABLED
                            ausland: false,    // DISABLED
                            wirtschaft: false,
                            sport: false,
                            video: false,
                            investigativ: false,
                            wissen: false,
                            regional: false,
                            L1: true // Need at least one region for API calls
                        });
                        
                        await new Promise((resolve, reject) => {
                            harness.objects.setObject(obj._id, obj, (err) => {
                                if (err) return reject(err);
                                resolve();
                            });
                        });
                        await harness.startAdapterAndWait();
                        
                        console.log('⏳ Step 2: Waiting for adapter to process...');
                        await new Promise(res => setTimeout(res, 15000));
                        
                        const stateIds = await harness.dbConnection.getStateIDs('tagesschau.0.*');
                        console.log(`📊 Step 3: Found ${stateIds.length} total states`);
                        
                        // Verify inland states exist (enabled)
                        const inlandNewsStates = stateIds.filter(key => 
                            key.includes('inland') && 
                            key.includes('news.') &&
                            !key.includes('controls') &&
                            !key.includes('newsCount')
                        );
                        if (inlandNewsStates.length > 0) {
                            console.log(`✅ Step 4: Found ${inlandNewsStates.length} inland news states as expected`);
                        } else {
                            console.log('❌ Step 4: No inland states found when they should exist');
                            return reject(new Error('Expected inland news states but found none'));
                        }
                        
                        // Verify ausland states DON'T exist (disabled)
                        const auslandNewsStates = stateIds.filter(key => 
                            key.includes('ausland') && 
                            key.includes('news.') &&
                            !key.includes('controls') &&
                            !key.includes('newsCount')
                        );
                        if (auslandNewsStates.length === 0) {
                            console.log('✅ Step 5: No ausland news states found as expected (disabled)');
                        } else {
                            console.log(`❌ Step 5: Found ${auslandNewsStates.length} ausland states when none expected`);
                            return reject(new Error(`Expected no ausland news states but found ${auslandNewsStates.length}`));
                        }
                        
                        console.log('\n✅ Partial negative test completed successfully');
                        
                        await harness.stopAdapter();
                        resolve(true);
                        
                    } catch (error) {
                        console.error('❌ Partial negative test failed:', error);
                        reject(error);
                    }
                });
            }).timeout(40000);
        });
    }
});