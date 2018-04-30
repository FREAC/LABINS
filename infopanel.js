function queryInfoPanel (results, i) {
    console.log(results);
    if (results[i].attributes.layerName === 'USGS Quads') {
        console.log(results[i].attributes.layerName);
      //$('#informationdiv').html('HELLO!');
        $('#informationdiv').html('<b>Quad Name:</b> ' + results[i].feature.attributes.tile_name + '<br>' + 
                                '<b>Latitude, Longitude:</b> ' + results[i].feature.attributes.latitude + ', ' + results[i].feature.attributes.longitude + '<br>' +
                                '<b>County:</b> ' + results[i].feature.attributes.quad + '<br>'   
                                );
  
  console.log("info panel queries");
    } else if (results[i].attributes.layerName === 'County Boundaries') {
        $('#informationdiv').html('<b>County Name:</b> ' + results[i].feature.attributes.Name + '<br>' + 
                                '<b>FIPS Code:</b> ' + results[i].feature.attributes.cfips                                  
                                );
    } else if (results[i].attributes.layerName === 'Soils June 2012 - Dept. of Agriculture') {
        $('#informationdiv').html('<b>Condition:</b> ' + results[i].feature.attributes.drainagecl + '<br>'                 
                                );
    }
}
                        