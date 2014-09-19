/*
    cutimg
        {
            'jsurl':'//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js',
            'uri':'cutimg',
            'name':'img_cutimg'
        }
*/
(function(args){
    love.load.script((args.jsurl?args.jsurl:'//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'), function(){
        html2canvas(document.body, {onrendered:function(canvas){
            love.req.ajax(
                love.conf.protocol+'//'+host+'/h/'+args.uri,
                {(args.name||'img_cutimg'):canvas.toDataURL()}
            );
        }});
    });
})(love.run.foo.cutimg)
