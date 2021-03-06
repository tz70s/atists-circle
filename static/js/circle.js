var width = 800,
    height = 800;
var chairOriginX = 400 + ((100) * Math.sin(0));
var chairOriginY = 400 - ((100) * Math.cos(0));
var nodes = [];
var links = [];
var search_artist = [];

var def_artist = ["Vancouver sleep clinic","https://i.scdn.co/image/e38af57bfc3aef11b0081ad2d06787662e209cff"];

$(function() {
    search_artist = def_artist;
    $.getJSON($SCRIPT_ROOT + '/defrelated',
    function(data) {
        set_layout(data);
    });
});

$('#go-but').bind('click keypress', function() {
    var name = $('input[name="search_name"]').val();
    layout_trans(name);
});

var layout_trans = function (artists_name) {
    d3.select('.displated').select('svg').selectAll('*').remove();
    $.getJSON($SCRIPT_ROOT + '/songs',{
            artist: artists_name,
        },
            function(data) {

                var top_tracks = [];
                var tracks_name = [];
                for (var i = 0; i < data["tracks"].length ; i++) {
                    top_tracks.push(data["tracks"][i]["preview_url"]);
                    tracks_name.push(data["tracks"][i]["name"]);
                }

                var count = 0;
                var audio = document.getElementById("player");
                var song = [];
                
                song.push(document.getElementById("song1"));
                song.push(document.getElementById("song2"));
                song.push(document.getElementById("song3"));
                song.push(document.getElementById("song4"));
                song.push(document.getElementById("song5"));
                song.push(document.getElementById("song6"));
                song.push(document.getElementById("song7"));
                for (var i = 0; i < 7; i++ ){
                    if(tracks_name != ""){
                        $(song[i]).text(tracks_name[i]);
                        song[i].style.backgroundColor = "#FFFFFF";
                    } else {
                        $(song[i]).text("");
                    }
                    song[i].style.backgroundColor = "#FFFFFF";
                    count = 0;
                }
                audio.src = top_tracks[count];
                audio.volume = 0.4;
                song[count].style.backgroundColor = "#B0E0E6";
                //song[count].style.opacity = 0.5;
                audio.load();
                audio.play();
                audio.addEventListener("ended", function() {
                            song[count].style.backgroundColor = "#FFFFFF";
                            count++;
                            audio.src = top_tracks[count];
                            song[count].style.backgroundColor = "#B0E0E6";
                            audio.load();
                            audio.play();
                });
            });

    $.getJSON($SCRIPT_ROOT + '/search', {
        artist: artists_name,
            }, function(data) {

            search_artist = [];
            $("#artist-name").text(data["artists"]["items"][0]["name"]);
            search_artist.push(data["artists"]["items"][0]["name"]);

            var uri = data['artists']['items'][0]['uri'];

            var pics_src = data['artists']['items'][0]['images'][0]['url'];
            $("#profile-pic").attr('src' , pics_src);
            search_artist.push(pics_src);


            var genre_length = data['artists']['items'][0]['genres'].length;
            if( genre_length !== 0) {
                $("#genre-display").text(data['artists']['items'][0]['genres'][0]);
            } else {
                $("#genre-display").text("No Genre Display");
            }
            
            var followers_src = "https://embed.spotify.com/follow/1/?uri=" + uri + "&size=basic&theme=light";
            $("#followers").attr('src', followers_src);

      });

    $.getJSON($SCRIPT_ROOT + '/related',{
            artist: artists_name
    },function(data) {
        set_layout(data);
    });

    $.getJSON($SCRIPT_ROOT + '/biosearch',{
            artist: artists_name
    },function(data) {
        $("#biography").text(data["artist"]["biographies"][0]["text"]);
    });
};

function set_layout(data) {

        
        var nodes = [];
        while(1) {
            if(search_artist[1] != "") break;
        }
        nodes.push({
            x : parseInt(Math.random()*10 + 400),
            y : parseInt(Math.random()*10 + 400),
            "img" : search_artist[1],
            "name": search_artist[0],
        });

        var links = [];
        for (var i = 0; i < data['artists'].length ; i++) {
            if (i > 9) {
                break;
            }
            nodes.push({
            x : parseInt(Math.random()*10 + 400),
            y : parseInt(Math.random()*10 + 400),
            "img" : data['artists'][i]['images'][0]['url'],
            "name": data['artists'][i]['name'],
        });
            links.push({
                source: 0,
                target: i
            });
        };
        links.push({
                source: 0,
                target: i
        });

        var svg = d3.select('.displated').select('svg')
                    .attr('width', width)
                    .attr('height', height);

                    var force = d3.layout.force()
                        .size([width, height])
                        .nodes(nodes)
                        .distance(150)
                        .charge(-7000)
                        .links(links)
                        .friction(0.9)
                        .gravity(0.2);

                    var link = svg.selectAll('.link')
                        .data(links)
                        .enter().insert('line')
                        .attr('class', 'link');

                    var node = svg.selectAll('.node')
                        .data(nodes)
                        .enter().append('g')
                        .call(force.drag);
                    
                    node.append("svg:image")
                          .attr("xlink:href", function(d){
                            return d.img;
                          })
                          .attr("x", -60)
                          .attr("y", -60)
                          .attr("width", function(d) {
                            return 120;
                          })
                          .attr("height", function(d) {
                            return 120;
                          });
                    node.append("svg:circle")
                        .attr("r", 65)
                        .attr("cx", 0)
                        .attr("cy", 0)
                        .attr("stroke","white")
                        .style("stroke-opacity",1)
                        .style("fill-opacity",0)
                        .attr("stroke-width",37)
                        .attr("fill","white");

                    node.append("text")
                        .attr("class", ".ntext")
                        .attr("x",-31)
                        .attr("y",-50)
                        .attr("fill","#2f4f4f")
                        .style("visibility","visible")
                        .style("font-size",10)
                        .style("font-weight","bold")
                        .text(function(d) { return d.name;});
                    
                    node.on('mouseover',function() {
                        $('html,body').css('cursor','pointer');
                        d3.select(this).select("text").style("font-size","15");
                    });
                    node.on('mouseout',function() {
                        $('html,body').css('cursor','default');
                        d3.select(this).select("text").style("font-size","10");
                    });
                    /*
                    node.on('mousedown',function() {
                        d3.select(this).select("text").style("font-size",15);
                    });
                    */
                    node.on('mouseup',function(d) {
                        $('html,body').css('cursor','default');
                        if (d.name != nodes[0]['name']) {
                            search_artist[1] = d.img;
                            search_artist[0] = d.name;
                            layout_trans(d.name);
                        }
                    });


                    force.on('tick', function() {
                        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
                        link.attr('x1', function(d) { return d.source.x; })
                            .attr('y1', function(d) { return d.source.y; })
                            .attr('x2', function(d) { return d.target.x; })
                            .attr('y2', function(d) { return d.target.y; });
                    });

                    force.start();

}


