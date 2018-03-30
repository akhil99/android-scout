var database = firebase.database();
var ref = database.ref();

var imageTable, oppSwitcPlacedList, scalePlacedList, switchPlacedList, vaultPlacedList, climbList, parkedList, commentsList;

function searchTeams(){
  var number = document.getElementById('searchTeam').value;
  console.log('search team ' + number);

  clearUI();

  if(!number){
    alert('Please enter a team number!');
    return;
  }

  ref.child('teams/' + number).on('child_added', function(snapshot){
    console.log(snapshot.val());
    imageTable.append(newImageElement(snapshot.val()));
  });

  var e1 = newElement(number);
  var e2 = newElement(number);
  var parent = document.getElementById('teamgraphs');
  parent.appendChild(e1);
  parent.appendChild(e2);
  getData(parseInt(number), showTeamData, e1, e2);

}

function showTeamData(element, element2, data) {
    var oppTrace = {
        y: data[0],
        text: data[7].map(function(match) {return 'Match #' + match}),
        boxpoints: 'all',
        name: 'Opponent Switch',
        marker: {color: '#3F51B5'},
        type: 'box'
    };

    var scaleTrace = {
        y: data[1],
        text: data[7].map(function(match) {return 'Match #' + match}),
        boxpoints: 'all',
        name: 'Scale',
        marker: {color: '#f44336'},
        type: 'box'
    };

    var switchTrace = {
        y: data[2],
        text: data[7].map(function(match) {return 'Match #' + match}),
        boxpoints: 'all',
        name: 'Switch',
        marker: {color: '#673AB7'},
        type: 'box'
    };

    var vaultTrace = {
        y: data[3],
        text: data[7].map(function(match) {return 'Match #' + match}),
        boxpoints: 'all',
        name: 'Vault',
        marker: {color: '#FFC107'},
        type: 'box'
    };

    var layout = {
        autosize: true,
        title: 'Cube Scoring: Team #' + data[9],
        yaxis: {
            zeroline: true,
            showgrid: true,
            autorange: true
        },
        xaxis: {
            title: 'Match',
            zeroline: true
        },
        margin: {
            l: 30,
            r: 0,
            b: 100,
            t: 150,
            pad: 20
        },
        legend: {
            orientation: "h",
            x: 0,
            y: 1.2
        },
        boxmode: 'group'
    };

    Plotly.newPlot(element, [oppTrace, scaleTrace, switchTrace, vaultTrace], layout, {displayModeBar: false, staticPlot: true});

    var oppTrace = {
        y: data[0],
        x: data[7].map(function(match) {return 'Match #' + match}),
        line: {shape: 'spline'},
        name: 'Opponent Scale',
        type: 'scatter',
        marker: {color: '#3F51B5'}
    };

    var scaleTrace = {
        y: data[1],
        x: data[7].map(function(match) {return 'Match #' + match}),
        line: {shape: 'spline'},
        name: 'Scale',
        type: 'scatter',
        marker: {color: '#f44336'}
    };

    var switchTrace = {
        y: data[2],
        x: data[7].map(function(match) {return 'Match #' + match}),
        line: {shape: 'spline'},
        name: 'Switch',
        type: 'scatter',
        marker: {color: '#673AB7'}
    };

    var vaultTrace = {
        y: data[3],
        x: data[7].map(function(match) {return 'Match #' + match}),
        line: {shape: 'spline'},
        name: 'Vault',
        type: 'scatter',
        marker: {color: '#FFC107'}
    };

    var layout = {
        autosize: true,
        title: 'Cube Scoring: Team #' + data[9],
        yaxis: {
            zeroline: true,
            showgrid: true,
            autorange: true
        },
        xaxis: {
            title: 'Match',
            zeroline: true
        },
        margin: {
            l: 30,
            r: 0,
            b: 100,
            t: 150,
            pad: 20
        },
        legend: {
            orientation: "h",
            x: 0,
            y: 1.2
        },
        boxmode: 'group'
    };

    Plotly.newPlot(element2, [oppTrace, scaleTrace, switchTrace, vaultTrace], layout, {displayModeBar: false, staticPlot: true});
}

function getData(team, callback, e1, e2){
  var oppCubesPlaced = [];
  var scaleCubesPlaced = [];
  var switchCubesPlaced = [];
  var vaultCubesPlaced = [];
  var climbResults = [];
  var parkResults = [];
  var superComments = [];
  var matches = [];
  var alliances = [];

  ref.child('matches').orderByChild('team').equalTo(team).once('value', function(snapshot){
      var data = snapshot.val();
      console.log(data);

      arrayOfSortedObjects = Object.keys(data).sort(function(a,b) {
          return data[a].match - (data[b].match);
      });

      console.log(arrayOfSortedObjects);

      for(index in arrayOfSortedObjects) {
        key = arrayOfSortedObjects[index];
        console.log(key);
        var entry = data[key];
        if(entry['T']) {

            oppCubesPlaced.push(entry['T']['Tos']);
            scaleCubesPlaced.push(entry['T']['Tsc']);
            switchCubesPlaced.push(entry['T']['Tsw']);
            vaultCubesPlaced.push(entry['T']['Tsv']);
            climbResults.push(entry['T']['Tcr']);
            parkResults.push(entry['T']['Tpk']);
        }
        if(entry['super']) superComments.push(entry['super']);
        if(entry['P'] && entry['P']['cmnt']) superComments.push(entry['P']['cmnt']);
        matches.push(entry['match']);
        alliances.push(entry['alliance']);
      }

      callback(e1, e2, [oppCubesPlaced, scaleCubesPlaced, switchCubesPlaced, vaultCubesPlaced, climbResults, parkResults, superComments, matches, alliances, team]);
  });
}

function newElement(data) {
    var element = document.createElement('div');
    element.classList = 'col-xs-3 col-md-6 teamElement';
    return element;
}

function clearUI(){
  imageTable.innerHTML = null;
  climbList.innerHTML = null;
  commentsList.innerHTML = null;
}

function newImageElement(imageURL){
  var element = document.createElement('div');
  element.classList = 'col-xs-6 col-md-3';
  var a = document.createElement('a');
  a.href = imageURL;
  a.classList = 'thumbnail';
  var img = document.createElement('img');
  img.width = 400;
  img.height = 400;
  img.src = imageURL;
  a.append(img);
  element.append(a);
  return element;
}

function newCommentElement(comment){
  var element = document.createElement('li');
  element.classList = 'list-group-item';
  element.innerText = comment;
  return element;
}

document.addEventListener('DOMContentLoaded', function(event) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('logged in');
    } else {
      console.log('logged out');
      window.location.replace('login.html');
    }
  });

  imageTable = document.getElementById('images');
  oppSwitchPlacedList = document.getElementById('oppSwitchPlacedList');
  scalePlacedList = document.getElementById('scalePlacedList');
  switchPlacedList = document.getElementById('switchPlacedList');
  vaultPlacedList = document.getElementById('vaultPlacedList');
  climbList = document.getElementById('climbList');
  parkedList = document.getElementById('parkingList');
  commentsList = document.getElementById('commentsList');
  document.getElementById('searchBtn').addEventListener('click', searchTeams);

});
