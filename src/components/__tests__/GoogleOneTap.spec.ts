import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import GoogleOneTap from '../GoogleOneTap.vue';

// Mock Google One Tap API
const mockGoogle = {
  accounts: {
    id: {
      initialize: vi.fn(),
      prompt: vi.fn(),
      renderButton: vi.fn(),
      disableAutoSelect: vi.fn()
    }
  }
};

describe('GoogleOneTap Component', () => {
  beforeEach(() => {
    // Clear mocks
    vi.clearAllMocks();
    
    // Mock window.google
    window.google = mockGoogle as any;
    
    // Properly mock document methods to avoid recursion
    const originalCreateElement = document.createElement;
    
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'script') {
        const scriptElement = originalCreateElement.call(document, 'script');
        // Add mock properties to avoid recursion
        Object.defineProperties(scriptElement, {
          src: { set: vi.fn(), get: () => 'https://accounts.google.com/gsi/client' },
          async: { set: vi.fn(), get: () => true },
          defer: { set: vi.fn(), get: () => true },
          onload: { set: vi.fn((callback) => setTimeout(callback, 0)) }
        });
        return scriptElement;
      }
      return originalCreateElement.call(document, tag);
    });
    
    // Mock document.head.appendChild
    vi.spyOn(document.head, 'appendChild').mockImplementation((element) => element);
  });

  it('renders the container div', () => {
    const wrapper = mount(GoogleOneTap, {
      props: {
        clientId: 'test-client-id'
      }
    });
    
    expect(wrapper.find('#google-one-tap-container').exists()).toBe(true);
  });

  it('initializes Google One Tap when script is loaded', async () => {
    mount(GoogleOneTap, {
      props: {
        clientId: 'test-client-id'
      }
    });
    
    // Wait for script load event
    await new Promise(resolve => setTimeout(resolve, 10));
    
    expect(mockGoogle.accounts.id.initialize).toHaveBeenCalledWith(expect.objectContaining({
      client_id: 'test-client-id'
    }));
  });

  it('emits success event when handleCredentialResponse is called with valid data', async () => {
    const wrapper = mount(GoogleOneTap, {
      props: {
        clientId: 'test-client-id'
      }
    });
    
    // Get component instance to access private methods
    const vm = wrapper.vm as any;
    
    // Mock JWT decode
    vi.mock('jwt-decode', () => ({
      jwtDecode: vi.fn().mockImplementation(() => ({
        email: 'test@example.com',
        name: 'Test User'
      }))
    }));
    
    // Call the handler directly with a mock response
    vm.handleCredentialResponse({ credential: 'mock-jwt-token' });
    
    // Check if success event was emitted with expected data
    await wrapper.vm.$nextTick();
    
    // Type assertion for emitted events
    const emitted = wrapper.emitted() as Record<string, any[]>;
    expect(emitted.success).toBeDefined();
    expect(emitted.success[0][0]).toEqual(expect.objectContaining({
      email: 'test@example.com',
      name: 'Test User'
    }));
  });
}); 