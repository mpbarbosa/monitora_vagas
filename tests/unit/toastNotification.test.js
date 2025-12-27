/**
 * Toast Notification Tests
 * Tests for the toast notification system
 */

import { toast, TOAST_TYPES, TOAST_DURATIONS } from '../../src/services/toastNotification.js';

describe('ToastNotification', () => {
    beforeEach(() => {
        // Clear document body
        document.body.innerHTML = '';
        // Reset toast state
        if (toast.initialized) {
            toast.dismissAll();
            if (toast.container && toast.container.parentNode) {
                toast.container.parentNode.removeChild(toast.container);
            }
            toast.initialized = false;
            toast.container = null;
            toast.activeToasts.clear();
        }
    });

    afterEach(() => {
        // Cleanup
        toast.dismissAll();
        if (toast.container && toast.container.parentNode) {
            toast.container.parentNode.removeChild(toast.container);
        }
    });

    describe('Initialization', () => {
        it('should initialize container on first toast', () => {
            toast.show({ message: 'Test' });
            
            const container = document.getElementById('toast-container');
            expect(container).toBeTruthy();
            expect(container.getAttribute('role')).toBe('region');
            expect(container.getAttribute('aria-label')).toBe('Notifications');
            expect(container.getAttribute('aria-live')).toBe('polite');
        });

        it('should not create duplicate containers', () => {
            toast.show({ message: 'Test 1' });
            toast.show({ message: 'Test 2' });
            
            const containers = document.querySelectorAll('#toast-container');
            expect(containers.length).toBe(1);
        });
    });

    describe('Toast Display', () => {
        it('should create toast with correct message', () => {
            const message = 'Test message';
            toast.show({ message });
            
            const toastMessage = document.querySelector('.toast-message');
            expect(toastMessage).toBeTruthy();
            expect(toastMessage.textContent).toBe(message);
        });

        it('should apply correct type class', () => {
            toast.show({ message: 'Error', type: TOAST_TYPES.ERROR });
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl.classList.contains('toast-error')).toBe(true);
        });

        it('should default to info type', () => {
            toast.show({ message: 'Info' });
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl.classList.contains('toast-info')).toBe(true);
        });

        it('should add dismissible close button', () => {
            toast.show({ message: 'Test', dismissible: true });
            
            const closeBtn = document.querySelector('.toast-close');
            expect(closeBtn).toBeTruthy();
            expect(closeBtn.getAttribute('aria-label')).toBe('Fechar notificação');
        });

        it('should not add close button if not dismissible', () => {
            toast.show({ message: 'Test', dismissible: false });
            
            const closeBtn = document.querySelector('.toast-close');
            expect(closeBtn).toBeFalsy();
        });
    });

    describe('ARIA Attributes', () => {
        it('should set alert role for error toasts', () => {
            toast.show({ message: 'Error', type: TOAST_TYPES.ERROR });
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl.getAttribute('role')).toBe('alert');
            expect(toastEl.getAttribute('aria-live')).toBe('assertive');
        });

        it('should set status role for non-error toasts', () => {
            toast.show({ message: 'Info', type: TOAST_TYPES.INFO });
            
            const toastEl = document.querySelector('.toast');
            expect(toastEl.getAttribute('role')).toBe('status');
            expect(toastEl.getAttribute('aria-live')).toBe('polite');
        });
    });

    describe('Convenience Methods', () => {
        it('should show success toast', () => {
            toast.success('Success message');
            
            const toastEl = document.querySelector('.toast-success');
            expect(toastEl).toBeTruthy();
            expect(toastEl.querySelector('.toast-message').textContent).toBe('Success message');
        });

        it('should show error toast', () => {
            toast.error('Error message');
            
            const toastEl = document.querySelector('.toast-error');
            expect(toastEl).toBeTruthy();
        });

        it('should show warning toast', () => {
            toast.warning('Warning message');
            
            const toastEl = document.querySelector('.toast-warning');
            expect(toastEl).toBeTruthy();
        });

        it('should show info toast', () => {
            toast.info('Info message');
            
            const toastEl = document.querySelector('.toast-info');
            expect(toastEl).toBeTruthy();
        });
    });

    describe('Dismissal', () => {
        it('should dismiss toast when close button clicked', (done) => {
            const toastEl = toast.show({ message: 'Test' });
            const closeBtn = toastEl.querySelector('.toast-close');
            
            closeBtn.click();
            
            // Wait for animation
            setTimeout(() => {
                expect(toastEl.parentNode).toBeFalsy();
                done();
            }, 400);
        });

        it('should auto-dismiss after duration', (done) => {
            const duration = 100; // Short duration for testing
            const toastEl = toast.show({ message: 'Test', duration });
            
            setTimeout(() => {
                expect(toastEl.classList.contains('toast-hide')).toBe(true);
                done();
            }, duration + 50);
        }, 500);

        it('should not auto-dismiss if duration is 0', (done) => {
            const toastEl = toast.show({ message: 'Test', duration: 0 });
            
            setTimeout(() => {
                expect(toastEl.classList.contains('toast-show')).toBe(true);
                expect(toastEl.classList.contains('toast-hide')).toBe(false);
                done();
            }, 200);
        });

        it('should dismiss all toasts', () => {
            toast.show({ message: 'Test 1' });
            toast.show({ message: 'Test 2' });
            toast.show({ message: 'Test 3' });
            
            expect(toast.activeToasts.size).toBe(3);
            
            toast.dismissAll();
            
            // Wait for animation
            setTimeout(() => {
                expect(toast.activeToasts.size).toBe(0);
            }, 400);
        });
    });

    describe('Multiple Toasts', () => {
        it('should stack multiple toasts', () => {
            toast.show({ message: 'Toast 1' });
            toast.show({ message: 'Toast 2' });
            toast.show({ message: 'Toast 3' });
            
            const toasts = document.querySelectorAll('.toast');
            expect(toasts.length).toBe(3);
        });

        it('should track active toasts', () => {
            toast.show({ message: 'Toast 1' });
            toast.show({ message: 'Toast 2' });
            
            expect(toast.activeToasts.size).toBe(2);
        });
    });

    describe('Invalid Input Handling', () => {
        it('should default to info for invalid type', () => {
            toast.show({ message: 'Test', type: 'invalid-type' });
            
            const toastEl = document.querySelector('.toast-info');
            expect(toastEl).toBeTruthy();
        });
    });
});
