love.run.foo['example'] = function(args){
    args&&console.log(args.example, args.example2.example);
};
love.run.foo.example(love.run.args.example.pop());
