var dateFormat = function(dataString) {
  var data = new Date(dataString);
  if (dataString)
  {
    return numberFormat(data.getDate()) + '/' + numberFormat(data.getMonth()+1) + ' ' + numberFormat(data.getHours()) + ':' + numberFormat(data.getMinutes());
  }
  return undefined;
};

var numberFormat = function(number) {
  return number > 10 ? number : '0'+number;
};


jQuery(document).ready(function() {
  jQuery.get('/rares/Goldrinn')
  .done(function(data) {
    jQuery('tbody tr').remove();

    jQuery.each(data.rares, function(index, rare) {
      var row = jQuery('<tr></tr>');
      row.append('<td>' + '<a class="edit"></a>' + '</td>');
      row.append('<td><a href="' + rare.link + '">' + rare.name + '</a></td>');
      row.append('<td>' + (dateFormat(rare.death) || '-') + '</td>');
      row.append('<td>' + rare.respawn.min + 'hrs ~ ' + rare.respawn.max + 'hrs</td>');
      if (rare.nextRespawn && rare.nextRespawn.min && rare.nextRespawn.max)
      {
        row.append('<td>' + dateFormat(rare.nextRespawn.min) + ' ~ ' + dateFormat(rare.nextRespawn.max) + '</td>');
      } else {
        row.append('<td>-</td>');
      }
      jQuery('tbody').append(row);
    });
  });
});
