var DECK_BASE = 17;
var RED = 11;
var BLUE = 6;
var row = {
  'rrr': 0,
  'rrb': 1,
  'bbr': 2,
  'bbb': 3
};
var trash = {
  'r': 0,
  'b': 0
};
rDeck = {
  1: 17, 2: 14, 3: 11, 4: 8, 5: 5, 6: 12, 7: 9, 8: 6, 9: 3
};
rName = {
  1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine'
};
var dataKeys = ['d', 'r', 'b'];
var oddsKeys = ['rrr', 'rrb', 'bbr', 'bbb'];
var oddsInternalKeys = ['first', 'second', 'third', 'total'];
var cont = document.querySelector('.main-cont');
if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
}
var round = {};
var currentCalc = '';
var firstRound = getRound(1);

function getRound(n) {
  var roundTable = document.querySelector('.oddT.' + rName[n]);
  var roundData = document.querySelector('.dataT.' + rName[n]);
  var a = Array.prototype.slice.apply(roundTable.querySelectorAll(".RRR td"));
  var b = Array.prototype.slice.apply(roundTable.querySelectorAll(".RRB td"));
  var c = Array.prototype.slice.apply(roundTable.querySelectorAll(".BBR td"));
  var d = Array.prototype.slice.apply(roundTable.querySelectorAll(".BBB td"));
  var data = Array.prototype.slice.apply(roundData.querySelectorAll("td"));
  var stats = smash(data, dataKeys, true);
  var tmpNST = {
    'r': parseInt(stats.r),
    'b': parseInt(stats.b)
  };
  var cards = [a.slice(0,1)[0], b.slice(0,1)[0], c.slice(0,1)[0], d.slice(0,1)[0]];
  var rows = [a.splice(1, 4), b.splice(1, 4), c.splice(1, 4), d.splice(1, 4)];

  function createListeners() {
    for (i=0;i<cards.length;i++) {
      for (j=0;j<cards[i].childElementCount;j++) {
        cards[i].children[j].addEventListener('click', listenerCallback, false);
      }
    }
  }

  function listenerCallback() {
    for (i=0;i<cards.length;i++) {
      for (j=0;j<cards[i].childElementCount;j++) {
        cards[i].children[j].removeEventListener('click', listenerCallback, false);
      }
    }
    if (n !== 9) {
      currentCalc = this.parentNode.parentNode.classList.value.toLowerCase().split('');
      for (i=0;i<currentCalc.length;i++) {
        if (tmpNST[currentCalc[i]] <= 0) tmpNST[currentCalc[i]] = 0;
        else {
          tmpNST[currentCalc[i]]--;
          trash[currentCalc[i]]++;
        }
      }
      trash[this.classList.value.split('')[0]]--;
      if (n === 5) {
        tmpNST = {
          'r': parseInt(tmpNST.r)+parseInt(trash.r),
          'b': parseInt(tmpNST.b)+parseInt(trash.b)
        };
        trash.r = 0; trash.b = 0;
      }
      console.log(trash);
      addDiv();
      round = getRound(n+1);
    }
  }

  function getOdds(input) {
    var deck = stats.d;
    var e = rows[row[input]];
    var seq = input.split('');
    var tmpNS = {
      'r': stats.r,
      'b': stats.b
    };

    for (var j = 0; j < 3; j++) {
      if (tmpNS[seq[j]] <= 0) tmpNS[seq[j]] = 0;
      e[j].innerText = ((tmpNS[seq[j]]-- / deck--) * 100).toPrecision(3);
    }

    if (row[input] === 1 || row[input] === 2) {
      e.last().innerText = (((parseFloat(e[0].innerText) * parseFloat(e[1].innerText) * parseFloat(e[2].innerText)) / 10000) * 3).toPrecision(3);
    } else {
      e.last().innerText = ((parseFloat(e[0].innerText) * parseFloat(e[1].innerText) * parseFloat(e[2].innerText)) / 10000).toPrecision(3);
    }
  }

  function calculate() {
    getOdds('rrr');
    getOdds('rrb');
    getOdds('bbr');
    getOdds('bbb');
  }

  function createObj(rows) {
    var oddsTmp = [];
    for (var i = 0; i < rows.length; i++) {
      var tmp = smash(rows[i], oddsInternalKeys, true);
      oddsTmp.push(tmp);
    }
    var oddsObj = smash(oddsTmp, oddsKeys, false);
    var round = {
      'cont': roundTable,
      'cont-data': roundData,
      'odds': oddsObj,
      'stats': stats
    };
    return round;
  }

  function smash(obj, ref, inner) {
    var newObj = obj.reduce(function(newObj, field, index) {
      if (inner) newObj[ref[index]] = field.innerText;
      else newObj[ref[index]] = field;
      return newObj;
    }, {});
    return newObj;
  }

  function addDiv() {
    var markup = `
    <div class="in-title">ROUND ${n+1}</div>
    <div class="tables">
    <table class="oddT ${rName[n+1]}">
    <th colspan="5">N/A</th>
    <th colspan="1">
    <button>+</button>
    </th>
    <tr class="RRR">
    <td><span class="red">R</span><span class="red">R</span><span class="red">R</span></td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    </tr>
    <tr class="RRB">
    <td><span class="red">R</span><span class="red">R</span><span class="blue">B</span></td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    </tr>
    <tr class="BBR">
    <td><span class="blue">B</span><span class="blue">B</span><span class="red">R</span></td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    </tr>
    <tr class="BBB">
    <td><span class="blue">B</span><span class="blue">B</span><span class="blue">B</span></td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    <td>-</td>
    </tr>
    </table>
    <table class="dataT ${rName[n+1]}">
    <th colspan="1">Data</th>
    <tr class="deck">
    <td>${rDeck[n+1]}</td>
    </tr>
    <tr class="redD">
    <td>${tmpNST.r}</td>
    </tr>
    <tr class="blueD">
    <td>${tmpNST.b}</td>
    </tr>
    </table>
    </div>
    `;
    var insert = document.createElement('div');
    insert.classList = 'cont';
    insert.innerHTML = markup;
    cont.append(insert);
  }

  calculate();
  createListeners();
  return createObj(rows);
}
