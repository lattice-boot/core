import { UriUtils } from '..';

describe('UriUtils test', () => {

  describe('join test', () => {
    it('should be join multi path to clear target', () => {
      const target = UriUtils.join('aa', '//bb', 'cc');
      expect(target).toBe('/aa/bb/cc');
    });
  });

  describe('clean test', () => {
    it('should be clean repeat /', () => {
      const target = UriUtils.clean('/a///b/c');
      expect(target).toBe('/a/b/c');
    });

    it('shoud be add / to first', () => {
      const target = UriUtils.clean('a/b/c');
      expect(target).toBe('/a/b/c');
    });

    it('shoud be add / to first and clean repeat /', () => {
      const target = UriUtils.clean('a////b/c');
      expect(target).toBe('/a/b/c');
    });
  });
});
