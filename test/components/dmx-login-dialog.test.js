/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'

import component from 'components/dmx-login-dialog'

import dmx from 'dmx-api'
jest.mock('dmx-api', () => ({
    rpc: {
        getAuthorizationMethods: jest.fn().mockResolvedValue([]),
        login: jest.fn().mockResolvedValue({}),
    },
}));

describe('dmx-login-dialog', () => {

    const localVue = createLocalVue()

    const defaultOptions = { localVue }

    beforeAll(() => {
        localVue.directive('draggable', jest.fn())
        localVue.component('el-input', jest.fn());
        localVue.component('el-button', jest.fn());
        localVue.component('el-dialog', { template: '<div><slot></slot></div>' });

        // Improvement idea: Input data and check UI changes through DOM, e.g. user-centric approach
    })

    test('should request authorization methods on creation', async () => {
        // when:
        const wrapper = shallowMount(component, defaultOptions)

        // then:
        expect(dmx.rpc.getAuthorizationMethods).toHaveBeenCalled()
    })

    test('authMethods should equal auth methods returned from rpc', async () => {
        // given:
        const givenAuthMethods = [ 'Foo', 'Baz', 'Bar' ]
        dmx.rpc.getAuthorizationMethods.mockResolvedValue(givenAuthMethods)

        const wrapper = shallowMount(component, defaultOptions)

        // when:
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.authMethods).toEqual(givenAuthMethods)
    })

    test('authMethod should be first value returned from rpc', async () => {
        // given:
        const givenFirstAuthMethod = 'Foo'
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([ givenFirstAuthMethod, 'Baz', 'Bar' ])

        const wrapper = shallowMount(component, defaultOptions)

        // when:
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.authMethod).toBe(givenFirstAuthMethod)
    })

    test('showSelect should be false before auth method rpc finishes', async () => {
        // given:
        dmx.rpc.getAuthorizationMethods.mockReturnValue(new Promise(() => {}))

        const wrapper = shallowMount(component, defaultOptions)

        // when:
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.showSelect).toBe(false)
    })

    test('showSelect should be true when more than 1 auth method value returned', async () => {
        // given:
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([ 'Foo', 'Baz', 'Bar' ])

        const wrapper = shallowMount(component, defaultOptions)

        // when:
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.showSelect).toBe(true)
    })
    
    test('showSelect should be false when one auth method value returned', async () => {
        // given:
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([ 'Foo'])

        const wrapper = shallowMount(component, defaultOptions)

        // when:
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.showSelect).toBe(false)
    })

    test('showSelect should be false when no auth method value returned', async () => {
        // given:
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([])

        const wrapper = shallowMount(component, defaultOptions)

        // when:
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.showSelect).toBe(false)
    })

    test('login() should call rpc.login with username, password and authMethod', async () => {
        // given:
        const givenAuthMethod = 'Foo'
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([ givenAuthMethod ])

        const givenUsername = 'user'
        const givenPassword = 'pass'
        const wrapper = shallowMount(component, defaultOptions)

        await wrapper.vm.$nextTick()
        wrapper.vm.credentials.username = givenUsername
        wrapper.vm.credentials.password = givenPassword
        
        // when:
        wrapper.vm.login()

        // then:
        expect(dmx.rpc.login).toHaveBeenCalledWith({ username: givenUsername, password: givenPassword}, givenAuthMethod)
    })

    test('login() should set positive result message when login succeeded', async () => {
        // given:
        const givenAuthMethod = 'Foo'
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([ givenAuthMethod ])

        const wrapper = shallowMount(component, defaultOptions)

        await wrapper.vm.$nextTick()
        
        // when:
        wrapper.vm.login()
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.message).toBe('Signing in OK')
        expect(wrapper.html()).toContain('Signing in OK')
    })

    test('login() should close dialog when login succeeded', async () => {
        // given:
        const givenAuthMethod = 'Foo'
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([ givenAuthMethod ])

        const wrapper = shallowMount(component, defaultOptions)

        await wrapper.vm.$nextTick()
        
        // when:
        wrapper.vm.login()
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.emitted()['close']).toBeTruthy()
    })

    test('login() should set negative result message when login failed', async () => {
        // given:
        dmx.rpc.login.mockRejectedValue(new Error())

        const givenAuthMethod = 'Foo'
        dmx.rpc.getAuthorizationMethods.mockResolvedValue([ givenAuthMethod ])

        const wrapper = shallowMount(component, defaultOptions)

        await wrapper.vm.$nextTick()
        
        // when:
        wrapper.vm.login()
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.vm.message).toBe('Signing in failed')
        await wrapper.vm.$nextTick()
        expect(wrapper.html()).toContain('Signing in failed')
    })

    test('login() should not close dialog when login failed', async () => {
        // given:
        dmx.rpc.login.mockRejectedValue(new Error())

        const wrapper = shallowMount(component, defaultOptions)

        await wrapper.vm.$nextTick()
        
        // when:
        wrapper.vm.login()
        await wrapper.vm.$nextTick()

        // then:
        expect(wrapper.emitted()['close']).toBeFalsy()
    })

    test('close() should close dialog', async () => {
        // given:
        const wrapper = shallowMount(component, defaultOptions)

        await wrapper.vm.$nextTick()
        
        // when:
        wrapper.vm.close()

        // then:
        expect(wrapper.emitted()['close']).toBeTruthy()
    })

    test('opened() should put focus on username field', async () => {
        // given:
        const wrapper = shallowMount(component, defaultOptions)
        const focus = jest.fn()
        wrapper.vm.$refs.username = { focus }

        // when:
        wrapper.vm.opened()

        // then:
        expect(focus).toHaveBeenCalled()
    })

    test('opened() should clear a previous message', async () => {
        // given:
        const wrapper = shallowMount(component, defaultOptions)
        wrapper.vm.$refs.username = { focus: jest.fn() }

        await wrapper.vm.$nextTick()
        wrapper.vm.login()
        await wrapper.vm.$nextTick()

        // when:
        wrapper.vm.opened()

        // then:
        expect(wrapper.vm.message).toBe('')
    })
})
