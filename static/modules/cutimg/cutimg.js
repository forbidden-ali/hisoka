(function(args){
    love.load.script((args.jsurl?args.jsurl:'//cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'), function(){
        html2canvas(document.body, {onrendered:function(canvas){
            var url = '//'+love.conf.host+'/h/'+args.uri;
            if(love.socket.conneted[love.conf.ssl?'wss':'ws'+url]){
                love.socket.conneted[love.conf.ssl?'wss':'ws'+url].send(JSON.stringify({
                    (args.name||'img_cutimg'):canvas.toDataURL()
                }));
            }else{
                love.req.ajax(
                    love.conf.protocol+url,
                    {(args.name||'img_cutimg'):canvas.toDataURL()}
                );
            };
        }});
    });
})(love.run.mod.cutimg);

delete love.run.mod.cutimg;
