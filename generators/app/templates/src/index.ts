'use strict';

import {FooBarClass} from './FooBar.class'
import {FooBarInterface} from "./FooBar.interface";

export default function hello(user = 'World') {
    const fooBar: FooBarInterface = {
        iAmANumber: 42,
        iAmAString: "ciao",
        iAmAObject: {
            iAmASubNumber: 23
        }
    }

    const fooBarSetup: FooBarInterface = fooBar;
    const fooBarClass = new FooBarClass(fooBarSetup);
    return `Hello ${user}, this is <%= appname %> and fooBar is ${fooBarClass.foo.iAmANumber}!\n`;
}

if (require.main === module) {
    process.stdout.write(hello());
}
