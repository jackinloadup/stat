$(function() {
  $("#edit-stat-datepicker-start").datepicker();
  $("#edit-stat-datepicker-end").datepicker();
});

function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }

var previousPoint = null;
    $("#flot-auto-identifier-1").bind("plothover", function (event, pos, item) {
        $("#x").text(Math.round(pos.x.toFixed(2)));
        $("#y").text(Math.round(pos.y.toFixed(2)));

        if ($("#enableTooltip:checked").length > 0) {
	alert('woot'+dump(pos));
            if (item) {
                if (previousPoint != item.datapoint) {
                    previousPoint = item.datapoint;
                    
                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);
                    
                    showTooltip(item.pageX, item.pageY,
                                item.series.label + " of " + x + " = " + y);
                }
            }
            else {
                $("#tooltip").remove();
                previousPoint = null;            
            }
        }
    });

    $("#flot-auto-identifier-1").bind("plotclick", function (event, pos, item) {
        if (item) {
            $("#clickdata").text("You clicked point " + item.dataIndex + " in " + item.series.label + ".");
            Drupal.flot.flot_auto_identifier_1.highlight(item.series, item.datapoint);
        }
    });