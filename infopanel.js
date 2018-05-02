function queryInfoPanel (results, i) {
    console.log(results);
    // Set HTML templates for information panel
    if (results[i-1].attributes.layerName === 'USGS Quads') {
        $('#informationdiv').html('<b>Quad Name:</b> ' + results[i-1].attributes.tile_name + '<br>' + 
                                '<b>Latitude, Longitude:</b> ' + results[i-1].attributes.latitude + ', ' + results[i-1].attributes.longitude + '<br>' +
                                '<b>County:</b> ' + results[i-1].attributes.quad + '<br>' + 
                                '<b>Layer Name:</b> ' + results[i-1].attributes.layerName + '<br>' 
                                );
    } else if (results[i-1].attributes.layerName === 'County Boundaries') {
        $('#informationdiv').html('<p><b>County Name:</b> ' + results[i-1].attributes.ctyname + '</p>' + 
                                '<p><b>FIPS:</b> ' + results[i-1].attributes.cfips + '</p>' +
                                '<p><b>Area:</b> ' + results[i-1].attributes.st_area + '</p>' +
                                '<p><b>Layer Name:</b> ' + results[i-1].attributes.layerName + '</p>'                                  
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
    } else if (results[i-1].attributes.layerName === 'NGS Control Points') {
        $('#informationdiv').html('NGS Control Points: ' + results[i-1].attributes.name + '</p>' +
                                '<p>Latitude, Longitude: ' + results[i-1].attributes.dec_lat + ', ' +  results[i-1].attributes.dec_long + '</p>' +
                                '<p>County: ' + results[i-1].attributes.county + '</p>' + 
                                '<p>PID: ' + results[i-1].attributes.pid + '</p>' + 
                                '<p>Data Source: ' + '<a target="_blank" href=' + results[i-1].attributes.data_srce + '>here</a></p>' + 
                                '<p>Datasheet: ' + '<a href=' + results[i-1].attributes.datasheet2 + '>here</a></p>',
                                );
    } else if (results[i-1].attributes.layerName === 'City Limits') {
        $('#informationdiv').html('<p><b>City limits:</b> ' + results[i-1].attributes.name + '</p>' +
                                '<p><b>County:</b> ' + results[i-1].attributes.county + '</p>' +
                                '<p><b>Object ID:</b> ' + results[i-1].attributes.objectid + '</p>' +
                                '<p><b>tax_count:</b> ' + results[i-1].attributes.tax_count + '</p>' + 
                                '<p><b>Description:</b> ' + results[i-1].attributes.descript + '</p>'   
                                );
    } else if (results[i-1].attributes.layerName === 'Parcels') {
        $('#informationdiv').html('<p><b>Parcels:</b> ' + results[i-1].attributes.objectid + '</p>' + 
                                '<p><b>Parcel ID:</b> ' + results[i-1].attributes.parcel_id + '</p>' +
                                '<p><b>City:</b> ' + results[i-1].attributes.own_city + '</p>' +
                                '<p><b>State:</b> ' + results[i-1].attributes.own_state + '</p>' +
                                '<p><b>Address:</b> ' + results[i-1].attributes.phy_addr1 + '</p>'
                                );
    } else if (results[i-1].attributes.layerName === 'Preliminary NGS Points') {
        $('#informationdiv').html('<p><b>Preliminary NGS Control Points: </b>' + results[i-1].attributes.FeatureID + '</p>' +
                                '<p><b>Designation: </b>' + results[i-1].attributes.base_and_survey.sde.Prelim_NGS_12_21_2011b.designatio + '</p>' +
                                '<p><b>Latitude: </b>' + results[i-1].attributes.base_and_survey.sde.Prelim_NGS_12_21_2011b.latdecdeg + '</p>' + 
                                '<p><b>Longitude: </b>' + results[i-1].attributes.base_and_survey.sde.Prelim_NGS_12_21_2011b.londecdeg + '</p>' +
                                '<p>Abstract: ' + '<a href=' + results[i-1].attributes.base_and_survey.sde.PUBLISHED_PRELIMINARY.abstract + '>' + base_and_survey.sde.PUBLISHED_PRELIMINARY.l_number + '</a></p>',
                                '<p>Description: ' + '<a href=' + results[i-1].attributes.base_and_survey.sde.PUBLISHED_PRELIMINARY.description2 + '>' + base_and_survey.sde.PUBLISHED_PRELIMINARY.l_number + '</a></p>',
        );
    } else if (results[i-1].attributes.layerName === 'Tide Stations') {
        $('#informationdiv').html('<p><b>Tide Station ID: </b>' + results[i-1].attributes.id + '</p>' +
                                '<p><b>County: </b>' + results[i-1].attributes.countyname + '</p>' +
                                '<p><b>Quad: </b>' + results[i-1].attributes.quadname + '</p>' + 
                                '<p><b>Status: </b>' + results[i-1].attributes.status + '</p>' +
                                '<p><b>MHW (feet): </b>' + results[i-1].attributes.navd88mhw_ft + '</p>' +
                                '<p><b>MLW (feet): </b>' + results[i-1].attributes.navd88mlw_ft + '</p>' +
                                "<p><b>Steven's ID: </b>" + results[i-1].attributes.navd88mlw_ft + '</p>' +
                                '<p>DEP Report: ' + '<a href=' + results[i-1].attributes.report_dep + '>' + results[i-1].attributes.filename + '</a></p>',

        );
    } else if (results[i-1].attributes.layerName === 'Tide Interpolation Points') {
        $('#informationdiv').html(

        );
    } else if (results[i-1].attributes.layerName === 'R-Monuments') {
        $('#informationdiv').html(

        );
    } else if (results[i-1].attributes.layerName === 'Erosion Control Line') {
        $('#informationdiv').html(

        );
    } else if (results[i-1].attributes.layerName === 'Survey Benchmarks') {
        $('#informationdiv').html(

        );
    } else if (results[i-1].attributes.layerName === 'Tide Interpolation Points') {
        $('#informationdiv').html(

        );
    }
    currentIndex = i-1;
    console.log(i);
    $('#numinput').val(parseInt(i));
    $('#arraylengthdiv').html('Parcel ' + (parseInt(i)) + ' of ' + results.length);
}