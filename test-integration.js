#!/usr/bin/env node

// Test script to verify full frontend-backend integration

const axios = require('axios');

const API_BASE = 'http://localhost:5173/api';

async function testIntegration() {
    console.log('Testing Frontend-Backend Integration...\n');

    try {
        // 1. Test health check
        console.log('1. Testing health check...');
        const healthResponse = await axios.get(`${API_BASE}/health`);
        console.log('   ✅ Health check passed:', healthResponse.data);

        // 2. Test scramble generation
        console.log('\n2. Testing scramble generation...');
        const scrambleResponse = await axios.get(`${API_BASE}/scramble/3x3?length=20`);
        console.log('   ✅ Scramble generated:', scrambleResponse.data.scramble_string);

        // 3. Test cube solving
        console.log('\n3. Testing cube solving...');
        // Apply scramble to solved cube and try to solve it
        const solveResponse = await axios.post(`${API_BASE}/solve`, {
            cube_state: {
                size: '3x3',
                state: 'DRLUUBFBRBLURRLRUBLRDDFDLFUFUFFDBRDUBRUFLLFDDBFLUBLRBD' // A scrambled state
            },
            solver_type: 'kociemba'
        });
        console.log('   ✅ Solution found:', solveResponse.data.solution.join(' '));
        console.log('   Move count:', solveResponse.data.move_count);
        console.log('   Solver used:', solveResponse.data.solver_used);

        // 4. Test solver list
        console.log('\n4. Testing solver list...');
        const solversResponse = await axios.get(`${API_BASE}/solvers`);
        console.log('   ✅ Available solvers:', Object.keys(solversResponse.data.solvers));

        console.log('\n✅ All integration tests passed!');
        console.log('\nFrontend-Backend integration is working correctly.');
        console.log('The application is ready to use at http://localhost:5173');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
        process.exit(1);
    }
}

testIntegration();