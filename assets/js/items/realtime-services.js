var carers = {
  urlUsers: '/carers-users',
  // array to hold realtime user values
  usersCount: [],

  loadUsers: function() {
    // clear the users array
    carers.usersCount.length = 0;
    $.ajax({
      dataType: 'json',
      cache: false,
      url: carers.urlUsers,
      success: function(d) {
        var i, _i;
        for (i=0, _i=d.data.length; i<_i; i++) {
          carers.usersCount.push(d.data[i].unique_visitors)
        }
        // update the display
        carers.updateUsersDisplay();
      }
    });
  },

  updateUsersDisplay: function() {
    var r = getRandomInt(0, carers.usersCount.length);
    $('.figure.carers').text(carers.usersCount[r]);
  },

};

var taxDisc = {
  urlUsers: '/tax-disc-users',
  // array to hold realtime user values
  usersCount: [],

  loadUsers: function() {
    // clear the users array
    taxDisc.usersCount.length = 0;
    $.ajax({
      dataType: 'json',
      cache: false,
      url: taxDisc.urlUsers,
      success: function(d) {
        var i, _i;
        for (i=0, _i=d.data.length; i<_i; i++) {
          taxDisc.usersCount.push(d.data[i].unique_visitors)
        }
        // update the display
        taxDisc.updateUsersDisplay();
      }
    });
  },

  updateUsersDisplay: function() {
    var r = getRandomInt(0, taxDisc.usersCount.length);
    $('.figure.tax-disc').text(taxDisc.usersCount[r]);
  },

};

var sorn = {
  urlUsers: '/sorn-users',
  // array to hold realtime user values
  usersCount: [],

  loadUsers: function() {
    // clear the users array
    sorn.usersCount.length = 0;
    $.ajax({
      dataType: 'json',
      cache: false,
      url: sorn.urlUsers,
      success: function(d) {
        var i, _i;
        for (i=0, _i=d.data.length; i<_i; i++) {
          sorn.usersCount.push(d.data[i].unique_visitors)
        }
        // update the display
        sorn.updateUsersDisplay();
      }
    });
  },

  updateUsersDisplay: function() {
    var r = getRandomInt(0, sorn.usersCount.length);
    $('.figure.sorn').text(sorn.usersCount[r]);
  },

};

$(function() {

  // carer's allowance
  carers.loadUsers();
  // set up a "wobble"
  var carersWobble = window.setInterval(carers.updateUsersDisplay, 10e3);
  // poll gov.uk once every 5 minutes
  var carersUpdate = window.setInterval(carers.loadUsers, 300e3);

  // sorn
  sorn.loadUsers();
  // set up a "wobble"
  var sornWobble = window.setInterval(sorn.updateUsersDisplay, 10e3);
  // poll gov.uk once every 5 minutes
  var sornUpdate = window.setInterval(sorn.loadUsers, 300e3);

  // tax disc
  taxDisc.loadUsers();
  // set up a "wobble"
  var taxDiscWobble = window.setInterval(taxDisc.updateUsersDisplay, 10e3);
  // poll gov.uk once every 5 minutes
  var taxDiscUpdate = window.setInterval(taxDisc.loadUsers, 300e3);
});
