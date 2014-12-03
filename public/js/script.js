jQuery(document).ready(function() {
  jQuery.get('/rares/goldrinn')
  .done(function(data) {
    jQuery('tbody tr').remove();

    jQuery.each(data.rares, function(index, rare) {
      var row = jQuery('<tr></tr>');
      row.append('<td>' + '<a class="edit"></a>' + '</td>');
      row.append('<td><a href="' + rare.link + '">' + rare.name + '</a></td>');
      row.append('<td>' + rare.deaths[0] + '</td>');
      row.append('<td>' + rare.respawn.min + 'hrs ~ ' + rare.respawn.max + 'hrs</td>');
      row.append('<td>' + rare.deaths[0] + ' ~ ' + rare.deaths[0] + '</td>');
      jQuery('tbody').append(row);
    });
  });
});
