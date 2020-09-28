import hello from '../src/index';
import {FooBarClass} from "../src/FooBar.class";
import {FooBarInterface} from "../src/FooBar.interface";

describe('Hello', () => {
    it('Print Default', () => {
        const user = "world"
        const greetings = hello(user);
        expect(greetings).toEqual(`Hello ${user}, this is <%= appname %> and fooBar is 42!\n`);
    })
});

describe('Test FooBar Class', () => {
    it('is A FooBar', () => {
        const fooBar: FooBarInterface = {
            iAmANumber : 42,
            iAmAString: "ciao",
            iAmAObject: {
                iAmASubNumber : 23
            }
        }
        const fooBarClass = new FooBarClass(fooBar)
        expect(fooBarClass.foo).toEqual(fooBar);
    })
});
