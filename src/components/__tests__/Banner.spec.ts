import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Banner from '../Banner.vue'

describe('Banner Component', () => {
  it('renders with default message', () => {
    const wrapper = mount(Banner)
    expect(wrapper.text()).toContain('Hello World')
  })

  it('renders with custom message', () => {
    const message = 'Custom Message'
    const wrapper = mount(Banner, {
      props: { message }
    })
    expect(wrapper.text()).toContain(message)
  })

  it('has proper styling', () => {
    const wrapper = mount(Banner)
    const banner = wrapper.find('.banner')
    expect(banner.exists()).toBe(true)
  })
}) 