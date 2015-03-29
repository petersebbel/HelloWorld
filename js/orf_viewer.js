var sync_scrollbars = function() {
    var length = $("#one").scrollLeft();
    $('#two').scrollLeft(length);
  };

 var sync_scrollbars_2 = function() {
    var length = $("#two").scrollLeft();
    $('#one').scrollLeft(length);
  };
  
  var kd_event = function() {
	$("#one").val($("#one").val().replace(/(\r\n|\n|\r|\s+)/gm,""));
	$("#one").val($("#one").val().replace(/[0-9]/gm,""));
	var temp = $("#one").val().replace(/(\r\n|\n|\r|\s+)/gm,"").toUpperCase();
	var temp2 = "" ;
	for (var i = 0; i < (temp.length / 100); i++) {
		temp2 += temp.substring(i*100, i*100+100) + "\n";
	}
	$("#one").val(temp2);
	var length = $("#one").scrollLeft();
	$('.result_box').remove();
	//$("#one").val($("#one").val().toUpperCase());
	var text = generate_translationBoxContent(temp);
	$('.result_box').scrollLeft(length);
	//$("#two").html(text);
	
	// $('.orf').on('click', function() {
		// if ($(this).hasClass('clicked')) {
			// $('.orf').removeClass('clicked');
			// $("#com").html(comp($("#one").val()));
			// $("#fwd").html($("#one").val());
			
		// } else {
			// $('.orf').removeClass('clicked');
			// $(this).addClass('clicked');
			// var temp = $(this).parent().attr('id') + " " +$(this).attr("name");
			// highlight_orf_coding_region(temp);
		// }
	// });
	// $('.orf').hover(function() {
		// $(this).toggleClass('hovered');
	// });
	
};



var reverse = function(s){
    return s.split("").reverse().join("");
}



var generate_translationBoxContent = function(seq) {
	
	//console.log(seq);
	var text = "";
	var ORFs = find_ORFs(seq);
	var rf_number = 0;
	ORFs.forEach( function(entry) {
		rf_number++;
		var divclass = "result_box";
		if (/n/i.test(entry.dna_seq)) {
			divclass += " pot_scaffold";
		};
		text = '<div class="' + divclass + '" id="' + rf_number + '"><pre>';
		text += generate_ORF_control(rf_number);
		
		var spacer = "";

		for (j = 0; j < Math.floor(entry.dna_seq.length / 10); j++) {
			spacer += "---------+";
		};
		for (j = 0; j < (entry.dna_seq.length % 10); j++) {
			spacer += "-";
		};
	
		text += '<span id="fwd">' + entry.dna_seq + '</span>\n';
		text += spacer + "\n";
		text += '<span id="com">' + comp(entry.dna_seq)  + '</span>\n';
		text += "AA Sequence:\n";
		text += entry.seq.split("").join("  ") + "<br>";
		text +=  "Start: " + entry.dna_start  + "<br>";
		text += "End: " + entry.dna_end  + "<br>" + "Reading Frame: " + entry.frame;
		$("#two").append(text);//'<div class=result_box id=' + rf_number + '>
		$("#" + rf_number).data("dna_seq", entry.dna_seq);
		"</br></pre></div>";
	});
		
		
}

var hide_orf = function(id) {
	var sel = '#'+id;
	$(sel).hide();
}

var restore_all_orfs = function() {
	$(".result_box").show();
}

var scaffold_orf = function(id) {
	sel = '#scaff_button_' + id;
	if ($(sel).prop("value") === "scaffold") {
		$(sel).prop("value", "no scaffold")
		var sel = '#'+id;
		$(sel).addClass('scaffold');
		generate_rnd_codon_div($(sel).data('dna_seq'), id);

	} else {
		$(sel).prop("value", "scaffold")
		var sel = '#'+id;
		$(sel).removeClass('scaffold');
	};
}

var generate_rnd_codon_div = function(seq, id) {
	var rnd_cdns = find_rnd_codons(seq);
	rnd_cdns.forEach(function(entry) {
		var div_id = "rndcdn_" + id;
		var text = '<div class=rnd_codon id="' + div_id + '">';
		text    +=  '<label for="Start">Start</label><input id="start" value="' + entry.start + '"/> ';
		text    +=  '<label for="Min Length">Min Length</label><input id="MinLength"  value="' + entry.length + '"/> ';
		text    +=  '<label for="MaxLength">Max Length</label><input class="spinner" id="spinner' + id + '" value="' + entry.length + '"/></div><hr>';
		//text    +=  entry.length;
		$("#" + id).append(text);
		$(".spinner").spinner({
			step: 3,
			numberFormat: "n",
			spin: function( event, ui ) {
				if ( ui.value < entry.length ) {
					$( this ).spinner( "value", entry.length );
					return false;
				}
			},
		});
	});
	
}


var generate_ORF_control = function(id) {
	var oc = "<div class=orf_control id=oc_" + id + ">";
	oc += '<input type="button" value="remove" onclick="hide_orf(' + id + ')">';
	oc += '<input type="button" id="scaff_button_' + id + '" value="scaffold" onclick="scaffold_orf(' + id + ')">';
	oc += '</div>';
	return oc;
}




