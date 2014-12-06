$.getJSON('/home/info?type=side')
.done(function(data){
    $.each(data.item, function(_, name){
        $('ul#side_item').append($('<li>').html($('<a>').text(name).attr('href', '/home/items/'+name)));
    });
    $.each(data.victim, function(_, name){
        $('ul#side_victim').append($('<li>').html($('<a>').text(name).attr('href', '/home/victims/'+name)));
    });
    $.each(data.page, function(_, name){
        $('ul#side_page').append($('<li>').html($('<a>').text(name).attr('href', '/home/pages/'+name)));
    });
    $.each(data.mod, function(_, name){
        $('ul#side_mod').append($('<li>').html($('<a>').text(name).attr('href', '/home/mods/'+name)));
    });
})
.fail(function(data){
    console.error('info err.');
});
