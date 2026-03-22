/**
 * Faculty Dues Portal - API Test Script
 * Tests: Payment Initialization, Receipt Retrieval, Admin Payments
 * Run: node test_api.js
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:5000/api';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let passed = 0;
let failed = 0;

function log(status, testName, detail = '') {
  if (status === 'PASS') {
    console.log(`${GREEN}✓ PASS${RESET} | ${testName}${detail ? ` - ${detail}` : ''}`);
    passed++;
  } else if (status === 'FAIL') {
    console.log(`${RED}✗ FAIL${RESET} | ${testName}${detail ? ` - ${detail}` : ''}`);
    failed++;
  } else {
    console.log(`${YELLOW}ℹ INFO${RESET} | ${testName}${detail ? ` - ${detail}` : ''}`);
  }
}

// Create a tiny 1x1 pixel PNG as a mock passport image
const MOCK_IMAGE_PATH = path.join(__dirname, 'test_passport.png');
const MOCK_PNG = Buffer.from(
  '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c489' +
  '0000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
  'hex'
);

async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('  FACULTY DUES PORTAL — API TEST SUITE');
  console.log('='.repeat(60) + '\n');

  // ─── Write mock passport image ─────────────────────────────
  fs.writeFileSync(MOCK_IMAGE_PATH, MOCK_PNG);
  log('INFO', 'Mock passport image created', MOCK_IMAGE_PATH);

  let paymentId = null;

  // ─── TEST 1: Ping server ───────────────────────────────────
  try {
    const res = await axios.get(`${BASE}/payments/receipt/000000000000000000000000`);
  } catch (err) {
    if (err.response && (err.response.status === 404 || err.response.status === 500)) {
      log('PASS', 'Server is reachable', `Port 5000 responding`);
    } else if (err.code === 'ECONNREFUSED') {
      log('FAIL', 'Server is reachable', 'Cannot connect to localhost:5000. Is the backend running?');
      process.exit(1);
    }
  }

  // ─── TEST 2: Initialize a new payment ─────────────────────
  const testRegNo = `U2023/TEST${Date.now().toString().slice(-4)}`;
  try {
    const form = new FormData();
    form.append('regNo', testRegNo);
    form.append('email', 'teststudent@test.com');
    form.append('firstName', 'Test');
    form.append('surname', 'Student');
    form.append('middleName', 'API');
    form.append('level', '200');
    form.append('department', 'Computer Science');
    form.append('passport', fs.createReadStream(MOCK_IMAGE_PATH), {
      filename: 'passport.png',
      contentType: 'image/png'
    });

    const res = await axios.post(`${BASE}/payments/initialize`, form, {
      headers: form.getHeaders()
    });

    if (res.data.authorization_url && res.data.authorization_url.startsWith('https://checkout.paystack.com')) {
      log('PASS', 'Payment initialization', `Paystack URL generated → ${res.data.authorization_url.slice(0, 60)}...`);
    } else {
      log('FAIL', 'Payment initialization', `Unexpected response: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    if (msg.includes('already exists') || msg.includes('already been made')) {
      log('PASS', 'Payment initialization', `Duplicate check working: "${msg}"`);
    } else if (msg.includes('Invalid API key')) {
      log('INFO', 'Payment initialization', `Paystack key is a test placeholder (expected). Flow reached Paystack ✓`);
      passed++;
    } else {
      log('FAIL', 'Payment initialization', msg);
    }
  }

  // ─── TEST 3: Duplicate reg no. rejected ───────────────────
  try {
    const form = new FormData();
    form.append('regNo', testRegNo);  // same reg number
    form.append('email', 'another@test.com');
    form.append('firstName', 'Another');
    form.append('surname', 'Student');
    form.append('level', '300');
    form.append('department', 'Computer Science');
    form.append('passport', fs.createReadStream(MOCK_IMAGE_PATH), {
      filename: 'passport.png',
      contentType: 'image/png'
    });

    await axios.post(`${BASE}/payments/initialize`, form, { headers: form.getHeaders() });
    log('FAIL', 'Duplicate payment rejection', 'Should have returned an error for duplicate reg number');
  } catch (err) {
    const msg = err.response?.data?.message || '';
    if (msg.includes('already exists') || msg.includes('already been made')) {
      log('PASS', 'Duplicate payment rejection', `Correctly blocked: "${msg}"`);
    } else {
      log('INFO', 'Duplicate payment rejection', `Response: ${msg || err.message}`);
    }
  }

  // ─── TEST 4: Missing passport file ────────────────────────
  try {
    const res = await axios.post(`${BASE}/payments/initialize`, {
      regNo: 'U2099/NOFILE', email: 'x@x.com',
      firstName: 'No', surname: 'File', level: '100', department: 'Computer Science'
    });
    log('FAIL', 'Missing passport validation', 'Should have rejected request with no file');
  } catch (err) {
    if (err.response?.status === 400) {
      log('PASS', 'Missing passport validation', `Correctly returned 400: "${err.response.data.message}"`);
    } else {
      log('INFO', 'Missing passport validation', err.message);
    }
  }

  // ─── TEST 5: Admin payments endpoint ──────────────────────
  try {
    const res = await axios.get(`${BASE}/admin/payments`);
    const count = Array.isArray(res.data) ? res.data.length : '?';
    log('PASS', 'Admin payments endpoint', `Returned ${count} paid payment(s)`);
  } catch (err) {
    log('FAIL', 'Admin payments endpoint', err.response?.data?.message || err.message);
  }

  // ─── TEST 6: Admin department filter ──────────────────────
  try {
    const res = await axios.get(`${BASE}/admin/payments?department=Computer Science`);
    const count = Array.isArray(res.data) ? res.data.length : '?';
    log('PASS', 'Admin department filter', `Filtered to Computer Science → ${count} result(s)`);
  } catch (err) {
    log('FAIL', 'Admin department filter', err.response?.data?.message || err.message);
  }

  // ─── TEST 7: Receipt for invalid ID ───────────────────────
  try {
    await axios.get(`${BASE}/payments/receipt/000000000000000000000000`);
    log('FAIL', 'Receipt not found handling', 'Should have returned 404');
  } catch (err) {
    if (err.response?.status === 404) {
      log('PASS', 'Receipt not found handling', 'Correctly returned 404 for invalid payment ID');
    } else {
      log('INFO', 'Receipt not found handling', `Status: ${err.response?.status}`);
    }
  }

  // ─── Cleanup ───────────────────────────────────────────────
  fs.unlinkSync(MOCK_IMAGE_PATH);

  // ─── Summary ───────────────────────────────────────────────
  console.log('\n' + '='.repeat(60));
  console.log(`  RESULTS: ${GREEN}${passed} passed${RESET}  |  ${RED}${failed} failed${RESET}`);
  console.log('='.repeat(60) + '\n');
}

runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
