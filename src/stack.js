const _ = require('underscore');
// Comment: If you need ES modules for webpack, create a build script that temporarily changes this

let stack = [];

// Lägger ett element överst i stacken
exports.push = function (x) {
    stack.push(x);
};

// Returnerar det översta elementet i stacken och tar bort det
exports.pop = function () {
    // lägger till en bugg: returnerar element men tar inte bort det
    return _.last(stack);
}

// Returnerar det översta elementet i stacken
exports.peek = function () {
    return _.last(stack);
}
