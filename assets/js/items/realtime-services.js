var list = {
  carers: {
    urlUsers: '/carers-users',
    usersCount: [],
    cssClass: '.carers'
  },
  licensing: {
    urlUsers: '/licensing-users',
    usersCount: [],
    cssClass: '.licensing'
  },
  sorn: {
    urlUsers: '/sorn-users',
    usersCount: [],
    cssClass: '.sorn'
  },
  taxDisc: {
    urlUsers: '/tax-disc-users',
    usersCount: [],
    cssClass: '.tax-disc'
  }
};

if (typeof offline !== 'undefined') {
  list.carers.offlineUsers = allowance_json;
  list.carers.offlineData = [];
  list.licensing.offlineUsers = licensing_json;
  list.licensing.offlineData = [];
  list.sorn.offlineUsers = sorn_json;
  list.sorn.offlineData = [];
  list.taxDisc.offlineUsers = tax_disc_json;
  list.taxDisc.offlineData = [];
};

var fcoList = {
  legalise: {
    urlUsers: '/legalise-users'
  },
  legalisePremium: {
    urlUsers: '/legalise-premium-users'
  },
  marriedAbroad: {
    urlUsers: '/married-abroad-users'
  },
  birthAbroad: {
    urlUsers: '/birth-abroad-users'
  },
  deathAbroad: {
    urlUsers: '/death-abroad-users'
  }
};

if (typeof offline !== 'undefined') {
  fcoList.legalise.offlineUsers = pay_legalisation_post_json;
  fcoList.legalise.offlineData = [];
  fcoList.legalisePremium.offlineUsers = pay_legalisation_drop_off_json;
  fcoList.legalisePremium.offlineData = [];
  fcoList.marriedAbroad.offlineUsers = pay_foreign_marriage_certificates_json;
  fcoList.marriedAbroad.offlineData = [];
  fcoList.birthAbroad.offlineUsers = pay_register_birth_abroad_json;
  fcoList.birthAbroad.offlineData = [];
  fcoList.deathAbroad.offlineUsers = pay_register_death_abroad_json;
  fcoList.deathAbroad.offlineData = [];
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

  initDisplay: function() {

    // 1st set the loadOffline.limitMarker to the SHORTEST data set - just to catch any weird variance
    for (var item in list) {
      var currentLength = list[item].offlineUsers.data.length;
      if (currentLength < loadOffline.limitMarker) {
        loadOffline.limitMarker = currentLength;
      }
    }
    for (var item in fcoList) {
      var currentLength = fcoList[item].offlineUsers.data.length;
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
    for (var i = 0; i < list.carers.offlineUsers.data.length; i++) {
      tempDate.setTime(Date.parse(list.carers.offlineUsers.data[i]._timestamp));
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
      var num = list[item].offlineUsers.data[loadOffline.startCounter].unique_visitors;
      $(list[item].cssClass + ' .figure').text(addCommas(num));
    }

    num = 0;
    for (var item in fcoList) {
      num += fcoList[item].offlineUsers.data[loadOffline.startCounter].unique_visitors;
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
  if (typeof offline !== 'undefined') {

    //loadOffline.loadData();
    loadOffline.initDisplay();

    // ...and simply increment once every 2 mins to (almost) match JSON data
    var update = window.setInterval(loadOffline.incrementUsers, 2*60*1000);

  } else {

    loadRealtime.reloadUsers();

    // set up a "wobble"
    var wobble = window.setInterval(loadRealtime.wobbleDisplays, 10e3);
    // poll gov.uk once every hour(?)
    var update = window.setInterval(loadRealtime.reloadUsers, 3600000);

  }
});
