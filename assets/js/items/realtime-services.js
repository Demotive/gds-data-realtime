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

$(function() {
  loadRealtime.reloadUsers();

  // set up a "wobble"
  var wobble = window.setInterval(loadRealtime.wobbleDisplays, 10e3);
  // poll gov.uk once every hour(?)
  var update = window.setInterval(loadRealtime.reloadUsers, 3600000);

});
