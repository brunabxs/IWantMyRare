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

var updateServers = function() {
  jQuery('#server option').remove();

  jQuery('#server').append('<option>Goldrinn</option>');
  jQuery('#server').append('<option>Azralon</option>');
};

var updateRaresTable = function(server, callback) {
  jQuery.get('/rares/' + server)
  .done(function(data) {
    jQuery('table#rares tbody tr').remove();

    jQuery.each(data.rares, function(index, rare) {
      var row = jQuery('<tr></tr>');
      row.append('<td>' + '<a href="#" class="edit" onclick="openRareDialog(\'' + server + '\', \'' + rare.name + '\')"></a>' + '</td>');
      row.append('<td><a href="' + rare.link + '">' + rare.name + '</a></td>');
      row.append('<td>' + (dateFormat(rare.death) || '-') + '</td>');
      row.append('<td>' + rare.respawn.min + 'hrs ~ ' + rare.respawn.max + 'hrs</td>');
      if (rare.nextRespawn && rare.nextRespawn.min && rare.nextRespawn.max)
      {
        row.append('<td>' + dateFormat(rare.nextRespawn.min) + ' ~ ' + dateFormat(rare.nextRespawn.max) + '</td>');
      } else {
        row.append('<td>-</td>');
      }
      jQuery('table#rares tbody').append(row);
    });

    jQuery('#server-name a').text(server);
    
    callback();
  });
};

var openRareDialog = function(server, rare) {
  jQuery('#rare-dialog *[name="server"]').val(server);
  jQuery('#rare-dialog *[name="rare"]').val(rare);
  jQuery('#rare-dialog').dialog('open');
};

jQuery(document).ready(function() {
  updateServers();
  
  jQuery('#server-name, #rares').hide();

  jQuery('#server-name a').click(function() {
    jQuery('#server-dialog').dialog('open');
  });

  jQuery('#server-dialog').dialog({
    autoOpen: true,
    height: 200,
    width: 600,
    modal: true,
    closeOnEscape: false,
    buttons: {
      'Confirmar': function() {
        updateRaresTable(jQuery('#server').val(), function() {
          jQuery('#server-dialog').dialog('close');
          jQuery('#server-name, #rares').show();
        });
      }
    }
  });

  jQuery('#rare-dialog').dialog({
    autoOpen: false,
    height: 300,
    width: 600,
    modal: true,
    closeOnEscape: true,
    buttons: {
      'Confirmar': function() {
        var data = {};
        data['date'] = jQuery(this).find('*[name=date]').val();
        data['hour'] = jQuery(this).find('*[name=hour]').val();
        data['server'] = jQuery(this).find('*[name=server]').val();
        data['rare'] = jQuery(this).find('*[name=rare]').val();

        jQuery.post('/rares/' + data.server + '/' + data.rare, {data: data})
        .done(function(data) {
          console.log(data);
          updateRaresTable(jQuery('#server').val(), function() {
            jQuery(this).find('*[name=date]').val('');
            jQuery(this).find('*[name=hour]').val('');
            jQuery(this).find('*[name=server]').val('');
            jQuery(this).find('*[name=rare]').val('');
            jQuery('#rare-dialog').dialog('close');
          });
        });
      },
      'Cancelar': function() {
        jQuery('#rare-dialog').dialog('close');
      }
    }
  });
});