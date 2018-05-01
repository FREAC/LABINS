function queryInfoPanel (results, i) {
    console.log(results);
    if (results[i].attributes.layerName === 'USGS Quads') {
        console.log(results[i].attributes.layerName);
      //$('#informationdiv').html('HELLO!');
        $('#informationdiv').html('<b>Quad Name:</b> ' + results[i].attributes.tile_name + '<br>' + 
                                '<b>Latitude, Longitude:</b> ' + results[i].attributes.latitude + ', ' + results[i].attributes.longitude + '<br>' +
                                '<b>County:</b> ' + results[i].attributes.quad + '<br>' + 
                                '<b>Layer Name:</b> ' + results[i].attributes.layerName + '<br>' 
                                );
  
  console.log("info panel queries");
    } else if (results[i].attributes.layerName === 'County Boundaries') {
        $('#informationdiv').html('<b>County Name:</b> ' + results[i].attributes.Name + '<br>' + 
                                '<b>FIPS Code:</b> ' + results[i].attributes.cfips + '<br>' +
                                '<b>Layer Name:</b> ' + results[i].attributes.layerName + '<br>'                                  
                                );
    } else if (results[i].attributes.layerName === 'Soils June 2012 - Dept. of Agriculture') {
        $('#informationdiv').html('<b>Condition:</b> ' + results[i].attributes.drainagecl + '<br>' +
                                '<b>Layer Name:</b> ' + results[i].attributes.layerName + '<br>'                 
                                );
    }
    currentIndex = i;
    console.log(i);
    $('#numinput').val(parseInt(i)+1);
    $('#arraylengthdiv').html('Parcel ' + (parseInt(i)+1) + ' of ' + results.length);
}