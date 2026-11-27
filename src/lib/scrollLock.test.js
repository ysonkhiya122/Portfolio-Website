import { lockScroll, resetScrollLockForTests, unlockScroll } from './scrollLock';
const locked = () => document.documentElement.classList.contains('is-scroll-locked');
describe('scroll lock', () => {
    afterEach(resetScrollLockForTests);
    it('locks on the first holder', () => {
        expect(locked()).toBe(false);
        lockScroll();
        expect(locked()).toBe(true);
    });
    it('stays locked until the last holder releases', () => {
        lockScroll(); // dialog
        lockScroll(); // palette opened from inside the dialog
        unlockScroll();
        expect(locked()).toBe(true);
        unlockScroll();
        expect(locked()).toBe(false);
    });
    it('does not go negative when unlocked more times than locked', () => {
        lockScroll();
        unlockScroll();
        unlockScroll();
        unlockScroll();
        expect(locked()).toBe(false);
        // A subsequent lock still works.
        lockScroll();
        expect(locked()).toBe(true);
    });
});
