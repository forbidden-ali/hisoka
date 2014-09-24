love.run.foo.cutimg = function(args){
    var data = {};
    love.load.script((args.jsurl?args.jsurl:'//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'), function(){
        html2canvas(document.body, {onrendered:function(canvas){
            data[args.name||'img_cutimg'] = canvas.toDataURL();
            love.req.infoback(args.uri, ['autoinfo'], data);
        }});
    });
};
love.run.foo.cutimg(love.run.args.cutimg.pop());
