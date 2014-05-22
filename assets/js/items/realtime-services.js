var offline = true;

var list = {
  carers: {
    urlUsers: '/carers-users',
    offline: '../data/carers-allowance.json',
    usersCount: [],
    offlineData: [],
    cssClass: '.carers'
  },
  licensing: {
    urlUsers: '/licensing-users',
    offline: '../data/licensing.json',
    usersCount: [],
    offlineData: [],
    cssClass: '.licensing'
  },
  sorn: {
    urlUsers: '/sorn-users',
    offline: '../data/sorn.json',
    usersCount: [],
    offlineData: [],
    cssClass: '.sorn'
  },
  taxDisc: {
    urlUsers: '/tax-disc-users',
    offline: '../data/tax-disc.json',
    usersCount: [],
    offlineData: [],
    cssClass: '.tax-disc'
  }
};

var fcoList = {
  legalise: {
    urlUsers: '/legalise-users',
    offline: '../data/pay-legalisation-post.json',
    offlineData: []
  },
  legalisePremium: {
    urlUsers: '/legalise-premium-users',
    offline: '../data/pay-legalisation-drop-off.json',
    offlineData: []
  },
  marriedAbroad: {
    urlUsers: '/married-abroad-users',
    offline: '../data/pay-foreign-marriage-certificates.json',
    offlineData: []
  },
  birthAbroad: {
    urlUsers: '/birth-abroad-users',
    offline: '../data/pay-register-birth-abroad.json',
    offlineData: []
  },
  deathAbroad: {
    urlUsers: '/death-abroad-users',
    offline: '../data/pay-register-death-abroad.json',
    offlineData: []
  }
};

var fcoCount = [0, 0, 0, 0, 0];

var loadRealtime = {

  loadUsers: function(obj) {
    $.ajax({
      dataType: 'json',
      cache: false,
      url: obj.urlUsers,
      success: function(d) {
        // clear the users array (on success)
        obj.usersCount.length = 0;
        var i, _i;
        for (i=0, _i=d.data.length; i<_i; i++) {
          obj.usersCount.push(d.data[i].unique_visitors)
        }
        // update the display
        loadRealtime.updateUsersDisplay(obj);
      }
    });
  },

  loadFCOUsers: function(obj) {
    $.ajax({
      dataType: 'json',
      cache: false,
      url: obj.urlUsers,
      success: function(d) {
        // reset the FCO count (on success)
        fcoCount = [0, 0, 0, 0, 0];
        var i, _i;
        for (i=0, _i=d.data.length; i<_i; i++) {
          fcoCount[i] = fcoCount[i] + parseInt(d.data[i].unique_visitors);
        }
        // update the display
        loadRealtime.updateFCOUsersDisplay();
      }
    });
  },

  reloadUsers: function() {
    for (var item in list) {
      loadRealtime.loadUsers(list[item]);
    }
    for (var item in fcoList) {
      loadRealtime.loadFCOUsers(fcoList[item]);
    }
  },

  updateUsersDisplay: function(obj) {
    var r = getRandomInt(0, obj.usersCount.length-1);
    $(obj.cssClass + ' .figure').text(addCommas(obj.usersCount[r]));
  },

  updateFCOUsersDisplay: function() {
    var r = getRandomInt(0, fcoCount.length-1);
    $('.fco .figure').text(addCommas(fcoCount[r]));
  },

  wobbleDisplays: function() {
    for (var item in list) {
      loadRealtime.updateUsersDisplay(list[item]);
    }
    loadRealtime.updateFCOUsersDisplay();
  }

};

var loadOffline = {

  startCounter: 0,
  limitMarker: 9999,
  loaded: 0,
  total: Object.keys(list).length + Object.keys(fcoList).length,

  loadUsers: function(obj) {
    $.ajax({
      dataType: 'json',
      cache: false,
      url: obj.offline,
      success: function(d) {
        obj.offlineData = d.data;
        loadOffline.loaded++;
        // if everything is loaded, update the display
        if (loadOffline.loaded === loadOffline.total) {
          loadOffline.initDisplay();
        }
      }
    });
  },

  initDisplay: function() {

    // 1st set the loadOffline.limitMarker to the SHORTEST data set - just to catch any weird variance
    for (var item in list) {
      var currentLength = list[item].offlineData.length;
      if (currentLength < loadOffline.limitMarker) {
        loadOffline.limitMarker = currentLength;
      }
    }
    for (var item in fcoList) {
      var currentLength = fcoList[item].offlineData.length;
      if (currentLength < loadOffline.limitMarker) {
        loadOffline.limitMarker = currentLength;
      }
    }

    var now = new Date;
    now.setTime(Date.now());
    var hour = now.getHours();
    var min = now.getMinutes();
    var tempDate = new Date;

    // loop through the CARERS (just because it's first in the list) data set and match the time as closely as possible.
    for (var i = 0; i < list.carers.offlineData.length; i++) {
      tempDate.setTime(Date.parse(list.carers.offlineData[i]._timestamp));
      tempHour = tempDate.getHours();

      if (tempHour === hour) {
        tempMin = tempDate.getMinutes();
        if (tempMin === min) {
          loadOffline.startCounter = i;
          break;
        }
        // catch and go back 1 if we've shot over the nearest minutes
        if (tempMin > min) {
          loadOffline.startCounter = i-1;
          break;
        }
      }
    }

    // display the figures
    loadOffline.updateUsersDisplay();

  },

  incrementUsers: function() {
    if (loadOffline.startCounter === loadOffline.limitMarker) {
      loadOffline.startCounter = 0;
    } else {
      loadOffline.startCounter++;
    }
    // display the updated figure
    loadOffline.updateUsersDisplay();
  },

  updateUsersDisplay: function() {

    var num = 0;

    for (var item in list) {
      var num = list[item].offlineData[loadOffline.startCounter].unique_visitors;
      $(list[item].cssClass + ' .figure').text(addCommas(num));
    }

    num = 0;
    for (var item in fcoList) {
      num += fcoList[item].offlineData[loadOffline.startCounter].unique_visitors;
    }
    $('.fco .figure').text(addCommas(num));

  },

  loadData: function() {
    for (var item in list) {
      loadOffline.loadUsers(list[item]);
    }
    for (var item in fcoList) {
      loadOffline.loadUsers(fcoList[item]);
    }
  },

};

$(function() {
  if (offline === false) {

    loadRealtime.reloadUsers();

    // set up a "wobble"
    var wobble = window.setInterval(loadRealtime.wobbleDisplays, 10e3);
    // poll gov.uk once every hour(?)
    var update = window.setInterval(loadRealtime.reloadUsers, 3600000);

  } else {

    loadOffline.loadData();

    // ...and simply increment once every 2 mins to (almost) match JSON data
    var update = window.setInterval(loadOffline.incrementUsers, 2*60*1000);

  }
});
