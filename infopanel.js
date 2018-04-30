function queryInfoPanel (results, i) {
    console.log(results);
    if (results[i].layerName === 'USGS Quads') {
        console.log(results[i].layerName);
      //$('#informationdiv').html('HELLO!');
      $('#informationdiv').html('<b>Quad Name:</b> ' + results[i].feature.attributes.tile_name + '<br>' + 
                                '<b>Latitude, Longitude:</b> ' + results[i].feature.attributes.latitude + ', ' + results[i].feature.attributes.longitude + '<br>' +
                                '<b>County:</b> ' + results[i].feature.attributes.quad + '<br>'   
                                );
  
  console.log("info panel queries");
    }
}
                        