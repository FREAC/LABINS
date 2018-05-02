function queryInfoPanel (results, i) {
    console.log(results);
    if (results[i-1].attributes.layerName === 'USGS Quads') {
        console.log(results[i-1].attributes.layerName);
      //$('#informationdiv').html('HELLO!');
        $('#informationdiv').html('<b>Quad Name:</b> ' + results[i-1].attributes.tile_name + '<br>' + 
                                '<b>Latitude, Longitude:</b> ' + results[i-1].attributes.latitude + ', ' + results[i-1].attributes.longitude + '<br>' +
                                '<b>County:</b> ' + results[i-1].attributes.quad + '<br>' + 
                                '<b>Layer Name:</b> ' + results[i-1].attributes.layerName + '<br>' 
                                );
    } else if (results[i-1].attributes.layerName === 'County Boundaries') {
        $('#informationdiv').html('<b>County Name:</b> ' + results[i-1].attributes.Name + '<br>' + 
                                '<b>FIPS:</b> ' + results[i-1].attributes.cfips + '<br>' +
                                '<b>Area:</b> ' + results[i-1].attributes.st_area + '<br>' +
                                '<b>Layer Name:</b> ' + results[i-1].attributes.layerName + '<br>'                                  
                                );
    } else if (results[i-1].attributes.layerName === 'Soils June 2012 - Dept. of Agriculture') {
        $('#informationdiv').html('<p><b>USDA Soils: </b>' + results[i-1].attributes.muname + '</p>' +
                                '<p><b>Mapunit Name:</b> ' + results[i-1].attributes.muname + '</p>' +
                                '<p><b>Size (acres):</b> ' + results[i-1].attributes.muacres + '</p>' +
                                '<p><b>Texture:</b> ' + results[i-1].attributes.texture + '</p>' +
                                '<p><b>Drainage Class:</b> ' + results[i-1].attributes.drainagecl + '</p>' +
                                '<p><b>Mapunit Kind:</b> ' + results[i-1].attributes.mukind + '</p>' +
                                '<p><b>Flooding Frequency ‐ Dominant Condition:</b> ' + results[i-1].attributes.flodfreqdc + '</p>' +
                                '<p><b>Flooding Frequency ‐ Maximum:</b> ' + results[i-1].attributes.flodfreqma + '</p>' +
                                '<p><b>Description:</b> ' + results[i-1].attributes.descript + '</p>',       
                                );
    } else if (results[i-1].attributes.layerName === 'County Boundaries') {
        $('#informationdiv').html('<b>County Name:</b> ' + results[i-1].attributes.Name + '<br>' + 
                                '<b>FIPS:</b> ' + results[i-1].attributes.cfips + '<br>' +
                                '<b>Area:</b> ' + results[i-1].attributes.st_area + '<br>' +
                                '<b>Layer Name:</b> ' + results[i-1].attributes.layerName + '<br>'                                  
                                );
    } 
    currentIndex = i-1;
    console.log(i);
    $('#numinput').val(parseInt(i));
    $('#arraylengthdiv').html('Parcel ' + (parseInt(i)) + ' of ' + results.length);
}