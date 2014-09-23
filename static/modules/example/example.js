love.run.foo['example'] = function(args){
    args&&console.log(args.example);
};
love.run.foo.example(love.run.args.example.pop());
