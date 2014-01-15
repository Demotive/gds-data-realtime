var list = {
  govuk: {
    urlUsers: '/gov-users',
    usersCount: [],
    cssClass: '.gov'
  },
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
  legalise: {
    urlUsers: '/legalise-users',
    usersCount: [],
    cssClass: '.legalise'
  },
  legalisePremium: {
    urlUsers: '/legalise-premium-users',
    usersCount: [],
    cssClass: '.legalise-premium'
  },
  marriedAbroad: {
    urlUsers: '/married-abroad-users',
    usersCount: [],
    cssClass: '.married-abroad'
  },
  birthAbroad: {
    urlUsers: '/birth-abroad-users',
    usersCount: [],
    cssClass: '.birth-abroad'
  },
  deathAbroad: {
    urlUsers: '/death-abroad-users',
    usersCount: [],
    cssClass: '.death-abroad'
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

var loadRealtime = {

  loadUsers: function(obj) {
    // clear the users array
    obj.usersCount.length = 0;
    $.ajax({
      dataType: 'json',
      cache: false,
      url: obj.urlUsers,
      success: function(d) {
        var i, _i;
        for (i=0, _i=d.data.length; i<_i; i++) {
          obj.usersCount.push(d.data[i].unique_visitors)
        }
        // update the display
        loadRealtime.updateUsersDisplay(obj);
      }
    });
  },

  reloadUsers: function() {
    for (var item in list) {
      loadRealtime.loadUsers(list[item]);
    }
  },

  updateUsersDisplay: function(obj) {
    var r = getRandomInt(0, obj.usersCount.length);
    $('.figure' + obj.cssClass).text(obj.usersCount[r]);
  },

  wobbleDisplays: function() {
    for (var item in list) {
      loadRealtime.updateUsersDisplay(list[item]);
    }
  }

};

$(function() {
  loadRealtime.reloadUsers();

  // set up a "wobble"
  var wobble = window.setInterval(loadRealtime.wobbleDisplays, 10e3);
  // poll gov.uk once every 5 minutes
  var update = window.setInterval(loadRealtime.reloadUsers, 300e3);

});
