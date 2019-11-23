import { Injectable, Inject, MultiInject, Overwrite, Optional } from '../decorator';
import { providerContainer, rootContainer } from '../container';
import * as inversify from 'inversify';

describe('@Injectable() test', () => {
  it('should generate single instance', () => {
    @Injectable()
    class Origin { }

    @Injectable()
    class Target1 {
      @Inject()
      origin!: Origin;
    }

    @Injectable()
    class Target2 {
      @Inject()
      origin!: Origin;
    }

    const target1 = providerContainer.get(Target1);
    const target2 = providerContainer.get(Target2);
    expect(target1.origin).toBe(target2.origin);
  })

  it('should be insert clazz token into provider container with default param', () => {
    @Injectable()
    class Test1 { }
    const instance = providerContainer.get(Test1);
    expect(instance).not.toBeUndefined();
  });

  it('should be insert customize token into provider container', () => {
    @Injectable('test2_token')
    class Test2 { }
    const instance = providerContainer.get<Test2>('test2_token');
    expect(instance).not.toBeUndefined();
  });

  it('should be insert customize token into target container', () => {
    @Injectable('test3_token', 'root')
    class Test3 { }
    const instance = rootContainer.get<Test3>('test3_token');
    expect(instance).not.toBeUndefined();
  });
});

describe('@Overwrite() test', () => {
  it('should be overwrite bound', () => {
    @Injectable()
    class A {
      v = 1;
    }

    @Overwrite(A)
    class Aa {
      v = 2;
    }

    @Injectable()
    class Test {
      @Inject() a!: A;
    }

    const instance = providerContainer.get(Test);
    expect(instance.a.v).toBe(2);
  });

  it('should be bind to container when it unbound', () => {
    class A {
      v = 1;
    }

    @Overwrite(A)
    class Aa {
      v = 2;
    }

    @Injectable()
    class Test {
      @Inject() a!: A;
    }

    const instance = providerContainer.get(Test);
    expect(instance.a.v).toBe(2);
  });

  it('should be overwrite customize container bound', () => {
    @Injectable(A, 'root')
    class A {
      v = 1;
    }

    @Overwrite(A, 'root')
    class Aa {
      v = 2;
    }

    @Injectable(Test, 'root')
    class Test {
      @Inject() a!: A;
    }

    const instance = rootContainer.get(Test);
    expect(instance.a.v).toBe(2);
  });
});

describe('@Inject() test', () => {
  it('should be inject with reflact clazz', () => {
    let tokenRecord: any;
    jest.spyOn(inversify, 'inject').mockImplementationOnce(token => {
      tokenRecord = token;
      return (...args: any[]) => { }
    })

    @Injectable()
    class Test4 { }

    @Injectable()
    class Test5 {
      @Inject()
      private readonly test4!: Test4;
    }

    expect(tokenRecord).toBe(Test4);
  });
  it('should be inject with customize token', () => {
    let tokenRecord: any;
    jest.spyOn(inversify, 'inject').mockImplementationOnce(token => {
      tokenRecord = token;
      return (...args: any[]) => { }
    })

    @Injectable('test6_token')
    class Test6 { }

    @Injectable()
    class Test7 {
      @Inject('test6_token')
      private readonly test6!: Test6;
    }

    expect(tokenRecord).toBe('test6_token');
  });
});

describe('@MultiInject() test', () => {
  it('should be inject instance array', () => {
    @Injectable()
    class Test8 { }

    @Injectable()
    class Test9 {
      @MultiInject(Test8)
      test8!: Test8[];
    }

    const test9 = providerContainer.get<Test9>(Test9);
    expect(test9.test8).toBeInstanceOf(Array);
  });
});

describe('@Optional() test', () => {
  it('should be inject optional', () => {
    class Test8 {
      constructor(
        public x: string,
      ) { }
    }

    @Injectable()
    class Test9 {
      constructor(
        @Inject(Test8)
        @Optional()
        public test8: Test8 = new Test8('init')
      ) { }
    }

    const test9 = providerContainer.get<Test9>(Test9);
    expect(test9.test8.x).toEqual('init');
  });
});
