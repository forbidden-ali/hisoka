module.exports = function(str){
    this.author = 'quininer',
    this.description = 'This is an example of a test module',
    this.parms = 'str - string.',
    this.dependence = [];

    return main(str);
};

function main(str){
    console.log(str);
    return str;
};
