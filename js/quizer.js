let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	hide_navi_icons();
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// EN songs
const en_1980_gr_icon = [
	'pop_rock',
	'rock',
	'pop_medium',
	'pop_hard',
	'disco'
];

const EN_1980_GR_PACK_1 = 1;
const EN_1980_GR_PACK_2 = 2;
const EN_1980_GR_PACK_3 = 4;
const EN_1980_GR_PACK_4 = 3;
const EN_1980_GR_PACK_5 = 5;

let en_1980_gr = [
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Bon Jovi',
		song : "You Give Love A Bad Name"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Bon Jovi',
		song : "Livin' On A Prayer"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Survivor',
		song : "Burning Heart",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Survivor',
		song : "Eye Of The Tiger",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Twisted Sister',
		song : "We're Not Gonna Take It"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Kiss',
		song : "Heaven's On Fire",
		year : 1984
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Clash",
		song : "Should I Stay or Should I Go"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Clash",
		song : "Rock the Casbah"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Duran Duran",
		song : "Rio",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Duran Duran",
		song : "A View to a Kill"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Duran Duran",
		song : "The Reflex"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "U2",
		song : "I Still Haven't Found What I'm Looking For"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "U2",
		song : "With Or Without You"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "REM",
		song : "Orange Crush"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "Call Me"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "The Tide Is High"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Roxette",
		song : "Listen To Your Heart",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Close To Me"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "INXS",
		song : "Devil Inside"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Bon Jovi',
		song : "Bed Of Roses"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Solid Rock",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Brothers In Arms",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Money For Nothing (1985)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Twisted Sister',
		song : "I Wanna Rock"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "U2",
		song : "Sunday Bloody Sunday"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Blondie",
		song : "One Way Or Another"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Lullaby"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Cure",
		song : "Friday I'm In Love"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "INXS",
		song : "Never Tear Us Apart"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "INXS",
		song : "Need You Tonight"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Crowded House",
		song : "Don't Dream It's Over"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Kiss',
		song : "I Was Made for Loving You",
		year : 1979,
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Kiss',
		song : "Rock And Roll All Nite",
		year : 1975,
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "REM",
		song : "Its The End Of The World As We Know It (And I Feel Fine)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "REM",
		song : "The One I Love"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Scorpions',
		song : "Rock You Like a Hurricane",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Def Leppard',
		song : "Pour Some Sugar on Me",
		year : 1988
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Metallica',
		song : "Master Of Puppets"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Metallica',
		song : "Seek & Destroy"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Iron Maiden',
		song : "The Trooper"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Sweet Child O' Mine"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Welcome To The Jungle"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'ACDC',
		song : "Hells Bells",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'ACDC',
		song : "You Shook Me All Night Long",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Judas Priest',
		song : "Breaking the Law (1980)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Anthrax',
		song : "A.I.R."
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Pink Floyd",
		song : "Another Brick In The Wall, Pt. 2",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Alice Cooper",
		song : "Bed of Nails"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Whitesnake",
		song : "Here I Go Again"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Lightning Strikes",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Let The Music Do The Talking",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Aerosmith",
		song : "Janie's Got A Gun",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Whitesnake",
		song : "Is this love"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Rolling Stones',
		song : "Start Me Up",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Metallica',
		song : "Battery"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Iron Maiden',
		song : "Run To The Hills"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Iron Maiden',
		song : "2 Minutes To Midnight"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Guns N Roses",
		song : "Knockin' On Heaven's Door"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'ACDC',
		song : "Back In Black",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Alice Cooper",
		song : "Poison"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "A Kind Of Magic"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "Crazy Little Thing Called Love"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Queen",
		song : "Another One Bites The Dust"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "ZZ Top",
		song : "Sharp Dressed Man"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "ZZ Top",
		song : "Gimme All Your Lovin'"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Dio",
		song : "Rainbow In The Dark (1983)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Every Breath You Take"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Roxanne"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Police',
		song : "Message In A Bottle"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'New Order',
		song : "Blue Monday"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'New Order',
		song : "Age Of Consent"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Toto',
		song : "Africa",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Van Halen',
		song : "Jump",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'UB40',
		song : "Red Red Wine"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Wham',
		song : "Wake Me Up Before You Go-Go"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Wham',
		song : "Young Guns (Go For It!)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Genesis',
		song : "Land Of Confusion"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Flock Of Seagulls',
		song : "I Ran"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "Private Eyes"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "Maneater"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Daryl Hall & John Oates',
		song : "Out of Touch"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Soul II Soul',
		song : "Back to Life (ft Caron Wheeler)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Men At Work',
		song : "Down Under"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Men At Work',
		song : "Who Can It Be Now?"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Beach Boys',
		song : "Wipeout (ft Fat Boys)",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Simple Minds',
		song : "Don't You"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Tears For Fears',
		song : "Everybody Wants to Rule the World"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Tears For Fears',
		song : "Shout"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Bangles',
		song : "Walk Like an Egyptian"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Bangles',
		song : "Manic Monday"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Go-Go's",
		song : "Vacation"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Eurythmix",
		song : "Sweet Dreams"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Eurythmix",
		song : "Love Is a Stranger"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Outfield",
		song : "Your Love"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Earth Wind & Fire",
		song : "Let's Groove"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Europe",
		song : "The Final Countdown"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Europe",
		song : "Carrie"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Genesis",
		song : "In Too Deep"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Genesis",
		song : "Invisible touch"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Flock Of Seagulls",
		song : "Wishing (If I Had A Photograph Of You)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Tears For Fears',
		song : "Mad world"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Men At Work',
		song : "It’s a mistake"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'UB40',
		song : "I'll Be Your Baby Tonight (ft Robert Palmer)"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'UB40',
		song : "Kingston Town"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Eurythmix',
		song : "There must be an angel"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Wham',
		song : "Everything She Wants"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Yazoo',
		song : "Don't Go"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Yazoo',
		song : "Only You"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Black',
		song : "Wonderful Life"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Run-DMC',
		song : "It's Like That"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'NWA',
		song : "Gangsta Gangsta"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Technotronic',
		song : "Pump Up The Jam"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Soft Cell',
		song : "Tainted Love"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Cutting Crew',
		song : "I Just Died in Your Arms Tonight",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'A-Ha',
		song : "Take On Me",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Lipps Inc',
		song : "Funkytown"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Culture Club',
		song : "Karma Chameleon"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Foreigner',
		song : "I Want To Know What Love Is"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Foreigner',
		song : "Urgent"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Level 42',
		song : "Lessons In Love"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Pointer Sisters',
		song : "I'm So Excited"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Ultravox',
		song : "Dancing With Tears In My Eyes (1984)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Bronski Beat',
		song : "Smalltown Boy"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "A La Carte",
		song : "Ring Me Honey"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Opus",
		song : "Life Is Life"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Digital Emotion",
		song : "Get Up Action",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Digital Emotion",
		song : "Go Go Yellow Screen",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Baccara",
		song : "Yes Sir, I Can Boogie",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Baccara",
		song : "Sorry, I'm a Lady",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Blue System",
		song : "My Bed Is Too Big",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "London Boys",
		song : "London Nights"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Al Bano & Romina Power",
		song : "Al ritmo di beguine (ti amo)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Al Bano & Romina Power",
		song : "Felicita"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Al Bano & Romina Power",
		song : "Liberta"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Goombay Dance Band",
		song : "Seven Tears"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Ricchi E Poveri",
		song : "Mamma Maria"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Ricchi E Poveri",
		song : "Piccolo Amore"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Ricchi E Poveri",
		song : "Voulez-Vous Danser"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Baby's Gang",
		song : "Challenger"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Righeira",
		song : "Vamos A La Playa"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "ELO (Electric Light Orchestra)",
		song : "Don't Bring Me Down"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "ELO (Electric Light Orchestra)",
		song : "Here Is The News"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "ELO (Electric Light Orchestra)",
		song : "Ticket To The Moon"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Spandau Ballet",
		song : "True"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Spandau Ballet",
		song : "To Cut A Long Story Short"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Berlin",
		song : "Take My Breath Away"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Laid back",
		song : "Sunshine reggae"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Laid back",
		song : "Elevator Boy",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Culture Club',
		song : "Do You Really Want to Hurt Me"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Yazz',
		song : "The Only Way Is Up (ft The Plastic Population)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Chicago',
		song : "Hard To Say I'M Sorry"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Bangles',
		song : "Eternal Flame"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Salt-N-Pepa',
		song : "Push It"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Salt-N-Pepa',
		song : "Shake Your Thang (ft E.U.)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Salt-N-Pepa',
		song : "Expression"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : 'Europe',
		song : "Rock the Night"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Yello',
		song : "The Race"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Yello',
		song : "Oh Yeah"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Videokids',
		song : "Woodpeckers From Space",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Videokids',
		song : "Do The Rap",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Videokids',
		song : "Communication Outer Space",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Technotronic',
		song : "Get Up (Before The Night Is Over)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Laid back",
		song : "High Society Girl"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Johnny Hates Jazz",
		song : "Shattered Dreams"
	},
	{
		pack : EN_1980_GR_PACK_4,
		group : "Duran Duran",
		song : "Wild boys"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Yello',
		song : "Vicious games (1985)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Shorts",
		song : "Comment ça va (1983)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'KC & The Sunshine Band',
		song : "Give It Up (1982)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'KC & The Sunshine Band',
		song : "That's the Way (I Like It) (1975)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Motley Crue",
		song : "Kickstart My Heart (1989)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Motley Crue",
		song : "Dr. Feelgood (1989)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "ABC",
		song : "When Smokey Sings (1987)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Air Supply",
		song : "Making Love Out of Nothing At All (1983)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Air Supply",
		song : "All Out of Love (1980)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Fleetwood Mac",
		song : "Everywhere (1987)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Talking Heads",
		song : "Burning Down the House (1983)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : "Talking Heads",
		song : "Once In a Lifetime (1980)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Rainbow",
		song : "I Surrender (1981)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Quiet Riot",
		song : "The Wild and the Young (1986)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Poison",
		song : "Talk Dirty to Me (1986)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "REO Speedwagon",
		song : "Keep On Loving You (1980)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Nazareth",
		song : "Dream On (1982)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Kiss',
		song : "War Machine (1982)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Def Leppard',
		song : "Run Riot (1987)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Def Leppard',
		song : "Hysteria (1987)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Cinderella',
		song : "Gypsy Road (1988)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Cars',
		song : "Drive (1984)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Boston',
		song : "Amanda (1986)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : "Heart",
		song : "Alone (1987)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Beach Boys',
		song : "Kokomo (1988)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Madness',
		song : "Our House (1982)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Madness',
		song : "House of Fun (1982)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Journey',
		song : "Don't Stop Believin'(1981)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Journey',
		song : "Open Arms (1982)"
	},
	{
		pack : EN_1980_GR_PACK_3,
		group : 'Madness',
		song : "Baggy Trousers (1980)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "Laid back",
		song : "White Horse (1983)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Romeo and Juliet (1981)"
	},
	{
		pack : EN_1980_GR_PACK_1,
		group : 'Dire Straits',
		song : "Walk of Life (1985)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "New Kids On the Block",
		song : "You Got It (The Right Stuff) (1988)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : "New Kids On the Block",
		song : "Hangin' Touch (1989)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Van Halen',
		song : "Inside (1986)",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Van Halen',
		song : "Panama (1984)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Van Halen',
		song : "Top Jimmy (1984)",
		ignore : true
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Pink Floyd",
		song : "Learning to Fly (1987)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Pink Floyd",
		song : "The Final Cut (1983)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Dio",
		song : "Evil Eyes (1983)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : "Dio",
		song : "The Last In Line (1984)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Judas Priest',
		song : "Electric Eye (1982)"
	},
	{
		pack : EN_1980_GR_PACK_2,
		group : 'Judas Priest',
		song : "Turbo Lover (1986)"
	},
	{
		pack : EN_1980_GR_PACK_5,
		group : 'Ultravox',
		song : "Hymn (1982)"
	}
];

let en_1980_gr_1 =	en_1980_gr.filter(item => item.pack == 1);
let en_1980_gr_2 =	en_1980_gr.filter(item => item.pack == 2);
let en_1980_gr_3 =	en_1980_gr.filter(item => item.pack == 3);
let en_1980_gr_4 =	en_1980_gr.filter(item => item.pack == 4);
let en_1980_gr_5 =	en_1980_gr.filter(item => item.pack == 5);


let music = [
	{
		arr: en_1980_gr,
		lang: 'en',
		year: '1980',
		type: 'gr',
		packs: [
				{
					arr: en_1980_gr_1,
					name: 'EN 1980s Groups: Pop-Rock',
				},
				{
					arr: en_1980_gr_2,
					name: 'EN 1980s Groups: Rock',
				},
				{
					arr: en_1980_gr_3,
					name: 'EN 1980s Groups: Pop Medium',
				},
				{
					arr: en_1980_gr_4,
					name: 'EN 1980s Groups: Pop Hard',
				},
				{
					arr: en_1980_gr_5,
					name: 'EN 1980s Groups: Disco',
				}
			]
	}
]

let songs_to_map;
let mapping_result;
function map_songs(){
	back = back_to_current_pack;
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#package_content').hide();
	$('#mapping_content').show();
	toggleLearn();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'en';
	year = '1980';
	artist_type = 'gr';
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = en_1980_gr_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	useUrlParam();
}

let pack_num;
let year_url = 'https://sunquiz.netlify.app/1980';

function useUrlParam() {
	var url_string = window.location.href; 
	var url = new URL(url_string);
	pack_num = url.searchParams.get("pack");
	if(pack_num){
		package_num(pack_num);
	}
	back = back_to_browser;
}

function back_to_browser(){
	window.location.href = year_url;
}

function back_to_current_pack(){
	back = back_to_browser;
	$('#mapping_content').hide();
	$('#map').show();
	package_num(pack_num);
}