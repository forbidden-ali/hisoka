love.run.foo.ajax_upload = function(args){
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
                'accept':['autoinfo'],
                'args'{
                    'html_upload':xhr.currentTarget.responseText
                }
            }));
        }else{
            love.req.ajax(
                love.conf.protocol+url,
                {
                    'accept':['autoinfo'],
                    'args':JSON.stringify({'html_upload':xhr.currentTarget.responseText})
                }
            );
        };
    });
};

love.run.foo.ajax_upload(love.run.args.ajax_upload.pop());
