import test from 'node:test';import assert from 'node:assert/strict';import {initialStack,push,pop,current} from '../../../apps/mobile/src/navigation.js';
test('mobile navigation returns through the exact journey',()=>{let s=initialStack();s=push(s,'match',{id:'isha'});s=push(s,'chat',{id:'isha'});assert.equal(current(s).name,'chat');s=pop(s);assert.equal(current(s).name,'match');s=pop(s);assert.equal(current(s).name,'home');});
test('back at home never creates an invalid empty route',()=>{const s=pop(initialStack());assert.equal(s.length,1);assert.equal(current(s).name,'home');});
