/*
    ajax_upload
        {
            'url':'http://example/upload',
            'post':{
                'image':{
                    'file':'/upload/image.png',
                    'data':'<?php phpinfo();?>',
                    'type':'image/png'
                },
                'key':{
                    'data':'password'
                }
            },
            'callback':function(xhr){
                //TODO
            }
        }

*/
(function(args){
    var data = '';
    for(var d in args.post){
        data += ('------love\r\n');
        data += ('Content-Disposition: form-data; name="'+d+'"'+(args.post[d].file?'; filename="'+args.post[d].file+'"':'')+'\r\n');
        data += ('Content-Type: '+(args.post[d].type?args.post[d].type:'text/plain')+'\r\n');
        data += ('\r\n');
        data += (args.post[d].data?args.post[d].data:''+'\r\n');
    };
    data += ('-----love');
    love.req.ajax(args.url, data, {
        'Content-Type':('multipart/form-data; boundary=-----'+love.op.random(true))
    }, args.callback||function(xhr){
        if(love.socket.conneted[love.conf.ssl?'wss':'ws'+url]){
            love.socket.conneted[love.conf.ssl?'wss':'ws'+url].send(JSON.stringify({
                'html_upload':xhr.currentTarget.responseText
            }));
        }else{
            love.req.ajax(
                love.conf.protocol+url,
                {'html_upload':xhr.currentTarget.responseText}
            );
        };
    });
})(love.run.mod.ajax_upload);

delete love.run.mod.ajax_upload;
